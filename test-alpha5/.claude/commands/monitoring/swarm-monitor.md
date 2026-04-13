# swarm-monitor

Real-time swarm monitoring.

## Usage
```bash
npx outlaw-flow swarm monitor [options]
```

## Options
- `--interval <ms>` - Update interval
- `--metrics` - Show detailed metrics
- `--export` - Export monitoring data

## Examples
```bash
# Start monitoring
npx outlaw-flow swarm monitor

# Custom interval
npx outlaw-flow swarm monitor --interval 5000

# With metrics
npx outlaw-flow swarm monitor --metrics
```
