/**
 * @claude-flow/cache-optimizer - Circuit Breaker
 *
 * Implements the circuit breaker pattern for resilient provider management.
 * Prevents cascading failures by temporarily disabling failing providers.
 */

import { EventEmitter } from 'events';

export type CircuitState = 'closed' | 'open' | 'half-open';

export interface CircuitBreakerConfig {
  /** Number of failures before opening circuit */
  failureThreshold: number;
  /** Time in ms to wait before attempting recovery */
  recoveryTimeout: number;
  /** Number of successful calls in half-open to close circuit */
  successThreshold: number;
  /** Time window in ms for counting failures */
  failureWindow: number;
  /** Minimum requests before evaluating failure rate */
  minimumRequests: number;
  /** Failure rate threshold (0-1) to trip circuit */
  failureRateThreshold: number;
}

export interface CircuitStats {
  state: CircuitState;
  failures: number;
  successes: number;
  lastFailure?: number;
  lastSuccess?: number;
  lastStateChange: number;
  totalRequests: number;
  failureRate: number;
}

const DEFAULT_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5,
  recoveryTimeout: 30000,
  successThreshold: 3,
  failureWindow: 60000,
  minimumRequests: 10,
  failureRateThreshold: 0.5,
};

/**
 * CircuitBreaker - Protects against cascading failures
 */
export class CircuitBreaker extends EventEmitter {
  private config: CircuitBreakerConfig;
  private state: CircuitState = 'closed';
  private failures: number[] = [];
  private successes: number = 0;
  private lastStateChange: number = Date.now();
  private totalRequests: number = 0;
  private recoveryTimer?: NodeJS.Timeout;

  constructor(
    public readonly name: string,
    config?: Partial<CircuitBreakerConfig>
  ) {
    super();
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Check if request should be allowed
   */
  canExecute(): boolean {
    this.cleanupOldFailures();

    switch (this.state) {
      case 'closed':
        return true;
      case 'open':
        // Check if recovery timeout has passed
        if (Date.now() - this.lastStateChange >= this.config.recoveryTimeout) {
          this.transitionTo('half-open');
          return true;
        }
        return false;
      case 'half-open':
        return true;
    }
  }

  /**
   * Record a successful execution
   */
  recordSuccess(): void {
    this.totalRequests++;

    switch (this.state) {
      case 'closed':
        // Reset failure count on success
        this.failures = [];
        break;
      case 'half-open':
        this.successes++;
        if (this.successes >= this.config.successThreshold) {
          this.transitionTo('closed');
        }
        break;
      case 'open':
        // Shouldn't happen, but handle gracefully
        break;
    }

    this.emit('success', this.getStats());
  }

  /**
   * Record a failed execution
   */
  recordFailure(error?: Error): void {
    this.totalRequests++;
    this.failures.push(Date.now());
    this.cleanupOldFailures();

    switch (this.state) {
      case 'closed':
        if (this.shouldTrip()) {
          this.transitionTo('open');
        }
        break;
      case 'half-open':
        // Any failure in half-open immediately opens circuit
        this.transitionTo('open');
        break;
      case 'open':
        // Already open, just record
        break;
    }

    this.emit('failure', { error, stats: this.getStats() });
  }

  /**
   * Check if circuit should trip open
   */
  private shouldTrip(): boolean {
    // Check absolute threshold
    if (this.failures.length >= this.config.failureThreshold) {
      return true;
    }

    // Check failure rate if minimum requests met
    if (this.totalRequests >= this.config.minimumRequests) {
      const failureRate = this.failures.length / this.totalRequests;
      if (failureRate >= this.config.failureRateThreshold) {
        return true;
      }
    }

    return false;
  }

  /**
   * Transition to new state
   */
  private transitionTo(newState: CircuitState): void {
    const oldState = this.state;
    this.state = newState;
    this.lastStateChange = Date.now();

    if (newState === 'closed') {
      this.failures = [];
      this.successes = 0;
    } else if (newState === 'half-open') {
      this.successes = 0;
    } else if (newState === 'open') {
      // Schedule recovery check
      this.scheduleRecoveryCheck();
    }

    this.emit('stateChange', { from: oldState, to: newState, stats: this.getStats() });
  }

  /**
   * Schedule recovery check for open circuit
   */
  private scheduleRecoveryCheck(): void {
    if (this.recoveryTimer) {
      clearTimeout(this.recoveryTimer);
    }

    this.recoveryTimer = setTimeout(() => {
      if (this.state === 'open') {
        this.transitionTo('half-open');
      }
    }, this.config.recoveryTimeout);
  }

  /**
   * Remove failures outside the time window
   */
  private cleanupOldFailures(): void {
    const cutoff = Date.now() - this.config.failureWindow;
    this.failures = this.failures.filter(t => t > cutoff);
  }

  /**
   * Get current stats
   */
  getStats(): CircuitStats {
    this.cleanupOldFailures();

    return {
      state: this.state,
      failures: this.failures.length,
      successes: this.successes,
      lastFailure: this.failures.length > 0 ? this.failures[this.failures.length - 1] : undefined,
      lastSuccess: undefined, // Would need to track this separately
      lastStateChange: this.lastStateChange,
      totalRequests: this.totalRequests,
      failureRate: this.totalRequests > 0 ? this.failures.length / this.totalRequests : 0,
    };
  }

  /**
   * Get current state
   */
  getState(): CircuitState {
    return this.state;
  }

  /**
   * Force circuit open (for testing/manual intervention)
   */
  forceOpen(): void {
    this.transitionTo('open');
  }

  /**
   * Force circuit closed (for testing/manual intervention)
   */
  forceClosed(): void {
    this.transitionTo('closed');
  }

  /**
   * Reset all stats
   */
  reset(): void {
    this.failures = [];
    this.successes = 0;
    this.totalRequests = 0;
    this.transitionTo('closed');
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.recoveryTimer) {
      clearTimeout(this.recoveryTimer);
    }
    this.removeAllListeners();
  }
}

/**
 * CircuitBreakerRegistry - Manages multiple circuit breakers
 */
export class CircuitBreakerRegistry {
  private breakers: Map<string, CircuitBreaker> = new Map();
  private defaultConfig: Partial<CircuitBreakerConfig>;

  constructor(defaultConfig?: Partial<CircuitBreakerConfig>) {
    this.defaultConfig = defaultConfig || {};
  }

  /**
   * Get or create a circuit breaker
   */
  get(name: string, config?: Partial<CircuitBreakerConfig>): CircuitBreaker {
    let breaker = this.breakers.get(name);
    if (!breaker) {
      breaker = new CircuitBreaker(name, { ...this.defaultConfig, ...config });
      this.breakers.set(name, breaker);
    }
    return breaker;
  }

  /**
   * Check if a provider can accept requests
   */
  canExecute(name: string): boolean {
    const breaker = this.breakers.get(name);
    return breaker ? breaker.canExecute() : true;
  }

  /**
   * Get all stats
   */
  getAllStats(): Record<string, CircuitStats> {
    const stats: Record<string, CircuitStats> = {};
    for (const [name, breaker] of this.breakers) {
      stats[name] = breaker.getStats();
    }
    return stats;
  }

  /**
   * Get all open circuits
   */
  getOpenCircuits(): string[] {
    const open: string[] = [];
    for (const [name, breaker] of this.breakers) {
      if (breaker.getState() === 'open') {
        open.push(name);
      }
    }
    return open;
  }

  /**
   * Reset all breakers
   */
  resetAll(): void {
    for (const breaker of this.breakers.values()) {
      breaker.reset();
    }
  }

  /**
   * Cleanup
   */
  destroy(): void {
    for (const breaker of this.breakers.values()) {
      breaker.destroy();
    }
    this.breakers.clear();
  }
}

export const defaultRegistry = new CircuitBreakerRegistry();
