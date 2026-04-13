# Agent Swarm Benchmarking Tool

A comprehensive Python-based benchmarking tool for agent swarms that interfaces with the Outlaw Flow Advanced Swarm System. This tool measures performance, efficiency, and effectiveness of different swarm strategies and coordination modes.

## 🚀 Features

- **Complete Strategy Coverage**: Supports all outlaw-flow swarm strategies (auto, research, development, analysis, testing, optimization, maintenance)
- **Multiple Coordination Modes**: Tests centralized, distributed, hierarchical, mesh, and hybrid coordination patterns
- **Comprehensive Metrics**: Tracks performance, resource usage, quality metrics, and coordination efficiency
- **Multiple Output Formats**: Exports results to JSON, SQLite, CSV, and HTML formats
- **CLI Interface**: Command-line interface matching outlaw-flow swarm command structure
- **Test-Driven Development**: Built using TDD methodology with comprehensive test coverage
- **Modular Architecture**: Clean, extensible design with pluggable components

## 📦 Installation

### Prerequisites
- Python 3.8 or higher
- pip package manager

### Install from Source
```bash
# Clone and install
cd benchmark
pip install -r requirements.txt
pip install -e .
```

## 🎯 Quick Start

### Basic Usage
```bash
# Run a simple research benchmark
swarm-benchmark run "Research cloud architecture patterns" --strategy research

# Run a development benchmark with distributed coordination
swarm-benchmark run "Build a REST API" --strategy development --mode distributed

# Run an analysis task with monitoring
swarm-benchmark run "Analyze user behavior data" --strategy analysis --monitor

# Test different strategies automatically
swarm-benchmark run "Optimize database performance" --strategy auto
```

### Example Output
```bash
$ swarm-benchmark run "Test research task" --strategy research --verbose

Running benchmark: benchmark-research-centralized
Objective: Test research task
Strategy: research
Mode: centralized
✅ Benchmark completed successfully!
📊 Results saved to: ./reports
📋 Summary: Completed 1 tasks
```

## 📊 Available Strategies

| Strategy | Description | Best For |
|----------|-------------|----------|
| `auto` | Automatically determines best approach | General-purpose tasks |
| `research` | Information gathering and analysis | Research, documentation |
| `development` | Software development and coding | Building applications |
| `analysis` | Data analysis and insights | Data processing, metrics |
| `testing` | Quality assurance workflows | Testing, validation |
| `optimization` | Performance improvements | Speed, efficiency gains |
| `maintenance` | System maintenance tasks | Updates, documentation |

## 🔗 Coordination Modes

| Mode | Description | Coordination Pattern |
|------|-------------|---------------------|
| `centralized` | Single coordinator (default) | Simple, reliable |
| `distributed` | Multiple coordinators | Scalable, fault-tolerant |
| `hierarchical` | Tree structure | Organized, clear authority |
| `mesh` | Peer-to-peer | Flexible, dynamic |
| `hybrid` | Mixed patterns | Adaptive, optimized |

## Development

This project follows the SPARC (Specification, Pseudocode, Architecture, Refinement, Completion) methodology for systematic Test-Driven Development.

### Running Tests

```bash
pytest tests/
```

### Project Structure

```
benchmark/
├── src/swarm_benchmark/    # Source code
│   ├── cli/               # Command-line interface
│   ├── core/             # Core benchmarking framework
│   ├── strategies/       # Swarm strategy implementations
│   ├── modes/           # Coordination mode implementations
│   ├── metrics/         # Performance metrics collection
│   ├── output/          # JSON/SQLite output modules
│   └── utils/           # Utility functions
├── tests/               # Test suite
│   ├── unit/           # Unit tests
│   ├── integration/    # Integration tests
│   └── performance/    # Performance benchmarks
└── config/             # Configuration files
```

## License

MIT License