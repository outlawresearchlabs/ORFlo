# outlaw-flow

Security-hardened AI agent orchestration. Based on [claude-flow](https://github.com/ruvnet/claude-code-flow) v2.0.0-alpha by [rUv](https://github.com/ruvnet), now an independent project.

## Why this exists

`claude-flow` defaulted to `--dangerously-skip-permissions` on every Claude Code spawn path — swarm, SPARC, hive-mind, GitHub integration, batch tasks. This flag bypasses **all** permission prompts, allowing arbitrary shell execution, unrestricted file access, and uncontrolled network requests with no audit trail.

We replaced it with granular `--allowedTools` allowlists, `permissions.allow`/`permissions.deny` lists, and a SafeBash MCP server with OS sandbox support. Every spawn path now restricts tools by default. See [SECURITY.md](./SECURITY.md) for full details.

## Quick start

```bash
npm install -g outlaw-flow
# or
npx outlaw-flow init --force

# Swarm — safe defaults, no permission bypass
outlaw-flow swarm "Build a REST API" --claude

# SPARC — uses SPARC-specific tool allowlist
outlaw-flow sparc run code "Implement authentication"

# GitHub — uses GitHub-specific tool allowlist
outlaw-flow github pr-manager review

# CI/CD — auto-detects non-interactive, applies --non-interactive + --allowedTools
outlaw-flow swarm "Deploy staging"
```

## Key changes from upstream

| Change | Upstream (claude-flow) | Outlaw-flow |
|--------|----------|-------------|
| Permission model | `--dangerously-skip-permissions` (bypasses all) | `--allowedTools` with mode-specific allowlists |
| Bash restrictions | 4 deny patterns | 25+ deny patterns, replaced by SafeBash MCP |
| Tool allowlists | None (all tools available) | Swarm, SPARC, GitHub each get scoped tools |
| CI/Docker/SSH | `--dangerously-skip-permissions` | `--non-interactive` + allowlists |
| Bare spawns | Several paths spawned Claude with no restrictions | All paths apply allowlists unconditionally |
| `allowed-tools.js` | Did not exist | Central allowlist module |
| Download-execute chain | No prevention | `curl -o`/`wget -q` removed, `chmod +x` restricted, temp-dir execution denied |
| SafeBash MCP server | Not present | Semantic command analysis + OS sandbox (replaces raw Bash) |

## Architecture

- **CLI** — Command-line interface for swarm, SPARC, hive-mind, GitHub, memory operations
- **Orchestrator** — Coordinates agents and tasks
- **Memory** — Persistent key-value store with namespace support
- **MCP server** — Model Context Protocol integration for Claude Code
- **Swarm executor** — Spawns and manages Claude Code instances with scoped permissions
- **SafeBash** — Semantic command analysis MCP server with OS sandbox support (replaces raw Bash)

## Commands

```bash
outlaw-flow init                  # Initialize project with safe defaults
outlaw-flow start                 # Start the orchestration daemon
outlaw-flow status                # Check system health
outlaw-flow monitor               # Real-time monitoring

outlaw-flow swarm <objective>     # Deploy agent swarm
outlaw-flow sparc run <mode> <task>  # SPARC development workflow
outlaw-flow hive-mind wizard      # Interactive swarm setup
outlaw-flow memory store <k> <v>  # Store key-value data
outlaw-flow memory query <term>   # Search memory
outlaw-flow memory stats          # Memory usage

outlaw-flow --help                # Full command reference
```

## Security

See [SECURITY.md](./SECURITY.md) for:

- SafeBash 6-check pipeline (subshell, injection, binary allowlist, path resolver, redirect guard, taint tracker)
- OS sandbox layer (bubblewrap on Linux, sandbox-exec on macOS)
- Migration guide from `--dangerously-skip-permissions`
- File-level change reference

### SafeBash quick check

```bash
outlaw-flow safe-bash check "npm install"          # ✅ allowed
outlaw-flow safe-bash check "node --require /tmp/x" # ❌ injection flag blocked
outlaw-flow safe-bash check "sudo rm -rf /"         # ❌ binary blocked
outlaw-flow safe-bash check "curl -fsSL https://example.com > /tmp/x" # ❌ redirect outside project
```

**Download-execute chain prevention**: `curl -o` and `wget -q` are removed from the allow list (use `curl -fsSL` to fetch + `Write` tool to save). `chmod +x` restricted to project-relative paths (`./*`). Runtime deny rules block `node`/`npx`/`bun` from executing files in `/tmp`, `/var/tmp`, `/dev/shm`.

## Contributing

1. Never use `--dangerously-skip-permissions` in new code
2. Add required tools to `src/cli/utils/allowed-tools.js`
3. Pass `--allowedTools` with the appropriate mode allowlist
4. Use `--non-interactive` for CI/Docker/SSH environments
5. Add new Bash patterns to `permissions.allow` in the settings template

## Credits

Originally based on [claude-flow](https://github.com/ruvnet/claude-code-flow) v2.0.0-alpha by [rUv](https://github.com/ruvnet). Now maintained independently as outlaw-flow by [Outlaw Research Labs](https://github.com/outlawresearchlabs).

MIT License — see [LICENSE](./LICENSE).