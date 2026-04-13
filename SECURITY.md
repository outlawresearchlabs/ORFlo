# Security: SafeBash Permission Model

## Overview

Outlaw-Flow uses a **SafeBash MCP server** that replaces the raw `Bash` tool with semantic command analysis and OS sandbox support. This is the third iteration of our security model:

1. **v1 (upstream)**: `--dangerously-skip-permissions` — no restrictions
2. **v2 (our patch)**: `--allowedTools` allowlists + `permissions.allow`/`permissions.deny` pattern lists
3. **v3 (current)**: SafeBash MCP server — semantic analysis + OS sandbox

## Why Pattern Lists Were Insufficient

The v2 allow/deny pattern approach had 5 fundamental weaknesses:

1. **Flag-based path bypass** — `node --require /tmp/x` starts with `node --require`, not `node /tmp/`, so it matches `Bash(node *)` allow and skips `Bash(node /tmp/*)` deny
2. **Shell redirect bypass** — `echo x > /tmp/y` matches `Bash(echo *)` allow; redirects aren't individually permission-checked
3. **Unbounded growth** — every new bypass needs a new deny rule
4. **Composability across invocations** — safe commands in separate Bash calls chain into unsafe behavior
5. **String matching, not semantic** — patterns can't reason about what commands actually do

## SafeBash Architecture

### The 6-Check Pipeline

Every command passes through these checks in order:

1. **Subshell check** — block `$()` and backtick subshells
2. **Injection detector** — block `--require`, `-e`, `-c`, `--eval` flags per binary
3. **Binary allowlist** — verify binary is in allowed set (npm, node, git, curl, etc.)
4. **Path resolver** — resolve all paths via `realpath`, check project directory bounds
5. **Redirect guard** — block write/append redirects outside project directory
6. **Taint tracker** — block interpreters from executing files written by the Write tool this session

### OS Sandbox Layer

When available, commands run inside an OS sandbox:

| Platform | Sandbox | Enforcement |
|----------|---------|-------------|
| Linux | bubblewrap (bwrap) | Read-only root filesystem, writable project dir only, isolated /tmp, no network (unless allowed) |
| macOS | sandbox-exec | Apple sandbox profile restricting file/network access |
| Windows | None | SafeBash semantic checks only |

### Audit Trail

Every `safe_bash` call is logged to `.claude/safe-bash-audit.jsonl` with: timestamp, invocation ID, command, parsed result, validation result, sandbox type, exit code, duration.

## Threat Model Coverage

| Weakness | Pattern approach | SafeBash |
|----------|-----------------|----------|
| Flag-based path bypass (`node --require /tmp/x`) | Missed by `Bash(node /tmp/*)` deny | `checkInjection()` catches `--require` flag |
| Shell redirect bypass (`echo x > /tmp/y`) | Missed by `Bash(echo *)` allow | `resolveAndCheckPaths()` resolves redirect targets |
| Unbounded growth | Every bypass = new deny rule | Semantic checks cover entire categories |
| Composability (Write + execute) | No cross-invocation awareness | `TaintTracker` knows what Write tool created |
| String matching | Can't reason about command intent | Binary allowlist + flag detection + path bounds |
| `docker run --privileged` | `Bash(docker *)` allows it | `checkBinary()` applies docker-specific restrictions |

## What Replaced `--dangerously-skip-permissions`

### 1. `Bash` removed from core tools

`CORE_TOOLS` no longer includes `Bash`. Agents use `mcp__safe-bash__safe_bash` instead.

### 2. Mode-specific tool allowlists

| Mode | Tools |
|------|-------|
| **Core** | Read, Write, Edit, Glob, Grep, WebSearch, WebFetch, safe_bash |
| **Swarm** | Core + full MCP swarm coordination tools |
| **SPARC** | Core + memory/workflow/health MCP tools |
| **GitHub** | Core + GitHub MCP integration tools |

### 3. `--non-interactive` for CI/Docker/SSH

Environment detection recommends `--non-interactive` for non-interactive contexts.

## Legacy Pattern Lists (Deprecated)

The `SWARM_ALLOWED_BASH_PATTERNS` and `SWARM_DENIED_BASH_PATTERNS` arrays in `allowed-tools.js` are kept for backward compatibility with existing `settings.json` files. New projects should use SafeBash only.

## Migration Guide

### Before (v1, insecure):
```bash
outlaw-flow swarm "build API" --dangerously-skip-permissions
```

### After v2 (pattern lists):
```bash
outlaw-flow swarm "build API"  # --allowedTools applied automatically
```

### Current (SafeBash):
```bash
outlaw-flow swarm "build API"  # Bash tool removed, safe_bash MCP tool used instead
```

## File Reference

### New files (SafeBash)
| File | Purpose |
|------|---------|
| `src/safe-bash/types.ts` | Shared interfaces |
| `src/safe-bash/shell-parser.ts` | Shell command parser (shell-quote + redirect extraction) |
| `src/safe-bash/injection-detector.ts` | Flag-based injection detection |
| `src/safe-bash/binary-allowlist.ts` | Semantic binary allow/deny |
| `src/safe-bash/path-resolver.ts` | Path resolution and project bounds |
| `src/safe-bash/taint-tracker.ts` | Cross-invocation file tracking |
| `src/safe-bash/os-sandbox.ts` | bwrap/sandbox-exec wrapper |
| `src/safe-bash/audit-log.ts` | JSONL audit trail |
| `src/safe-bash/safe-bash-server.ts` | MCP server (SDK-based) |
| `src/safe-bash/index.ts` | Entry point |

### Modified files
| File | Change |
|------|--------|
| `src/cli/utils/allowed-tools.js` | `Bash` removed from `CORE_TOOLS`, `safe_bash` MCP tool added |
| `src/cli/simple-commands/init/templates/settings.json` | Bash patterns removed, safe-bash MCP server added |
| `src/cli/utils/environment-detector.ts` | Sandbox capability detection added |
| `src/swarm/executor.ts` | `sandboxed` flag wired up |
| `SECURITY.md` | This rewrite |
| `README.md` | Updated security section |

## Contributing

When adding new spawn paths:
1. **Never** use `--dangerously-skip-permissions`
2. **Never** add `Bash` back to `CORE_TOOLS`
3. Use `mcp__safe-bash__safe_bash` for command execution
4. Add new binaries to `src/safe-bash/binary-allowlist.ts` if needed
5. Use `--non-interactive` for CI/Docker/SSH environments