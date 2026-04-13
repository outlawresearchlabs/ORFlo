/**
 * Taint tracker for SafeBash.
 *
 * Cross-invocation file tracking. Prevents composability attacks:
 * Write tool creates exploit.js, then safe_bash("node exploit.js") executes it.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { ParsedCommand, TaintCheckResult } from './types.js';

/** Interpreters that execute their first non-flag argument */
const INTERPRETERS = new Set(['node', 'bun', 'deno', 'python', 'python3', 'perl', 'ruby']);

/** Directories to skip when walking */
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', '.next', '__pycache__']);

export class TaintTracker {
  private projectRoot: string;
  private sessionStartTime: number;
  /** Files that existed at session start (trusted) */
  private initialFiles: Map<string, number> = new Map(); // path -> mtimeMs
  /** Files written by the Write tool during this session (tainted) */
  private writeToolFiles: Map<string, { timestamp: number }> = new Map();
  /** Files written by safe_bash during this session (medium trust) */
  private safeBashFiles: Map<string, { timestamp: number }> = new Map();
  /** Timestamp of last command execution, for incremental scans */
  private lastExecTime: number;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    this.sessionStartTime = Date.now();
    this.lastExecTime = this.sessionStartTime;
  }

  /**
   * Snapshot project files at session start.
   * Call once when the SafeBash MCP server starts.
   */
  async snapshotProjectFiles(): Promise<void> {
    try {
      const files = walkDir(this.projectRoot);
      for (const file of files) {
        try {
          const stat = fs.statSync(file);
          if (stat.mtimeMs < this.sessionStartTime) {
            this.initialFiles.set(file, stat.mtimeMs);
          }
        } catch {
          // Skip files that can't be stat'd
        }
      }
    } catch {
      // Project dir might not exist yet
    }
  }

  /**
   * Record that a file was written by the Write tool.
   * Called when the MCP server detects a file write from another tool.
   */
  recordWriteToolFile(filePath: string): void {
    const resolved = path.resolve(this.projectRoot, filePath);
    this.writeToolFiles.set(resolved, { timestamp: Date.now() });
  }

  /**
   * Record that a file was written by safe_bash itself.
   * Called after command execution.
   */
  recordSafeBashFile(filePath: string): void {
    const resolved = path.resolve(this.projectRoot, filePath);
    this.safeBashFiles.set(resolved, { timestamp: Date.now() });
  }

  /**
   * Check if a command's execution targets are tainted.
   * Blocks interpreters from running files written by the Write tool.
   */
  checkExecution(parsed: ParsedCommand): TaintCheckResult {
    if (!INTERPRETERS.has(parsed.binaryName)) {
      return { safe: true, reason: 'OK (not an interpreter)', taintedFiles: [] };
    }

    const taintedFiles: string[] = [];

    // Find the execution target (first non-flag arg)
    for (const arg of parsed.args) {
      if (arg.startsWith('-')) continue;

      const resolved = path.resolve(this.projectRoot, arg);

      // Check if this file was written by the Write tool
      if (this.writeToolFiles.has(resolved)) {
        taintedFiles.push(arg);
      }
    }

    if (taintedFiles.length > 0) {
      return {
        safe: false,
        reason: `Tainted execution target: ${taintedFiles.join(', ')} was written by the Write tool this session. Interpreters cannot execute newly-written files.`,
        taintedFiles,
      };
    }

    return { safe: true, reason: 'OK', taintedFiles: [] };
  }

  /**
   * Scan for files modified since the last command execution.
   * Called after each safe_bash execution to update tracking.
   * Uses incremental mtime comparison instead of full walk.
   */
  postExecScan(): void {
    const now = Date.now();
    const since = this.lastExecTime;

    try {
      const files = walkDir(this.projectRoot);
      for (const file of files) {
        if (this.writeToolFiles.has(file) || this.safeBashFiles.has(file)) {
          continue; // Already tracked
        }
        try {
          const stat = fs.statSync(file);
          // Only pick up files modified since last exec, not the entire session
          if (stat.mtimeMs > since && stat.mtimeMs <= now) {
            this.safeBashFiles.set(file, { timestamp: Date.now() });
          }
        } catch {
          // Skip
        }
      }
    } catch {
      // Project dir might not exist
    }

    this.lastExecTime = now;
  }

  /**
   * Get all files written by the Write tool this session.
   */
  getWriteToolFiles(): string[] {
    return Array.from(this.writeToolFiles.keys());
  }
}

/**
 * Walk a directory tree and return all file paths.
 */
function walkDir(dir: string): string[] {
  const results: string[] = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && !SKIP_DIRS.has(entry.name)) {
        results.push(...walkDir(fullPath));
      } else if (entry.isFile()) {
        results.push(fullPath);
      }
    }
  } catch {
    // Skip directories we can't read
  }
  return results;
}