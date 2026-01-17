/**
 * Attention MCP Tools for CLI
 *
 * Tool definitions for 39 WASM-accelerated attention mechanisms.
 * Implements ADR-029: @claude-flow/attention Library
 */

import type { MCPTool } from './types.js';

// Dynamic import for attention package
let attentionService: any = null;
let attentionRegistry: any = null;

async function getAttention() {
  if (!attentionService) {
    try {
      const attention = await import('@claude-flow/attention');
      attentionService = await attention.createAttentionService();
      attentionRegistry = attention.registry;
    } catch (e) {
      console.warn('[Attention MCP] @claude-flow/attention not available:', e);
      return null;
    }
  }
  return { service: attentionService, registry: attentionRegistry };
}

// List mechanisms tool
const attentionList: MCPTool = {
  name: 'attention_list',
  description: 'List all 39 attention mechanisms with optional filtering',
  inputSchema: {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        description: 'Filter by category (multi-head, sparse, linear, flash, moe)',
        enum: ['multi-head', 'self-attention', 'cross-attention', 'sparse', 'linear', 'flash', 'moe'],
      },
      wasmOnly: {
        type: 'boolean',
        description: 'Show only WASM-accelerated mechanisms',
        default: false,
      },
      longSequence: {
        type: 'boolean',
        description: 'Show only mechanisms that support long sequences',
        default: false,
      },
    },
  },
  handler: async (params: { category?: string; wasmOnly?: boolean; longSequence?: boolean }) => {
    const attention = await getAttention();
    if (!attention) {
      return {
        success: false,
        error: '@claude-flow/attention package not available',
      };
    }

    let mechanisms = attention.registry.list();

    if (params.category) {
      mechanisms = mechanisms.filter((m: any) => m.category === params.category);
    }
    if (params.wasmOnly) {
      mechanisms = attention.registry.wasmEnabled();
    }
    if (params.longSequence) {
      mechanisms = attention.registry.longSequence();
    }

    return {
      success: true,
      mechanisms: mechanisms.map((m: any) => ({
        type: m.type,
        name: m.name,
        category: m.category,
        complexity: m.complexity,
        wasmAvailable: m.wasmAvailable,
        memoryEfficient: m.memoryEfficient,
        longSequenceSupport: m.longSequenceSupport,
      })),
      total: mechanisms.length,
    };
  },
};

// Get mechanism info
const attentionInfo: MCPTool = {
  name: 'attention_info',
  description: 'Get detailed information about a specific attention mechanism',
  inputSchema: {
    type: 'object',
    properties: {
      mechanism: {
        type: 'string',
        description: 'Mechanism type (e.g., flash-attention-v2, linear-attention)',
      },
    },
    required: ['mechanism'],
  },
  handler: async (params: { mechanism: string }) => {
    const attention = await getAttention();
    if (!attention) {
      return { success: false, error: '@claude-flow/attention not available' };
    }

    const info = attention.registry.get(params.mechanism);
    if (!info) {
      return { success: false, error: `Unknown mechanism: ${params.mechanism}` };
    }

    return {
      success: true,
      mechanism: info,
    };
  },
};

// Recommend mechanism for sequence length
const attentionRecommend: MCPTool = {
  name: 'attention_recommend',
  description: 'Get recommended attention mechanism for a given sequence length',
  inputSchema: {
    type: 'object',
    properties: {
      sequenceLength: {
        type: 'number',
        description: 'The sequence length to optimize for',
      },
      batchSize: {
        type: 'number',
        description: 'Batch size (default: 1)',
        default: 1,
      },
      preferMemory: {
        type: 'boolean',
        description: 'Prefer memory-efficient mechanisms',
        default: false,
      },
    },
    required: ['sequenceLength'],
  },
  handler: async (params: { sequenceLength: number; batchSize?: number; preferMemory?: boolean }) => {
    const attention = await getAttention();
    if (!attention) {
      return { success: false, error: '@claude-flow/attention not available' };
    }

    const recommended = attention.registry.select(
      params.sequenceLength,
      params.batchSize ?? 1
    );

    // Get alternatives
    let alternatives: string[] = [];
    if (params.sequenceLength > 8192) {
      alternatives = ['performer-attention', 'linformer-attention', 'nystrom-attention'];
    } else if (params.sequenceLength > 2048) {
      alternatives = params.preferMemory
        ? ['linear-attention', 'longformer-attention']
        : ['flash-attention-v3', 'linear-attention'];
    } else {
      alternatives = ['standard-mha', 'causal-self-attention'];
    }

    return {
      success: true,
      sequenceLength: params.sequenceLength,
      recommended,
      reason: getRecommendationReason(params.sequenceLength),
      alternatives,
      info: attention.registry.get(recommended),
    };
  },
};

function getRecommendationReason(seqLen: number): string {
  if (seqLen > 8192) return 'Very long sequence - linear complexity required';
  if (seqLen > 2048) return 'Long sequence - memory-efficient tiling beneficial';
  if (seqLen > 512) return 'Medium sequence - Flash Attention optimal';
  return 'Short sequence - standard attention works well';
}

// Compute attention
const attentionCompute: MCPTool = {
  name: 'attention_compute',
  description: 'Compute attention on input vectors',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'array',
        description: 'Query vector (array of numbers)',
        items: { type: 'number' },
      },
      keys: {
        type: 'array',
        description: 'Key vectors (array of arrays)',
        items: { type: 'array', items: { type: 'number' } },
      },
      values: {
        type: 'array',
        description: 'Value vectors (array of arrays)',
        items: { type: 'array', items: { type: 'number' } },
      },
      mechanism: {
        type: 'string',
        description: 'Mechanism to use (default: auto-select)',
      },
    },
    required: ['query', 'keys', 'values'],
  },
  handler: async (params: {
    query: number[];
    keys: number[][];
    values: number[][];
    mechanism?: string;
  }) => {
    const attention = await getAttention();
    if (!attention) {
      return { success: false, error: '@claude-flow/attention not available' };
    }

    try {
      const input = {
        query: params.query,
        key: params.keys,
        value: params.values,
      };

      const result = params.mechanism
        ? await attention.service.compute(input, params.mechanism)
        : await attention.service.forward(input);

      return {
        success: true,
        output: Array.from(result.output),
        metadata: result.metadata,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
};

// Benchmark mechanism
const attentionBenchmark: MCPTool = {
  name: 'attention_benchmark',
  description: 'Benchmark an attention mechanism',
  inputSchema: {
    type: 'object',
    properties: {
      mechanism: {
        type: 'string',
        description: 'Mechanism to benchmark',
      },
      sequenceLength: {
        type: 'number',
        description: 'Sequence length for benchmark',
        default: 512,
      },
      dim: {
        type: 'number',
        description: 'Embedding dimension',
        default: 384,
      },
      iterations: {
        type: 'number',
        description: 'Number of iterations',
        default: 100,
      },
    },
    required: ['mechanism'],
  },
  handler: async (params: {
    mechanism: string;
    sequenceLength?: number;
    dim?: number;
    iterations?: number;
  }) => {
    const attention = await getAttention();
    if (!attention) {
      return { success: false, error: '@claude-flow/attention not available' };
    }

    try {
      const result = await attention.service.benchmark(params.mechanism, {
        sequenceLength: params.sequenceLength ?? 512,
        dim: params.dim ?? 384,
        iterations: params.iterations ?? 100,
      });

      return {
        success: true,
        benchmark: {
          mechanism: result.mechanism,
          backend: result.backend,
          sequenceLength: result.sequenceLength,
          latencyMs: result.latencyMs,
          latencyP50Ms: result.latencyP50Ms,
          latencyP95Ms: result.latencyP95Ms,
          latencyP99Ms: result.latencyP99Ms,
          throughputOpsPerSec: result.throughputOpsPerSec,
          memoryBytes: result.memoryBytes,
          iterations: result.iterations,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
};

// Compare mechanisms
const attentionCompare: MCPTool = {
  name: 'attention_compare',
  description: 'Compare multiple attention mechanisms',
  inputSchema: {
    type: 'object',
    properties: {
      mechanisms: {
        type: 'array',
        description: 'List of mechanisms to compare',
        items: { type: 'string' },
      },
      sequenceLength: {
        type: 'number',
        description: 'Sequence length for comparison',
        default: 512,
      },
      iterations: {
        type: 'number',
        description: 'Number of iterations',
        default: 50,
      },
    },
    required: ['mechanisms'],
  },
  handler: async (params: {
    mechanisms: string[];
    sequenceLength?: number;
    iterations?: number;
  }) => {
    const attention = await getAttention();
    if (!attention) {
      return { success: false, error: '@claude-flow/attention not available' };
    }

    try {
      const comparison = await attention.service.compareMechanisms(
        params.mechanisms,
        {
          sequenceLength: params.sequenceLength ?? 512,
          iterations: params.iterations ?? 50,
        }
      );

      const speedups: Record<string, number> = {};
      for (const [mech, speedup] of comparison.speedupFactors) {
        speedups[mech] = speedup;
      }

      return {
        success: true,
        comparison: {
          baseline: comparison.baseline,
          results: comparison.results,
          speedups,
          recommendations: comparison.recommendations,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
};

// Get attention system status
const attentionStatus: MCPTool = {
  name: 'attention_status',
  description: 'Get attention system status including WASM availability',
  inputSchema: {
    type: 'object',
    properties: {},
  },
  handler: async () => {
    const attention = await getAttention();

    // Check WASM availability directly
    let wasmAvailable = false;
    let simdAvailable = false;

    try {
      const mod = await import('@claude-flow/attention');
      wasmAvailable = await mod.isWASMAvailable();
      simdAvailable = await mod.isSIMDAvailable();
    } catch {
      // Package not available
    }

    if (!attention) {
      return {
        success: true,
        status: {
          available: false,
          wasmAvailable,
          simdAvailable,
          backend: 'none',
          totalMechanisms: 0,
          wasmMechanisms: 0,
          message: '@claude-flow/attention package not installed',
        },
      };
    }

    const mechanisms = attention.registry.list();
    const wasmMechanisms = attention.registry.wasmEnabled();

    return {
      success: true,
      status: {
        available: true,
        wasmAvailable,
        simdAvailable,
        backend: attention.service.getBackend(),
        accelerated: attention.service.isAccelerated(),
        totalMechanisms: mechanisms.length,
        wasmMechanisms: wasmMechanisms.length,
        longSeqMechanisms: attention.registry.longSequence().length,
        categories: Object.fromEntries(attention.registry.categories()),
      },
    };
  },
};

// Hyperbolic distance computation
const attentionHyperbolic: MCPTool = {
  name: 'attention_hyperbolic',
  description: 'Compute hyperbolic (Poincaré ball) distance between vectors',
  inputSchema: {
    type: 'object',
    properties: {
      x: {
        type: 'array',
        description: 'First vector',
        items: { type: 'number' },
      },
      y: {
        type: 'array',
        description: 'Second vector',
        items: { type: 'number' },
      },
      curvature: {
        type: 'number',
        description: 'Poincaré ball curvature (negative)',
        default: -1.0,
      },
    },
    required: ['x', 'y'],
  },
  handler: async (params: { x: number[]; y: number[]; curvature?: number }) => {
    // Compute Poincaré distance (fallback implementation)
    const c = Math.abs(params.curvature ?? -1.0);
    const x = params.x;
    const y = params.y;

    let normX = 0;
    let normY = 0;
    let normDiff = 0;

    for (let i = 0; i < x.length; i++) {
      normX += x[i] * x[i];
      normY += y[i] * y[i];
      const diff = x[i] - y[i];
      normDiff += diff * diff;
    }

    normX = Math.sqrt(normX);
    normY = Math.sqrt(normY);
    normDiff = Math.sqrt(normDiff);

    const sqrtC = Math.sqrt(c);
    const num = 2 * normDiff * normDiff;
    const denom = (1 - normX * normX) * (1 - normY * normY);
    const distance = (1 / sqrtC) * Math.acosh(1 + num / Math.max(denom, 1e-6));

    return {
      success: true,
      distance,
      curvature: params.curvature ?? -1.0,
      dimensions: x.length,
    };
  },
};

// Export all attention tools
export const attentionTools: MCPTool[] = [
  attentionList,
  attentionInfo,
  attentionRecommend,
  attentionCompute,
  attentionBenchmark,
  attentionCompare,
  attentionStatus,
  attentionHyperbolic,
];
