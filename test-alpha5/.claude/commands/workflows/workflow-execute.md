# workflow-execute

Execute saved workflows.

## Usage
```bash
npx outlaw-flow workflow execute [options]
```

## Options
- `--name <name>` - Workflow name
- `--params <json>` - Workflow parameters
- `--dry-run` - Preview execution

## Examples
```bash
# Execute workflow
npx outlaw-flow workflow execute --name "deploy-api"

# With parameters
npx outlaw-flow workflow execute --name "test-suite" --params '{"env": "staging"}'

# Dry run
npx outlaw-flow workflow execute --name "deploy-api" --dry-run
```
