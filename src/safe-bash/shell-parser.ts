/**
 * Shell command parser for SafeBash.
 *
 * Uses shell-quote for token parsing, extended with redirect extraction,
 * pipe splitting, and subshell detection.
 */

import * as qs from 'shell-quote';
import type { ParsedCommand, Redirect } from './types.js';

/**
 * Parse a shell command string into structured data.
 */
export function parseShellCommand(command: string): ParsedCommand {
  const raw = command.trim();

  // Detect subshells before any parsing
  const subshells = detectSubshells(raw);

  // Split on pipes (respecting quotes)
  const pipeSegments = splitOnPipes(raw);
  const pipeTargets: string[] = [];

  // Parse the primary command (first pipe segment)
  const primary = pipeSegments[0] || raw;

  // Extract redirects before token parsing
  const { cleaned, redirects } = extractRedirects(primary);

  // Parse tokens using shell-quote
  const tokens = parseTokens(cleaned);

  // Separate env assignments from binary + args
  const { envAssignments, binary, binaryName, args } = separateEnvFromCommand(tokens);

  // Extract pipe target binary names
  for (let i = 1; i < pipeSegments.length; i++) {
    const segCleaned = extractRedirects(pipeSegments[i]).cleaned;
    const segTokens = parseTokens(segCleaned);
    // First non-assignment token is the binary
    for (const t of segTokens) {
      if (typeof t === 'string' && !t.includes('=')) {
        pipeTargets.push(pathBasename(t));
        break;
      }
    }
  }

  return {
    binary: binary || '',
    binaryName: binaryName || '',
    args,
    redirects,
    pipeTargets,
    pipeSegments,
    envAssignments,
    subshells,
    raw,
  };
}

/**
 * Detect $() and backtick subshells.
 * Respects single and double quoting.
 */
function detectSubshells(cmd: string): string[] {
  const subshells: string[] = [];
  let inSingle = false;
  let i = 0;

  while (i < cmd.length) {
    const ch = cmd[i];

    if (ch === "'" && (i === 0 || cmd[i - 1] !== '\\')) {
      inSingle = !inSingle;
      i++;
      continue;
    }

    if (inSingle) {
      i++;
      continue;
    }

    // Detect $(...)
    if (ch === '$' && cmd[i + 1] === '(') {
      const start = i;
      let depth = 1;
      i += 2;
      while (i < cmd.length && depth > 0) {
        if (cmd[i] === '(' && cmd[i - 1] !== '\\') depth++;
        if (cmd[i] === ')' && cmd[i - 1] !== '\\') depth--;
        i++;
      }
      subshells.push(cmd.slice(start, i));
      continue;
    }

    // Detect backtick subshells
    if (ch === '`' && (i === 0 || cmd[i - 1] !== '\\')) {
      const start = i;
      i++;
      while (i < cmd.length && !(cmd[i] === '`' && cmd[i - 1] !== '\\')) {
        i++;
      }
      if (i < cmd.length) i++; // skip closing backtick
      subshells.push(cmd.slice(start, i));
      continue;
    }

    i++;
  }

  return subshells;
}

/**
 * Split a command on unquoted pipe operators.
 */
function splitOnPipes(cmd: string): string[] {
  const segments: string[] = [];
  let current = '';
  let inSingle = false;
  let inDouble = false;
  let i = 0;

  while (i < cmd.length) {
    const ch = cmd[i];

    if (ch === "'" && !inDouble && (i === 0 || cmd[i - 1] !== '\\')) {
      inSingle = !inSingle;
      current += ch;
      i++;
      continue;
    }

    if (ch === '"' && !inSingle && (i === 0 || cmd[i - 1] !== '\\')) {
      inDouble = !inDouble;
      current += ch;
      i++;
      continue;
    }

    if (!inSingle && !inDouble && ch === '|' && cmd[i + 1] !== '|') {
      segments.push(current.trim());
      current = '';
      i++;
      continue;
    }

    current += ch;
    i++;
  }

  if (current.trim()) {
    segments.push(current.trim());
  }

  return segments;
}

/**
 * Extract shell redirects (>, >>, <, 2>) from a command string.
 * Returns the cleaned string (without redirects) and the list of redirects.
 */
function extractRedirects(cmd: string): {
  cleaned: string;
  redirects: Redirect[];
} {
  const redirects: Redirect[] = [];
  // Match redirect patterns: >, >>, <, 2> followed by a target
  // We need to respect quoting
  // Quoted targets must be matched first, otherwise [^\s;...] greedily grabs the opening quote
  const redirectPattern = /(?:^|\s)(2>|>>|>|<)\s*(?:"([^"]*)"|'([^']*)'|([^\s;|&><)]+))/g;
  let cleaned = cmd;
  let match;

  while ((match = redirectPattern.exec(cmd)) !== null) {
    const operator = match[1];
    // Groups: 2=double-quoted, 3=single-quoted, 4=unquoted
    const target = match[2] || match[3] || match[4] || '';

    let type: Redirect['type'];
    switch (operator) {
      case '>>':
        type = 'append';
        break;
      case '2>':
        type = 'stderr-write';
        break;
      case '>':
        type = 'write';
        break;
      case '<':
        type = 'read';
        break;
      default:
        continue;
    }

    redirects.push({ type, target });

    // Remove the redirect from the cleaned string
    cleaned = cleaned.replace(match[0], ' ');
  }

  return { cleaned: cleaned.replace(/\s+/g, ' ').trim(), redirects };
}

/**
 * Parse a command string into tokens using shell-quote.
 */
function parseTokens(cmd: string): (string | qs.ParsedEntry)[] {
  try {
    return qs.parse(cmd) as (string | qs.ParsedEntry)[];
  } catch {
    // Fallback: simple whitespace split
    return cmd.split(/\s+/).filter(Boolean);
  }
}

/**
 * Separate KEY=VALUE env assignments from the binary and arguments.
 */
function separateEnvFromCommand(tokens: (string | qs.ParsedEntry)[]): {
  envAssignments: Record<string, string>;
  binary: string | null;
  binaryName: string | null;
  args: string[];
} {
  const envAssignments: Record<string, string> = {};
  let binary: string | null = null;
  let binaryName: string | null = null;
  const args: string[] = [];

  for (const token of tokens) {
    if (typeof token !== 'string') {
      // shell-quote ops (pipes, etc.) — skip
      continue;
    }

    if (!binary && token.includes('=') && !token.startsWith('-')) {
      // Env assignment: KEY=VALUE
      const eqIdx = token.indexOf('=');
      const key = token.slice(0, eqIdx);
      const val = token.slice(eqIdx + 1);
      envAssignments[key] = val;
      continue;
    }

    if (!binary) {
      binary = token;
      binaryName = pathBasename(token);
      continue;
    }

    args.push(token);
  }

  return { envAssignments, binary, binaryName, args };
}

/**
 * Get the basename of a path (last segment after /).
 */
function pathBasename(p: string): string {
  const segments = p.split('/');
  return segments[segments.length - 1] || p;
}