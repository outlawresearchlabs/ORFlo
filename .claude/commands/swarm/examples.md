# Outlaw-Flow Swarm Examples

## Quick Start Commands

### Research Tasks
```bash
outlaw-flow swarm "Research modern web frameworks" --strategy research --mode distributed
outlaw-flow swarm "Analyze market trends in AI" --strategy research --parallel --max-agents 6
```

### Development Tasks
```bash
outlaw-flow swarm "Build a microservice API" --strategy development --mode hierarchical
outlaw-flow swarm "Create React dashboard" --strategy development --parallel --max-agents 8
```

### Analysis Tasks
```bash
outlaw-flow swarm "Analyze user behavior data" --strategy analysis --mode mesh
outlaw-flow swarm "Performance analysis of application" --strategy analysis --monitor
```

### Testing Tasks
```bash
outlaw-flow swarm "Comprehensive testing suite" --strategy testing --parallel
outlaw-flow swarm "Security testing analysis" --strategy testing --mode distributed
```

### Optimization Tasks
```bash
outlaw-flow swarm "Optimize database queries" --strategy optimization --mode hybrid
outlaw-flow swarm "Frontend performance optimization" --strategy optimization --monitor
```

### Maintenance Tasks
```bash
outlaw-flow swarm "Update dependencies safely" --strategy maintenance --mode centralized
outlaw-flow swarm "System health check" --strategy maintenance --monitor
```

## Advanced Usage

### Custom Output and Monitoring
```bash
# Save results in different formats
outlaw-flow swarm "Research task" --output sqlite --output-dir ./results

# Enable real-time monitoring
outlaw-flow swarm "Long task" --monitor --timeout 120

# Dry run to see configuration
outlaw-flow swarm "Any task" --dry-run
```

### Coordination Modes

- **centralized**: Single coordinator (best for simple tasks)
- **distributed**: Multiple coordinators (best for complex, parallelizable tasks)
- **hierarchical**: Tree structure (best for organized, structured work)
- **mesh**: Peer-to-peer (best for dynamic, adaptive tasks)
- **hybrid**: Mixed patterns (best for complex workflows)

See .claude/commands/swarm/ for detailed documentation on each strategy.
