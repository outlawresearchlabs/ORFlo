# post-task

Hook executed after task completion.

## Usage
```bash
npx outlaw-flow hook post-task [options]
```

## Options
- `--task-id <id>` - Task identifier
- `--analyze-performance` - Analyze task performance
- `--update-memory` - Update swarm memory

## Examples
```bash
# Basic post-task
npx outlaw-flow hook post-task --task-id task-123

# With performance analysis
npx outlaw-flow hook post-task --task-id task-123 --analyze-performance

# Update memory
npx outlaw-flow hook post-task --task-id task-123 --update-memory
```
