/**
 * Environment Detection Utility for Outlaw-Flow v2.0
 * Detects execution environment and recommends appropriate flags
 */

import chalk from 'chalk';

export interface SandboxCapabilities {
  available: boolean;
  type: 'bubblewrap' | 'sandbox-exec' | 'none';
  bwrapPath: string | null;
  sandboxExecPath: string | null;
}

export interface ExecutionEnvironment {
  isInteractive: boolean;
  isVSCode: boolean;
  isVSCodeInsiders: boolean;
  isCI: boolean;
  isDocker: boolean;
  isSSH: boolean;
  isGitBash: boolean;
  isWindowsTerminal: boolean;
  supportsRawMode: boolean;
  supportsColor: boolean;
  terminalType: string;
  sandbox: SandboxCapabilities;
  recommendedFlags: string[];
  warnings: string[];
}

export interface EnvironmentOptions {
  skipWarnings?: boolean;
  autoApplyDefaults?: boolean;
  verbose?: boolean;
}

/**
 * Detects the current execution environment
 */
export function detectExecutionEnvironment(options: EnvironmentOptions = {}): ExecutionEnvironment {
  const env: ExecutionEnvironment = {
    isInteractive: false,
    isVSCode: false,
    isVSCodeInsiders: false,
    isCI: false,
    isDocker: false,
    isSSH: false,
    isGitBash: false,
    isWindowsTerminal: false,
    supportsRawMode: false,
    supportsColor: true,
    terminalType: 'unknown',
    sandbox: detectSandboxCapabilities(),
    recommendedFlags: [],
    warnings: []
  };

  // Basic TTY check
  env.isInteractive = Boolean(process.stdin.isTTY && process.stdout.isTTY);
  
  // Terminal program detection
  const termProgram = process.env.TERM_PROGRAM?.toLowerCase() || '';
  env.isVSCode = termProgram === 'vscode';
  env.isVSCodeInsiders = termProgram === 'vscode-insiders';
  env.terminalType = termProgram || process.env.TERM || 'unknown';
  
  // CI environment detection
  env.isCI = Boolean(
    process.env.CI ||
    process.env.GITHUB_ACTIONS ||
    process.env.GITLAB_CI ||
    process.env.JENKINS_URL ||
    process.env.CIRCLECI ||
    process.env.TRAVIS ||
    process.env.BUILDKITE ||
    process.env.DRONE
  );
  
  // Docker detection
  env.isDocker = Boolean(
    process.env.DOCKER_CONTAINER ||
    existsSync('/.dockerenv') ||
    (existsSync('/proc/1/cgroup') && readFileSync('/proc/1/cgroup', 'utf8').includes('docker'))
  );
  
  // SSH detection
  env.isSSH = Boolean(process.env.SSH_CLIENT || process.env.SSH_TTY);
  
  // Git Bash detection
  env.isGitBash = process.env.TERM_PROGRAM === 'mintty' || 
                  process.env.MSYSTEM?.startsWith('MINGW') || false;
  
  // Windows Terminal detection
  env.isWindowsTerminal = Boolean(process.env.WT_SESSION);
  
  // Raw mode support check
  env.supportsRawMode = checkRawModeSupport();
  
  // Color support check
  env.supportsColor = process.env.NO_COLOR !== '1' && 
                     process.env.TERM !== 'dumb' &&
                     (process.stdout.isTTY || process.env.FORCE_COLOR === '1');
  
  // Generate recommendations based on environment
  generateRecommendations(env);
  
  // Show warnings if requested
  if (!options.skipWarnings && env.warnings.length > 0) {
    showEnvironmentWarnings(env);
  }
  
  return env;
}

/**
 * Checks if raw mode is supported
 */
function checkRawModeSupport(): boolean {
  try {
    if (!process.stdin.isTTY) return false;
    if (typeof process.stdin.setRawMode !== 'function') return false;
    
    // Try to set raw mode and immediately restore
    const originalRawMode = process.stdin.isRaw;
    process.stdin.setRawMode(true);
    process.stdin.setRawMode(originalRawMode);
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Generates recommendations based on environment
 */
function generateRecommendations(env: ExecutionEnvironment): void {
  // VS Code specific recommendations
  if (env.isVSCode || env.isVSCodeInsiders) {
    env.recommendedFlags.push('--non-interactive');
    env.warnings.push('VS Code integrated terminal detected - interactive features may be limited');
  }

  // CI environment recommendations
  if (env.isCI) {
    env.recommendedFlags.push('--non-interactive');
    env.recommendedFlags.push('--json');
    env.warnings.push('CI environment detected - running in non-interactive mode');
  }

  // Docker recommendations
  if (env.isDocker && !env.isInteractive) {
    env.recommendedFlags.push('--non-interactive');
    env.warnings.push('Docker container without TTY - interactive features disabled');
  }

  // SSH without TTY
  if (env.isSSH && !env.isInteractive) {
    env.recommendedFlags.push('--non-interactive');
    env.warnings.push('SSH session without TTY - consider using ssh -t');
  }
  
  // Git Bash specific
  if (env.isGitBash) {
    env.warnings.push('Git Bash detected - some interactive features may not work correctly');
  }
  
  // Raw mode not supported
  if (!env.supportsRawMode && env.isInteractive) {
    env.recommendedFlags.push('--compatible-ui');
    env.warnings.push('Terminal does not support raw mode - using compatible UI');
  }

  // Sandbox not available
  if (!env.sandbox.available) {
    env.warnings.push('No OS sandbox detected - SafeBash will run without OS-level isolation');
  }
}

/**
 * Shows environment warnings to the user
 */
/**
 * Detects OS sandbox capabilities (bubblewrap on Linux, sandbox-exec on macOS)
 */
function detectSandboxCapabilities(): SandboxCapabilities {
  const platform = process.platform;

  if (platform === 'linux') {
    const bwrapPath = findBinaryOnPath('bwrap');
    if (bwrapPath) {
      return { available: true, type: 'bubblewrap', bwrapPath, sandboxExecPath: null };
    }
  }

  if (platform === 'darwin') {
    const sandboxExecPath = findBinaryOnPath('sandbox-exec');
    if (sandboxExecPath) {
      return { available: true, type: 'sandbox-exec', bwrapPath: null, sandboxExecPath };
    }
  }

  return { available: false, type: 'none', bwrapPath: null, sandboxExecPath: null };
}

function findBinaryOnPath(name: string): string | null {
  try {
    const { execSync } = require('child_process');
    const result = execSync(`which ${name} 2>/dev/null`, { encoding: 'utf8' }).trim();
    return result || null;
  } catch {
    return null;
  }
}

/**
 * Shows environment warnings to the user
 */
function showEnvironmentWarnings(env: ExecutionEnvironment): void {
  if (env.warnings.length === 0) return;
  
  console.log(chalk.yellow('\n⚠️  Environment Detection:'));
  env.warnings.forEach(warning => {
    console.log(chalk.gray(`   • ${warning}`));
  });
  
  if (env.recommendedFlags.length > 0) {
    console.log(chalk.cyan('\n💡 Recommended flags for your environment:'));
    console.log(chalk.gray(`   ${env.recommendedFlags.join(' ')}`));
  }
  
  console.log(); // Empty line for spacing
}

/**
 * Applies smart defaults based on environment
 */
export function applySmartDefaults<T extends Record<string, any>>(
  options: T,
  env?: ExecutionEnvironment
): T & { appliedDefaults: string[] } {
  const environment = env || detectExecutionEnvironment({ skipWarnings: true });
  const appliedDefaults: string[] = [];
  const enhanced = { ...options, appliedDefaults };
  
  // Apply defaults based on environment - use --non-interactive for non-interactive contexts
  if (environment.isVSCode || environment.isCI || !environment.supportsRawMode) {
    enhanced.nonInteractive = true;
    appliedDefaults.push('--non-interactive');
  }
  
  if ((environment.isCI || !environment.isInteractive) && 
      !options.hasOwnProperty('nonInteractive')) {
    enhanced.nonInteractive = true;
    appliedDefaults.push('--non-interactive');
  }
  
  if (environment.isCI && !options.hasOwnProperty('json')) {
    enhanced.json = true;
    appliedDefaults.push('--json');
  }
  
  if (!environment.supportsColor && !options.hasOwnProperty('noColor')) {
    enhanced.noColor = true;
    appliedDefaults.push('--no-color');
  }
  
  // Log applied defaults if verbose
  if (options.verbose && appliedDefaults.length > 0) {
    console.log(chalk.gray(`ℹ️  Auto-applied flags: ${appliedDefaults.join(' ')}`));
  }
  
  return enhanced;
}

/**
 * Gets a human-readable environment description
 */
export function getEnvironmentDescription(env?: ExecutionEnvironment): string {
  const environment = env || detectExecutionEnvironment({ skipWarnings: true });
  const parts: string[] = [];
  
  if (environment.isVSCode) parts.push('VS Code');
  if (environment.isCI) parts.push('CI');
  if (environment.isDocker) parts.push('Docker');
  if (environment.isSSH) parts.push('SSH');
  if (environment.isGitBash) parts.push('Git Bash');
  if (environment.isWindowsTerminal) parts.push('Windows Terminal');
  
  if (parts.length === 0) {
    parts.push(environment.terminalType);
  }
  
  const features: string[] = [];
  if (environment.isInteractive) features.push('interactive');
  if (environment.supportsRawMode) features.push('raw mode');
  if (environment.supportsColor) features.push('color');
  
  return `${parts.join('/')} (${features.join(', ')})`;
}

/**
 * Checks if we should use non-interactive mode
 */
export function shouldUseNonInteractiveMode(options?: { force?: boolean }): boolean {
  if (options?.force) return true;
  
  const env = detectExecutionEnvironment({ skipWarnings: true });
  return !env.isInteractive || 
         env.isCI || 
         env.isVSCode || 
         !env.supportsRawMode;
}

// Helper functions (these would normally be imported)
function existsSync(path: string): boolean {
  try {
    require('fs').accessSync(path);
    return true;
  } catch {
    return false;
  }
}

function readFileSync(path: string, encoding: string): string {
  try {
    return require('fs').readFileSync(path, encoding);
  } catch {
    return '';
  }
}

export default {
  detectExecutionEnvironment,
  applySmartDefaults,
  getEnvironmentDescription,
  shouldUseNonInteractiveMode
};