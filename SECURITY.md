# Security: Permission Model

## Overview

Outlaw-Flow v2 uses a **safe permissions allowlist** instead of `--dangerously-skip-permissions`. This change replaces blanket permission bypass with granular tool and command restrictions.

## Why `--dangerously-skip-permissions` Was Removed

`--dangerously-skip-permissions` bypasses **all** Claude Code permission prompts, allowing arbitrary shell execution, unrestricted file access, and uncontrolled network requests. While convenient for automated workflows, it creates significant security risks:

- **Arbitrary command execution** — no validation on what Bash commands run
- **Unrestricted file access** — can read/write any file on the system
- **No audit trail** — permission bypass makes it impossible to track what was allowed vs denied
- **Supply chain risk** — compromised dependencies could execute arbitrary commands

## What Replaces It

### 1. `--allowedTools` Flag

Each execution mode (swarm, hive-mind, SPARC, GitHub) specifies exactly which Claude Code tools are available:

```
--allowedTools Read,Write,Edit,Glob,Grep,Bash,WebSearch,WebFetch
```

Plus MCP-specific tools for swarm coordination:
```
--allowedTools mcp__outlaw-flow__agent_spawn,mcp__outlaw-flow__task_create,...
```

### 2. `permissions.allow` / `permissions.deny` in Settings

The `.claude/settings.json` file defines which Bash commands and tools are pre-authorized:

**Allow list** (~52 patterns, expanded from 16):
- Package management: `npm`, `npx`, `node`, `bun`
- Git operations: `git`, `gh`
- File operations: `cat`, `ls`, `mkdir`, `cp`, `mv`, `diff`, `find`, etc.
- `chmod` restricted to safe modes: `+x ./*` (project-relative only), `+r`, `+w`, `755`, `644`
- Network restricted to fetch only (no file-save): `curl -f`, `curl -fsSL` — use `Write` tool to save downloaded content
- Claude CLI: `claude` (for nested spawns)
- Core tools: `Read`, `Write`, `Edit`, `Glob`, `Grep`, `WebSearch`, `WebFetch`

**Deny list** (~25 patterns, expanded from 4):
- `rm -rf /`, `rm -rf *` — prevents mass deletion
- `sudo *` — prevents privilege escalation
- `curl * | bash`, `curl * | sh`, `curl * | fish` — prevents pipe-to-shell
- `wget * | sh`, `wget * | bash` — same
- `bash -c *`, `sh -c *` — prevents shell eval injection
- `eval *` — prevents arbitrary code evaluation
- `chown *` — prevents ownership changes
- `chmod 777 *`, `chmod 666 *`, `chmod a+rw *`, `chmod a+rwx *` — prevents permission escalation
- `node /tmp/*`, `node /var/tmp/*`, `node /dev/shm/*` — prevents execution from temp directories
- `npx /tmp/*`, `npx /var/tmp/*`, `npx /dev/shm/*` — same
- `bun /tmp/*`, `bun /var/tmp/*`, `bun /dev/shm/*` — same

### 3. `--non-interactive` for CI/Docker/SSH

Environment detection now recommends `--non-interactive` instead of `--dangerously-skip-permissions` for non-interactive contexts. This flag:
- Disables interactive prompts
- Still respects the `permissions.allow`/`permissions.deny` lists
- Still respects `--allowedTools` restrictions

### 4. Mode-Specific Allowlists

| Mode | Tools |
|------|-------|
| **Swarm** | Core tools + full MCP swarm coordination tools |
| **SPARC** | Core tools + memory/workflow/health MCP tools |
| **GitHub** | Core tools + GitHub MCP integration tools |

## Migration Guide

### Before (insecure):
```bash
outlaw-flow swarm "build API" --dangerously-skip-permissions
outlaw-flow sparc run code "implement feature"
# All spawn paths defaulted to --dangerously-skip-permissions
```

### After (safe):
```bash
outlaw-flow swarm "build API"
# Uses --allowedTools with safe allowlist by default

outlaw-flow sparc run code "implement feature"
# Uses SPARC-specific allowlist by default

outlaw-flow sparc run code "implement feature" --enable-permissions
# Interactive prompts for full control
```

### CI/CD:
```bash
# Before
outlaw-flow swarm "deploy" --dangerously-skip-permissions

# After — safe defaults for CI
outlaw-flow swarm "deploy"
# Environment detector auto-applies --non-interactive + --allowedTools
```

## File Reference

| File | Change |
|------|--------|
| `src/cli/utils/allowed-tools.js` | **NEW** — central allowlist definitions |
| `src/cli/simple-commands/swarm.js` | `--dangerously-skip-permissions` → `--allowedTools` |
| `src/cli/simple-commands/hive-mind.js` | Same |
| `src/cli/simple-commands/sparc.js` | Same, `--enable-permissions` now uses allowlist |
| `src/cli/simple-commands/github.js` | Same, mode-specific allowlist |
| `src/cli/commands/claude.ts` | `--no-permissions` → safe allowlist |
| `src/cli/commands/swarm.ts` | Same |
| `src/cli/commands/sparc.ts` | Same |
| `src/cli/commands/index.ts` | Same |
| `src/cli/commands/help.ts` | Updated help text |
| `src/cli/swarm-standalone.js` | Same |
| `src/cli/simple-cli.js` | Same |
| `src/cli/simple-cli.ts` | Same |
| `src/cli/utils/environment-detector.ts` | `--dangerously-skip-permissions` → `--non-interactive` |
| `src/swarm/executor.ts` | Same |
| `src/swarm/executor-v2.ts` | Same, retry logic now uses `--allowedTools` |
| `src/swarm/coordinator.ts` | Same |
| `src/coordination/background-executor.ts` | Same |
| `scripts/claude-sparc.sh` | Same |
| `init/templates/settings.json` | Expanded allow/deny lists |
| `init/templates/claude-md.js` | Updated guidance |
| `init/index.js` | Updated guidance |

## Contributing

When adding new spawn paths, **never** use `--dangerously-skip-permissions`. Instead:
1. Add the required tools to `src/cli/utils/allowed-tools.js`
2. Pass `--allowedTools` with the appropriate mode's allowlist
3. Use `--non-interactive` for CI/Docker/SSH environments
4. Add any new Bash patterns to `permissions.allow` in the settings template
