# agent-metrics

View agent performance metrics.

## Usage
```bash
npx outlaw-flow agent metrics [options]
```

## Options
- `--agent-id <id>` - Specific agent
- `--period <time>` - Time period
- `--format <type>` - Output format

## Examples
```bash
# All agents metrics
npx outlaw-flow agent metrics

# Specific agent
npx outlaw-flow agent metrics --agent-id agent-001

# Last hour
npx outlaw-flow agent metrics --period 1h
```
