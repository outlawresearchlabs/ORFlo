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

export class TaintTracker {
  private projectRoot: string;
  private sessionStartTime: number;
  /** Files that existed at session start (trusted) */
  private initialFiles: Set<string> = new Set();
  /** Files written by the Write tool during this session (tainted) */
  private writeToolFiles: Map<string, { timestamp: number }> = new Map();
  /** Files written by safe_bash during this session (medium trust) */
  private safeBashFiles: Map<string, { timestamp: number }> = new Map();

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    this.sessionStartTime = Date.now();
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
            this.initialFiles.add(file);
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

      // Check if the file was modified after session start but not in initial snapshot
      // and not written by safe_bash
      if (!this.initialFiles.has(resolved) && !this.safeBashFiles.has(resolved)) {
        try {
          const stat = fs.statSync(resolved);
          if (stat.mtimeMs > this.sessionStartTime) {
            // File modified after session start and not tracked — potentially tainted
            // Only flag if it's in the writeToolFiles map
            // (safe_bash files are tracked separately)
          }
        } catch {
          // File doesn't exist — can't be executed
        }
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
   * Scan for files modified after the last command execution.
   * Called after each safe_bash execution to update tracking.
   */
  postExecScan(): void {
    // Check for new files in project dir created by this command
    try {
      const files = walkDir(this.projectRoot);
      for (const file of files) {
        if (!this.initialFiles.has(file) && !this.writeToolFiles.has(file) && !this.safeBashFiles.has(file)) {
          try {
            const stat = fs.statSync(file);
            if (stat.mtimeMs > this.sessionStartTime && stat.mtimeMs > Date.now() - 5000) {
              // Recently created file — likely from this safe_bash execution
              this.safeBashFiles.set(file, { timestamp: Date.now() });
            }
          } catch {
            // Skip
          }
        }
      }
    } catch {
      // Project dir might not exist
    }
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
      // Skip node_modules, .git, and other large directories
      if (entry.isDirectory() && !shouldSkipDir(entry.name)) {
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

/**
 * Directories to skip when walking the project tree.
 */
function shouldSkipDir(name: string): boolean {
  return name === 'node_modules' || name === '.git' || name === 'dist' || name === '.next' || name === '__pycache__';
}