/**
 * Audit logger for SafeBash.
 *
 * Appends JSONL entries to .claude/safe-bash-audit.jsonl.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { AuditEntry } from './types.js';

export class AuditLog {
  private logPath: string;

  constructor(projectRoot: string, logPath?: string) {
    this.logPath = logPath || path.join(projectRoot, '.claude', 'safe-bash-audit.jsonl');
    this.ensureDir();
  }

  /**
   * Append an audit entry to the log.
   */
  append(entry: AuditEntry): void {
    try {
      const line = JSON.stringify(entry) + '\n';
      fs.appendFileSync(this.logPath, line, 'utf8');
    } catch {
      // Audit logging is best-effort — don't block execution on failure
    }
  }

  /**
   * Read recent entries from the log.
   */
  readRecent(count: number = 50): AuditEntry[] {
    try {
      const content = fs.readFileSync(this.logPath, 'utf8');
      const lines = content.trim().split('\n').filter(Boolean);
      return lines.slice(-count).map(line => {
        try {
          return JSON.parse(line) as AuditEntry;
        } catch {
          return null;
        }
      }).filter((e): e is AuditEntry => e !== null);
    } catch {
      return [];
    }
  }

  private ensureDir(): void {
    try {
      const dir = path.dirname(this.logPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    } catch {
      // Best effort
    }
  }
}