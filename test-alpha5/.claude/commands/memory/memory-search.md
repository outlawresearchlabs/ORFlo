# memory-search

Search through stored memory.

## Usage
```bash
npx outlaw-flow memory search [options]
```

## Options
- `--query <text>` - Search query
- `--pattern <regex>` - Pattern matching
- `--limit <n>` - Result limit

## Examples
```bash
# Search memory
npx outlaw-flow memory search --query "authentication"

# Pattern search
npx outlaw-flow memory search --pattern "api-.*"

# Limited results
npx outlaw-flow memory search --query "config" --limit 10
```
