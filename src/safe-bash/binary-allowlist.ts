/**
 * Binary allowlist for SafeBash.
 *
 * Semantic binary-level allow/deny replacing pattern-based Bash(npm *).
 */

import type { ParsedCommand, BinaryCheckResult } from './types.js';

const BINARY_CATEGORIES = {
  package_managers: ['npm', 'npx', 'yarn', 'pnpm', 'bun'],
  runtimes: ['node', 'bun', 'deno'],
  git: ['git', 'gh'],
  file_ops: [
    'cat', 'ls', 'pwd', 'echo', 'mkdir', 'cp', 'mv', 'touch', 'chmod',
    'diff', 'find', 'grep', 'sed', 'awk', 'tar', 'wc',
    'sort', 'head', 'tail', 'which', 'type', 'whoami',
    'realpath', 'readlink', 'file', 'stat', 'du', 'df',
    'tee', 'tr', 'cut', 'xargs',
  ],
  network: ['curl'],
  docker: ['docker'],
  testing: ['jest', 'vitest', 'mocha', 'ava', 'tape', 'nyc', 'c8'],
  claude: ['claude'],
  build: ['make', 'cmake', 'cargo', 'go', 'tsc', 'tsx', 'esbuild', 'webpack', 'vite', 'rollup'],
} as const;

/** Flattened set of allowed binaries */
const ALLOWED_BINARIES = new Set<string>(
  Object.values(BINARY_CATEGORIES).flat(),
);

/** Binaries that are always denied */
const BLOCKED_BINARIES = new Set([
  'sh', 'bash', 'zsh', 'fish', 'dash', 'ksh', 'csh', 'tcsh',
  'sudo', 'su',
  'chown',
  'eval', 'exec',
  'socat', 'nc', 'ncat', 'ncat',
  'crontab', 'at',
  'systemctl', 'service',
  'wget', // Use curl -fsSL instead
  'dd',
  'mkfifo',
  'strace', 'ltrace',
  'gdb',
  'python', 'python3', 'perl', 'ruby', // Interpreters blocked entirely; use safe_bash for execution
]);

/**
 * Check if a parsed command's binary is allowed.
 */
export function checkBinary(parsed: ParsedCommand): BinaryCheckResult {
  const binary = parsed.binaryName.toLowerCase();

  // Explicit deny list
  if (BLOCKED_BINARIES.has(binary)) {
    return {
      allowed: false,
      reason: `Binary blocked: ${binary}`,
    };
  }

  // Explicit allow list
  if (ALLOWED_BINARIES.has(binary)) {
    // Docker-specific restrictions
    if (binary === 'docker') {
      return checkDockerCommand(parsed);
    }
    // Find the category
    for (const [category, binaries] of Object.entries(BINARY_CATEGORIES)) {
      if ((binaries as readonly string[]).includes(binary)) {
        return { allowed: true, reason: 'OK', category };
      }
    }
    return { allowed: true, reason: 'OK' };
  }

  // Unknown binary — deny by default
  return {
    allowed: false,
    reason: `Binary not in allowlist: ${binary}. Add to src/safe-bash/binary-allowlist.ts if needed.`,
  };
}

/**
 * Docker-specific restrictions.
 * docker run is blocked unless restricted (no privileged, no host network).
 */
function checkDockerCommand(parsed: ParsedCommand): BinaryCheckResult {
  // docker build, docker ps, docker logs, etc. are allowed
  if (parsed.args.length === 0) {
    return { allowed: true, reason: 'OK', category: 'docker' };
  }

  const subcommand = parsed.args[0];

  // docker run requires restrictions
  if (subcommand === 'run') {
    const hasPrivileged = parsed.args.some(a => a === '--privileged');
    const hasCapAdd = parsed.args.some(a => a.startsWith('--cap-add'));
    const hasHostNetwork = parsed.args.some(a => a === '--network=host' || a === '--net=host');
    const hasHostPid = parsed.args.some(a => a === '--pid=host');

    if (hasPrivileged || hasCapAdd || hasHostNetwork || hasHostPid) {
      return {
        allowed: false,
        reason: `docker run with privileged/host access blocked: ${[hasPrivileged && '--privileged', hasCapAdd && '--cap-add', hasHostNetwork && '--network=host', hasHostPid && '--pid=host'].filter(Boolean).join(', ')}`,
      };
    }

    return { allowed: true, reason: 'OK (restricted)', category: 'docker' };
  }

  // docker exec into a container — check for dangerous flags
  if (subcommand === 'exec') {
    const hasPrivileged = parsed.args.some(a => a === '--privileged');
    if (hasPrivileged) {
      return { allowed: false, reason: 'docker exec --privileged blocked', category: 'docker' };
    }
  }

  return { allowed: true, reason: 'OK', category: 'docker' };
}

/**
 * Get the full allowed binaries set (for external use).
 */
export function getAllowedBinaries(): Set<string> {
  return new Set(ALLOWED_BINARIES);
}

/**
 * Get the blocked binaries set (for external use).
 */
export function getBlockedBinaries(): Set<string> {
  return new Set(BLOCKED_BINARIES);
}