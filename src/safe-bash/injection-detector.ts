/**
 * Injection flag detector for SafeBash.
 *
 * Detects flag-based injection that bypasses path-based deny rules.
 * e.g., `node --require /tmp/x` bypasses `Bash(node /tmp/*)` deny.
 */

import type { ParsedCommand, InjectionCheckResult } from './types.js';

/** Flags blocked per binary */
const INJECTION_FLAGS: Record<string, string[]> = {
  node: ['--require', '-r', '-e', '--eval', '-p', '--print', '--eval', '-i'],
  npm: ['--node-options', '-c', '--eval'],
  npx: ['--node-options', '-c', '--eval'],
  python: ['-c'],
  python3: ['-c'],
  perl: ['-e', '-E'],
  ruby: ['-e', '-E'],
  sh: ['-c'],
  bash: ['-c'],
  zsh: ['-c'],
  fish: ['-c'],
  dash: ['-c'],
  ksh: ['-c'],
};

/** Binaries that should never be invoked (use safe_bash instead) */
const BLOCKED_INTERPRETERS = ['sh', 'bash', 'zsh', 'fish', 'dash', 'ksh', 'csh', 'tcsh'];

/**
 * Check a parsed command for injection flags.
 */
export function checkInjection(parsed: ParsedCommand): InjectionCheckResult {
  const binary = parsed.binaryName.toLowerCase();

  // Block direct interpreter invocation
  if (BLOCKED_INTERPRETERS.includes(binary)) {
    return {
      safe: false,
      blockedFlags: [binary],
      reason: `Direct shell invocation blocked: ${binary}. Use safe_bash for command execution.`,
    };
  }

  // Check for injection flags specific to this binary
  const flags = INJECTION_FLAGS[binary];
  if (!flags) {
    // No injection rules for this binary — pass
    return { safe: true, blockedFlags: [], reason: 'OK' };
  }

  const blockedFlags: string[] = [];
  for (const arg of parsed.args) {
    const lowerArg = arg.toLowerCase();
    // Check if any arg matches a blocked flag (exact or prefix with =)
    for (const flag of flags) {
      if (lowerArg === flag || lowerArg.startsWith(flag + '=')) {
        blockedFlags.push(arg);
      }
    }
  }

  // Also check pipe targets
  for (const pipeBinary of parsed.pipeTargets) {
    const lowerPipe = pipeBinary.toLowerCase();
    if (BLOCKED_INTERPRETERS.includes(lowerPipe)) {
      return {
        safe: false,
        blockedFlags: [pipeBinary],
        reason: `Pipe to shell interpreter blocked: ${pipeBinary}`,
      };
    }
    const pipeFlags = INJECTION_FLAGS[lowerPipe];
    if (pipeFlags) {
      // Flag that pipe target has injection-capable flags
      blockedFlags.push(`pipe:${pipeBinary}`);
    }
  }

  if (blockedFlags.length > 0) {
    return {
      safe: false,
      blockedFlags,
      reason: `Injection flags detected for ${binary}: ${blockedFlags.join(', ')}`,
    };
  }

  return { safe: true, blockedFlags: [], reason: 'OK' };
}