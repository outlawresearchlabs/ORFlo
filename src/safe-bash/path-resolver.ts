/**
 * Path resolver for SafeBash.
 *
 * Resolves all paths via realpath (eliminates ../ and symlinks),
 * checks project directory bounds, blocks redirects outside project.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { ParsedCommand, PathCheckResult, PathViolation } from './types.js';

/** Directories that are always blocked for execution inputs */
const BLOCKED_EXEC_DIRS = ['/tmp', '/var/tmp', '/dev/shm'];

/**
 * Resolve all paths in a parsed command and check project bounds.
 */
export function resolveAndCheckPaths(
  parsed: ParsedCommand,
  projectRoot: string,
  writablePaths: string[] = [],
): PathCheckResult {
  const violations: PathViolation[] = [];
  const resolvedProject = realpathSafe(projectRoot);

  // Check redirect targets
  for (const redirect of parsed.redirects) {
    if (redirect.type === 'write' || redirect.type === 'append' || redirect.type === 'stderr-write') {
      const resolved = resolvePath(redirect.target, projectRoot);
      redirect.targetResolved = resolved;

      if (!isWithinProject(resolved, resolvedProject, writablePaths)) {
        violations.push({
          type: 'redirect-outside-project',
          path: redirect.target,
          resolved,
          reason: `Redirect target outside project: ${redirect.target} -> ${resolved}`,
        });
      }
    }

    // Check read redirects against blocked dirs
    if (redirect.type === 'read') {
      const resolved = resolvePath(redirect.target, projectRoot);
      redirect.targetResolved = resolved;
      // Read redirects are generally allowed, but check for sensitive paths
      // (not blocking reads, just recording for audit)
    }
  }

  // Check path-like arguments
  for (const arg of parsed.args) {
    if (looksLikePath(arg)) {
      const resolved = resolvePath(arg, projectRoot);

      // Check if path is in a blocked execution directory
      if (isInBlockedExecDir(resolved)) {
        violations.push({
          type: 'tmp-directory',
          path: arg,
          resolved,
          reason: `Path in blocked directory: ${arg} -> ${resolved}`,
        });
      }

      // Check if path (when used as an execution target) is within project bounds
      // Only apply project bounds check for arguments that look like execution targets
      // (not for flags like --config, --output, etc.)
      if (isExecutionTarget(parsed.binaryName, arg, parsed.args)) {
        if (!isWithinProject(resolved, resolvedProject, writablePaths)) {
          violations.push({
            type: 'arg-outside-project',
            path: arg,
            resolved,
            reason: `Execution target outside project: ${arg} -> ${resolved}`,
          });
        }
      }
    }
  }

  // Check the binary itself if it's a path
  if (looksLikePath(parsed.binary)) {
    const resolved = resolvePath(parsed.binary, projectRoot);
    if (isInBlockedExecDir(resolved)) {
      violations.push({
        type: 'tmp-directory',
        path: parsed.binary,
        resolved,
        reason: `Binary in blocked directory: ${parsed.binary} -> ${resolved}`,
      });
    }
  }

  // Check pipe targets
  for (const pipeBinary of parsed.pipeTargets) {
    if (looksLikePath(pipeBinary)) {
      const resolved = resolvePath(pipeBinary, projectRoot);
      if (isInBlockedExecDir(resolved)) {
        violations.push({
          type: 'tmp-directory',
          path: pipeBinary,
          resolved,
          reason: `Pipe target in blocked directory: ${pipeBinary} -> ${resolved}`,
        });
      }
    }
  }

  return {
    safe: violations.length === 0,
    violations,
  };
}

/**
 * Check if an argument is an execution target for a given binary.
 * e.g., `node script.js` — script.js is an execution target.
 * e.g., `git commit -m "message"` — "message" is not an execution target.
 */
function isExecutionTarget(binaryName: string, arg: string, allArgs: string[]): boolean {
  const interpreters = ['node', 'bun', 'deno', 'python', 'python3', 'perl', 'ruby'];
  if (interpreters.includes(binaryName)) {
    // First non-flag argument to an interpreter is the execution target
    const argIndex = allArgs.indexOf(arg);
    const nonFlagArgs = allArgs.filter(a => !a.startsWith('-'));
    return nonFlagArgs.length > 0 && nonFlagArgs[0] === arg;
  }
  return false;
}

/**
 * Resolve a path relative to cwd, then via realpath.
 */
function resolvePath(p: string, cwd: string): string {
  const absolute = path.isAbsolute(p) ? p : path.resolve(cwd, p);
  return realpathSafe(absolute);
}

/**
 * Safe realpath that doesn't throw.
 */
function realpathSafe(p: string): string {
  try {
    return fs.realpathSync(p);
  } catch {
    // If the path doesn't exist, resolve it manually
    return path.resolve(p);
  }
}

/**
 * Check if a resolved path is within the project root or writable paths.
 */
function isWithinProject(resolved: string, projectRoot: string, writablePaths: string[]): boolean {
  if (resolved.startsWith(projectRoot + path.sep) || resolved === projectRoot) {
    return true;
  }
  for (const wp of writablePaths) {
    const resolvedWp = realpathSafe(wp);
    if (resolved.startsWith(resolvedWp + path.sep) || resolved === resolvedWp) {
      return true;
    }
  }
  return false;
}

/**
 * Check if a path is in a blocked execution directory.
 */
function isInBlockedExecDir(resolved: string): boolean {
  for (const blocked of BLOCKED_EXEC_DIRS) {
    if (resolved.startsWith(blocked + path.sep) || resolved === blocked) {
      // Exception: /tmp is allowed for non-execution reads (like /tmp/some-config)
      // But we block it for all execution-related paths
      return true;
    }
  }
  return false;
}

/**
 * Heuristic: does a string look like a file path?
 */
function looksLikePath(s: string): boolean {
  if (!s || s.startsWith('-')) return false;
  return s.startsWith('/') || s.startsWith('./') || s.startsWith('../') || s.includes('/');
}