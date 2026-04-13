/**
 * SafeBash type definitions.
 * Shared interfaces for the SafeBash MCP server.
 */

/** Result of parsing a shell command string */
export interface ParsedCommand {
  /** Resolved absolute path of the binary */
  binary: string;
  /** Just the basename: "node", "npm", etc. */
  binaryName: string;
  /** Arguments to the binary */
  args: string[];
  /** Shell redirects found in the command */
  redirects: Redirect[];
  /** Binary names after pipe operators */
  pipeTargets: string[];
  /** Individual pipe segments (raw strings) */
  pipeSegments: string[];
  /** KEY=VALUE assignments before the binary */
  envAssignments: Record<string, string>;
  /** Subshell expressions found: $(), backticks */
  subshells: string[];
  /** Command separators found: ;, &&, || */
  commandSeparators: string[];
  /** Original command string */
  raw: string;
}

/** Shell redirect */
export interface Redirect {
  type: 'write' | 'append' | 'read' | 'stderr-write';
  target: string;
  /** After realpath resolution */
  targetResolved?: string;
}

/** Overall validation result from the SafeBash pipeline */
export interface ValidationResult {
  safe: boolean;
  reason: string;
  /** Which check failed, if any */
  failedCheck?: 'subshell' | 'command-separator' | 'injection' | 'binary' | 'path' | 'redirect' | 'taint' | 'network';
}

/** Injection flag check result */
export interface InjectionCheckResult {
  safe: boolean;
  blockedFlags: string[];
  reason: string;
}

/** Binary allowlist check result */
export interface BinaryCheckResult {
  allowed: boolean;
  reason: string;
  category?: string;
}

/** Path check result */
export interface PathCheckResult {
  safe: boolean;
  violations: PathViolation[];
}

/** Individual path violation */
export interface PathViolation {
  type: 'redirect-outside-project' | 'arg-outside-project' | 'symlink-escape' | 'tmp-directory';
  path: string;
  resolved: string;
  reason: string;
}

/** Taint tracker check result */
export interface TaintCheckResult {
  safe: boolean;
  reason: string;
  taintedFiles: string[];
}

/** OS sandbox capabilities detected at startup */
export interface SandboxCapabilities {
  available: boolean;
  type: 'bubblewrap' | 'sandbox-exec' | 'none';
  bwrapPath: string | null;
  sandboxExecPath: string | null;
}

/** Options for wrapping a command in an OS sandbox */
export interface SandboxOptions {
  projectRoot: string;
  allowNetwork: boolean;
  writablePaths: string[];
  readOnlyPaths: string[];
}

/** Result of wrapping a command in an OS sandbox */
export interface SandboxResult {
  wrappedCommand: string;
  env: Record<string, string>;
  type: 'bubblewrap' | 'sandbox-exec' | 'none';
}

/** Single audit log entry */
export interface AuditEntry {
  timestamp: string;
  invocationId: string;
  command: string;
  parsed: ParsedCommand;
  validationResult: ValidationResult;
  sandboxType: string;
  exitCode: number;
  duration: number;
  writtenFiles: string[];
}

/** SafeBash MCP server options */
export interface SafeBashServerOptions {
  projectRoot: string;
  writablePaths?: string[];
  readOnlyPaths?: string[];
  auditLogPath?: string;
}