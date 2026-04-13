/**
 * OS sandbox wrapper for SafeBash.
 *
 * Wraps command execution in an OS-level sandbox when available:
 * - Linux: bubblewrap (bwrap)
 * - macOS: sandbox-exec
 * - Windows: no OS sandbox (SafeBash-only)
 */

import { execSync } from 'child_process';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import type { SandboxCapabilities, SandboxOptions, SandboxResult } from './types.js';

/**
 * Detect OS sandbox capabilities (synchronous).
 */
export function detectSandboxCapabilitiesSync(): SandboxCapabilities {
  const capabilities: SandboxCapabilities = {
    available: false,
    type: 'none',
    bwrapPath: null,
    sandboxExecPath: null,
  };

  if (process.platform === 'linux') {
    const bwrapPath = whichSync('bwrap');
    if (bwrapPath) {
      capabilities.available = true;
      capabilities.type = 'bubblewrap';
      capabilities.bwrapPath = bwrapPath;
    }
  } else if (process.platform === 'darwin') {
    const sandboxExecPath = whichSync('sandbox-exec');
    if (sandboxExecPath) {
      capabilities.available = true;
      capabilities.type = 'sandbox-exec';
      capabilities.sandboxExecPath = sandboxExecPath;
    }
  }

  return capabilities;
}

/**
 * Wrap a command in an OS sandbox if available.
 */
export function wrapInSandbox(
  command: string,
  options: SandboxOptions,
  capabilities: SandboxCapabilities,
): SandboxResult {
  if (!capabilities.available) {
    return { wrappedCommand: command, env: {}, type: 'none' };
  }

  if (capabilities.type === 'bubblewrap' && capabilities.bwrapPath) {
    return wrapInBwrap(command, options, capabilities.bwrapPath);
  }

  if (capabilities.type === 'sandbox-exec' && capabilities.sandboxExecPath) {
    return wrapInSandboxExec(command, options, capabilities.sandboxExecPath);
  }

  return { wrappedCommand: command, env: {}, type: 'none' };
}

/**
 * Wrap command in bubblewrap (Linux).
 */
function wrapInBwrap(
  command: string,
  options: SandboxOptions,
  bwrapPath: string,
): SandboxResult {
  const args: string[] = [
    // Read-only system directories
    '--ro-bind', '/usr', '/usr',
    '--ro-bind', '/lib', '/lib',
    '--ro-bind', '/lib64', '/lib64',
    '--ro-bind', '/bin', '/bin',
    '--ro-bind', '/sbin', '/sbin',
    '--ro-bind', '/etc', '/etc',
    // Writable project directory
    '--bind', options.projectRoot, options.projectRoot,
    // Additional writable paths
    ...options.writablePaths.flatMap(p => ['--bind', p, p]),
    // Additional read-only paths
    ...options.readOnlyPaths.flatMap(p => ['--ro-bind', p, p]),
    // Minimal /dev and /proc
    '--dev', '/dev',
    '--proc', '/proc',
    // Isolated /tmp (not shared with host)
    '--tmpfs', '/tmp',
    // Home directory — read-only except for project
    '--ro-bind', process.env.HOME || '/root', '/home/user',
    // Network isolation (unless allowed)
    ...(options.allowNetwork ? [] : ['--unshare-net']),
    // Process safety
    '--die-with-parent',
    '--new-session',
    // Execute the command
    '--', '/bin/sh', '-c', command,
  ];

  const wrappedCommand = `${bwrapPath} ${args.map(a => shellEscape(a)).join(' ')}`;

  return {
    wrappedCommand,
    env: { HOME: '/home/user' },
    type: 'bubblewrap',
  };
}

/**
 * Wrap command in sandbox-exec (macOS).
 */
function wrapInSandboxExec(
  command: string,
  options: SandboxOptions,
  sandboxExecPath: string,
): SandboxResult {
  const profile = buildSandboxExecProfile(options);

  // Write profile to .claude/ within project (not /tmp — avoids predictable-path attacks)
  const profileDir = path.join(options.projectRoot, '.claude');
  const profilePath = path.join(profileDir, `sandbox-${Date.now()}-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}.sb`);
  try {
    if (!fs.existsSync(profileDir)) {
      fs.mkdirSync(profileDir, { recursive: true });
    }
    fs.writeFileSync(profilePath, profile, 'utf8');
  } catch {
    // Can't write profile — fall back to no sandbox
    return { wrappedCommand: command, env: {}, type: 'none' };
  }

  const wrappedCommand = `${sandboxExecPath} -f ${shellEscape(profilePath)} -- ${command}`;

  return {
    wrappedCommand,
    env: {},
    type: 'sandbox-exec',
  };
}

/**
 * Build a sandbox-exec profile string.
 */
function buildSandboxExecProfile(options: SandboxOptions): string {
  const lines = [
    '(version 1)',
    '(deny default)',
    // Allow file operations within project
    `(allow file-read* file-write* (subpath "${options.projectRoot}"))`,
    // Allow reading system directories
    '(allow file-read* (subpath "/usr") (subpath "/lib") (subpath "/System") (subpath "/Library"))',
    // Allow executing system binaries
    '(allow process-exec (subpath "/usr/bin") (subpath "/usr/local/bin") (subpath "/opt/homebrew"))',
    // Network
    options.allowNetwork ? '(allow network*)' : '(deny network*)',
    // Allow sysctl reads
    '(allow sysctl-read)',
    // Allow signal handling
    '(allow process-fork)',
    '(allow signal (targets subset (pids)))',
  ];

  // Additional writable paths
  for (const wp of options.writablePaths) {
    lines.push(`(allow file-read* file-write* (subpath "${wp}"))`);
  }

  return lines.join('\n') + '\n';
}

/**
 * Find an executable on PATH (synchronous).
 */
function whichSync(binary: string): string | null {
  const pathEnv = process.env.PATH || '';
  const pathDirs = pathEnv.split(path.delimiter);

  for (const dir of pathDirs) {
    const fullPath = path.join(dir, binary);
    try {
      execSync(`test -x ${shellEscape(fullPath)}`, { stdio: 'ignore' });
      return fullPath;
    } catch {
      continue;
    }
  }
  return null;
}

/**
 * Escape a string for shell use.
 */
function shellEscape(s: string): string {
  if (/^[a-zA-Z0-9_./-]+$/.test(s)) return s;
  return `'${s.replace(/'/g, "'\\''")}'`;
}