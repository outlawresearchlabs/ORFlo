# model-update

Update neural models with new data.

## Usage
```bash
npx outlaw-flow training model-update [options]
```

## Options
- `--model <name>` - Model to update
- `--incremental` - Incremental update
- `--validate` - Validate after update

## Examples
```bash
# Update all models
npx outlaw-flow training model-update

# Specific model
npx outlaw-flow training model-update --model agent-selector

# Incremental with validation
npx outlaw-flow training model-update --incremental --validate
```
