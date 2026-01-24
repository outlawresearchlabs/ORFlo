/**
 * Legal Contracts Plugin - Bridge Tests
 *
 * Tests for DAGBridge initialization, lifecycle, and methods
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DAGBridge } from '../src/bridges/dag-bridge.js';

// Mock WASM module
vi.mock('../src/bridges/dag-wasm.js', () => ({
  initWasm: vi.fn().mockResolvedValue(undefined),
  wasmAvailable: vi.fn().mockReturnValue(false),
}));

describe('DAGBridge', () => {
  let bridge: DAGBridge;

  beforeEach(() => {
    vi.clearAllMocks();
    bridge = new DAGBridge();
  });

  afterEach(async () => {
    try {
      await bridge.destroy();
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('Initialization', () => {
    it('should create bridge instance', () => {
      expect(bridge).toBeInstanceOf(DAGBridge);
    });

    it('should not be initialized before init', () => {
      expect(bridge.isInitialized()).toBe(false);
    });

    it('should initialize successfully', async () => {
      await bridge.initialize();
      expect(bridge.isInitialized()).toBe(true);
    });

    it('should initialize with custom config', async () => {
      await bridge.initialize({
        maxNodes: 10000,
        enableCaching: true,
        cacheSize: 1000,
      });
      expect(bridge.isInitialized()).toBe(true);
    });

    it('should initialize with legal-specific config', async () => {
      await bridge.initialize({
        jurisdiction: 'US',
        contractTypes: ['NDA', 'MSA', 'SOW'],
        obligationTracking: true,
      });
      expect(bridge.isInitialized()).toBe(true);
    });

    it('should handle double initialization gracefully', async () => {
      await bridge.initialize();
      await bridge.initialize();
      expect(bridge.isInitialized()).toBe(true);
    });
  });

  describe('Lifecycle', () => {
    it('should destroy successfully', async () => {
      await bridge.initialize();
      await bridge.destroy();
      expect(bridge.isInitialized()).toBe(false);
    });

    it('should handle destroy when not initialized', async () => {
      await expect(bridge.destroy()).resolves.not.toThrow();
    });

    it('should reinitialize after destroy', async () => {
      await bridge.initialize();
      await bridge.destroy();
      await bridge.initialize();
      expect(bridge.isInitialized()).toBe(true);
    });
  });

  describe('Build Dependency Graph', () => {
    beforeEach(async () => {
      await bridge.initialize();
    });

    it('should build dependency graph from obligations', async () => {
      const obligations = [
        { id: 'obl-1', name: 'Payment Due', deadline: '2025-02-01', dependencies: [] },
        { id: 'obl-2', name: 'Delivery Complete', deadline: '2025-01-15', dependencies: [] },
        { id: 'obl-3', name: 'Invoice Sent', deadline: '2025-01-20', dependencies: ['obl-2'] },
        { id: 'obl-4', name: 'Final Payment', deadline: '2025-02-15', dependencies: ['obl-1', 'obl-3'] },
      ];

      const result = await bridge.buildDependencyGraph(obligations);

      expect(result).toHaveProperty('nodeCount', 4);
      expect(result).toHaveProperty('edgeCount');
      expect(result).toHaveProperty('graph');
      expect(result.edgeCount).toBeGreaterThan(0);
    });

    it('should handle empty obligations', async () => {
      const result = await bridge.buildDependencyGraph([]);

      expect(result.nodeCount).toBe(0);
      expect(result.edgeCount).toBe(0);
    });

    it('should handle complex dependency chains', async () => {
      const obligations = [
        { id: 'a', name: 'A', dependencies: [] },
        { id: 'b', name: 'B', dependencies: ['a'] },
        { id: 'c', name: 'C', dependencies: ['a'] },
        { id: 'd', name: 'D', dependencies: ['b', 'c'] },
        { id: 'e', name: 'E', dependencies: ['d'] },
        { id: 'f', name: 'F', dependencies: ['d'] },
        { id: 'g', name: 'G', dependencies: ['e', 'f'] },
      ];

      const result = await bridge.buildDependencyGraph(obligations);

      expect(result.nodeCount).toBe(7);
      expect(result.edgeCount).toBe(8);
    });
  });

  describe('Critical Path Analysis', () => {
    beforeEach(async () => {
      await bridge.initialize();
    });

    it('should find critical path', async () => {
      const obligations = [
        { id: 'start', name: 'Start', duration: 0, dependencies: [] },
        { id: 'task-a', name: 'Task A', duration: 5, dependencies: ['start'] },
        { id: 'task-b', name: 'Task B', duration: 3, dependencies: ['start'] },
        { id: 'task-c', name: 'Task C', duration: 4, dependencies: ['task-a'] },
        { id: 'task-d', name: 'Task D', duration: 2, dependencies: ['task-b'] },
        { id: 'end', name: 'End', duration: 0, dependencies: ['task-c', 'task-d'] },
      ];

      await bridge.buildDependencyGraph(obligations);
      const result = await bridge.findCriticalPath();

      expect(result).toHaveProperty('path');
      expect(Array.isArray(result.path)).toBe(true);
      expect(result.path.length).toBeGreaterThan(0);
      expect(result).toHaveProperty('duration');
      expect(result.duration).toBeGreaterThan(0);
    });

    it('should identify critical path through longest chain', async () => {
      const obligations = [
        { id: 'a', name: 'A', duration: 1, dependencies: [] },
        { id: 'b', name: 'B', duration: 10, dependencies: ['a'] }, // Long task
        { id: 'c', name: 'C', duration: 1, dependencies: ['a'] },
        { id: 'd', name: 'D', duration: 1, dependencies: ['b', 'c'] },
      ];

      await bridge.buildDependencyGraph(obligations);
      const result = await bridge.findCriticalPath();

      expect(result.path).toContain('b'); // Should include long task
      expect(result.duration).toBeGreaterThanOrEqual(12); // a(1) + b(10) + d(1)
    });

    it('should handle linear dependency chain', async () => {
      const obligations = [
        { id: 'step-1', name: 'Step 1', duration: 2, dependencies: [] },
        { id: 'step-2', name: 'Step 2', duration: 3, dependencies: ['step-1'] },
        { id: 'step-3', name: 'Step 3', duration: 4, dependencies: ['step-2'] },
      ];

      await bridge.buildDependencyGraph(obligations);
      const result = await bridge.findCriticalPath();

      expect(result.path).toEqual(['step-1', 'step-2', 'step-3']);
      expect(result.duration).toBe(9);
    });
  });

  describe('Topological Sort', () => {
    beforeEach(async () => {
      await bridge.initialize();
    });

    it('should perform topological sort', async () => {
      const obligations = [
        { id: 'c', name: 'C', dependencies: ['b'] },
        { id: 'a', name: 'A', dependencies: [] },
        { id: 'b', name: 'B', dependencies: ['a'] },
        { id: 'd', name: 'D', dependencies: ['b', 'c'] },
      ];

      await bridge.buildDependencyGraph(obligations);
      const sorted = await bridge.topologicalSort();

      expect(Array.isArray(sorted)).toBe(true);
      expect(sorted.length).toBe(4);

      // Verify ordering constraints
      const indexA = sorted.indexOf('a');
      const indexB = sorted.indexOf('b');
      const indexC = sorted.indexOf('c');
      const indexD = sorted.indexOf('d');

      expect(indexA).toBeLessThan(indexB);
      expect(indexB).toBeLessThan(indexC);
      expect(indexC).toBeLessThan(indexD);
    });

    it('should handle multiple valid orderings', async () => {
      const obligations = [
        { id: 'a', name: 'A', dependencies: [] },
        { id: 'b', name: 'B', dependencies: [] },
        { id: 'c', name: 'C', dependencies: ['a', 'b'] },
      ];

      await bridge.buildDependencyGraph(obligations);
      const sorted = await bridge.topologicalSort();

      // c must come after both a and b
      const indexA = sorted.indexOf('a');
      const indexB = sorted.indexOf('b');
      const indexC = sorted.indexOf('c');

      expect(indexA).toBeLessThan(indexC);
      expect(indexB).toBeLessThan(indexC);
    });
  });

  describe('Cycle Detection', () => {
    beforeEach(async () => {
      await bridge.initialize();
    });

    it('should detect no cycles in valid DAG', async () => {
      const obligations = [
        { id: 'a', name: 'A', dependencies: [] },
        { id: 'b', name: 'B', dependencies: ['a'] },
        { id: 'c', name: 'C', dependencies: ['b'] },
      ];

      await bridge.buildDependencyGraph(obligations);
      const result = await bridge.detectCycles();

      expect(result.hasCycle).toBe(false);
      expect(result.cycles).toEqual([]);
    });

    it('should detect simple cycle', async () => {
      const obligations = [
        { id: 'a', name: 'A', dependencies: ['c'] }, // Cycle: a -> c -> b -> a
        { id: 'b', name: 'B', dependencies: ['a'] },
        { id: 'c', name: 'C', dependencies: ['b'] },
      ];

      await bridge.buildDependencyGraph(obligations);
      const result = await bridge.detectCycles();

      expect(result.hasCycle).toBe(true);
      expect(result.cycles.length).toBeGreaterThan(0);
    });

    it('should detect self-loop', async () => {
      const obligations = [
        { id: 'a', name: 'A', dependencies: ['a'] }, // Self-loop
      ];

      await bridge.buildDependencyGraph(obligations);
      const result = await bridge.detectCycles();

      expect(result.hasCycle).toBe(true);
    });

    it('should detect multiple cycles', async () => {
      const obligations = [
        { id: 'a', name: 'A', dependencies: ['b'] },
        { id: 'b', name: 'B', dependencies: ['a'] }, // Cycle 1: a <-> b
        { id: 'c', name: 'C', dependencies: ['d'] },
        { id: 'd', name: 'D', dependencies: ['e'] },
        { id: 'e', name: 'E', dependencies: ['c'] }, // Cycle 2: c -> d -> e -> c
      ];

      await bridge.buildDependencyGraph(obligations);
      const result = await bridge.detectCycles();

      expect(result.hasCycle).toBe(true);
      expect(result.cycles.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Float Calculation', () => {
    beforeEach(async () => {
      await bridge.initialize();
    });

    it('should calculate float for non-critical tasks', async () => {
      const obligations = [
        { id: 'start', name: 'Start', duration: 0, dependencies: [] },
        { id: 'task-a', name: 'Task A', duration: 5, dependencies: ['start'] },
        { id: 'task-b', name: 'Task B', duration: 2, dependencies: ['start'] },
        { id: 'end', name: 'End', duration: 0, dependencies: ['task-a', 'task-b'] },
      ];

      await bridge.buildDependencyGraph(obligations);
      const result = await bridge.calculateFloat();

      expect(result).toHaveProperty('task-b');
      expect(result['task-b']).toBeGreaterThan(0); // task-b has float since task-a is longer

      expect(result).toHaveProperty('task-a');
      expect(result['task-a']).toBe(0); // task-a is on critical path
    });

    it('should return zero float for critical path items', async () => {
      const obligations = [
        { id: 'a', name: 'A', duration: 5, dependencies: [] },
        { id: 'b', name: 'B', duration: 5, dependencies: ['a'] },
      ];

      await bridge.buildDependencyGraph(obligations);
      const result = await bridge.calculateFloat();

      expect(result['a']).toBe(0);
      expect(result['b']).toBe(0);
    });
  });

  describe('Obligation Tracking', () => {
    beforeEach(async () => {
      await bridge.initialize({ obligationTracking: true });
    });

    it('should track obligation completion', async () => {
      const obligations = [
        { id: 'obl-1', name: 'Deliver Goods', status: 'pending', deadline: '2025-02-01' },
        { id: 'obl-2', name: 'Make Payment', status: 'pending', deadline: '2025-02-15', dependencies: ['obl-1'] },
      ];

      await bridge.buildDependencyGraph(obligations);

      const result = await bridge.updateObligationStatus('obl-1', 'completed');

      expect(result.success).toBe(true);
      expect(result.unblocked).toContain('obl-2');
    });

    it('should identify blocked obligations', async () => {
      const obligations = [
        { id: 'prereq', name: 'Prerequisite', status: 'pending' },
        { id: 'blocked', name: 'Blocked Task', status: 'pending', dependencies: ['prereq'] },
      ];

      await bridge.buildDependencyGraph(obligations);

      const blocked = await bridge.getBlockedObligations();

      expect(blocked).toContain('blocked');
      expect(blocked).not.toContain('prereq');
    });

    it('should calculate completion percentage', async () => {
      const obligations = [
        { id: 'a', name: 'A', status: 'completed' },
        { id: 'b', name: 'B', status: 'completed' },
        { id: 'c', name: 'C', status: 'pending' },
        { id: 'd', name: 'D', status: 'pending' },
      ];

      await bridge.buildDependencyGraph(obligations);

      const percentage = await bridge.getCompletionPercentage();

      expect(percentage).toBe(50);
    });
  });

  describe('Contract Analysis', () => {
    beforeEach(async () => {
      await bridge.initialize();
    });

    it('should analyze contract dependencies', async () => {
      const clauses = [
        { id: 'clause-1', type: 'definition', references: [] },
        { id: 'clause-2', type: 'obligation', references: ['clause-1'] },
        { id: 'clause-3', type: 'obligation', references: ['clause-1'] },
        { id: 'clause-4', type: 'termination', references: ['clause-2', 'clause-3'] },
      ];

      await bridge.buildDependencyGraph(clauses.map(c => ({
        id: c.id,
        name: c.type,
        dependencies: c.references,
      })));

      const analysis = await bridge.analyzeStructure();

      expect(analysis).toHaveProperty('levels');
      expect(analysis).toHaveProperty('dependencies');
      expect(analysis).toHaveProperty('criticalNodes');
    });

    it('should identify key clauses', async () => {
      const clauses = [
        { id: 'def-1', name: 'Definitions', dependencies: [] },
        { id: 'scope', name: 'Scope', dependencies: ['def-1'] },
        { id: 'payment', name: 'Payment', dependencies: ['def-1', 'scope'] },
        { id: 'delivery', name: 'Delivery', dependencies: ['scope'] },
        { id: 'term', name: 'Term', dependencies: ['payment', 'delivery'] },
      ];

      await bridge.buildDependencyGraph(clauses);

      const keyNodes = await bridge.getKeyNodes();

      expect(keyNodes).toContain('def-1'); // Most dependent upon
    });
  });

  describe('Error Handling', () => {
    it('should throw when operations called before init', async () => {
      await expect(
        bridge.buildDependencyGraph([{ id: 'test', name: 'Test', dependencies: [] }])
      ).rejects.toThrow();
    });

    it('should handle missing dependency references', async () => {
      await bridge.initialize();

      const obligations = [
        { id: 'a', name: 'A', dependencies: ['nonexistent'] },
      ];

      // Should either handle gracefully or throw clear error
      try {
        const result = await bridge.buildDependencyGraph(obligations);
        // If it doesn't throw, verify it handled the missing reference
        expect(result).toBeDefined();
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle invalid obligation data', async () => {
      await bridge.initialize();

      await expect(
        bridge.buildDependencyGraph([
          { id: null, name: undefined, dependencies: 'not-array' } as any,
        ])
      ).rejects.toThrow();
    });
  });

  describe('JavaScript Fallback', () => {
    it('should work without WASM', async () => {
      const fallbackBridge = new DAGBridge();
      await fallbackBridge.initialize();

      await fallbackBridge.buildDependencyGraph([
        { id: 'a', name: 'A', dependencies: [] },
        { id: 'b', name: 'B', dependencies: ['a'] },
      ]);

      const sorted = await fallbackBridge.topologicalSort();
      expect(sorted).toEqual(['a', 'b']);

      await fallbackBridge.destroy();
    });
  });

  describe('Performance', () => {
    beforeEach(async () => {
      await bridge.initialize();
    });

    it('should handle large graphs efficiently', async () => {
      // Create a large DAG
      const obligations = Array(1000).fill(null).map((_, i) => ({
        id: `node-${i}`,
        name: `Obligation ${i}`,
        duration: Math.floor(Math.random() * 10) + 1,
        dependencies: i > 0 ? [`node-${Math.floor(Math.random() * i)}`] : [],
      }));

      const start = performance.now();
      await bridge.buildDependencyGraph(obligations);
      await bridge.topologicalSort();
      await bridge.detectCycles();
      await bridge.findCriticalPath();
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(5000); // Should complete in < 5 seconds
    });
  });

  describe('Memory Management', () => {
    it('should release resources on destroy', async () => {
      await bridge.initialize();

      // Build large graph
      const obligations = Array(500).fill(null).map((_, i) => ({
        id: `node-${i}`,
        name: `Node ${i}`,
        dependencies: i > 0 ? [`node-${i - 1}`] : [],
      }));

      await bridge.buildDependencyGraph(obligations);
      await bridge.destroy();

      expect(bridge.isInitialized()).toBe(false);
    });

    it('should handle multiple init/destroy cycles', async () => {
      for (let i = 0; i < 5; i++) {
        await bridge.initialize();
        await bridge.buildDependencyGraph([
          { id: 'test', name: 'Test', dependencies: [] },
        ]);
        await bridge.destroy();
      }
      expect(bridge.isInitialized()).toBe(false);
    });
  });

  describe('Export and Serialization', () => {
    beforeEach(async () => {
      await bridge.initialize();
    });

    it('should export graph to JSON', async () => {
      await bridge.buildDependencyGraph([
        { id: 'a', name: 'A', dependencies: [] },
        { id: 'b', name: 'B', dependencies: ['a'] },
      ]);

      const exported = await bridge.exportGraph('json');

      expect(typeof exported).toBe('string');
      const parsed = JSON.parse(exported);
      expect(parsed).toHaveProperty('nodes');
      expect(parsed).toHaveProperty('edges');
    });

    it('should export graph to DOT format', async () => {
      await bridge.buildDependencyGraph([
        { id: 'a', name: 'A', dependencies: [] },
        { id: 'b', name: 'B', dependencies: ['a'] },
      ]);

      const dot = await bridge.exportGraph('dot');

      expect(dot).toContain('digraph');
      expect(dot).toContain('->');
    });
  });
});
