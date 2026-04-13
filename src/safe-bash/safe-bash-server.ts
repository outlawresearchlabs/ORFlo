/**
 * SafeBash MCP Server.
 *
 * SDK-based MCP server that provides a `safe_bash` tool.
 * Commands are parsed, validated, and optionally sandboxed before execution.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { exec } from 'child_process';
import * as path from 'path';
import { parseShellCommand } from './shell-parser.js';
import { checkInjection } from './injection-detector.js';
import { checkBinary } from './binary-allowlist.js';
import { resolveAndCheckPaths } from './path-resolver.js';
import { TaintTracker } from './taint-tracker.js';
import { detectSandboxCapabilitiesSync, wrapInSandbox } from './os-sandbox.js';
import { AuditLog } from './audit-log.js';
import type {
  SafeBashServerOptions,
  ParsedCommand,
  ValidationResult,
  SandboxCapabilities,
} from './types.js';

const NETWORK_BINARIES = ['curl', 'wget', 'ssh', 'scp', 'rsync', 'nc', 'ncat'];

export class SafeBashMCPServer {
  private server: Server;
  private projectRoot: string;
  private taintTracker: TaintTracker;
  private sandboxCapabilities: SandboxCapabilities;
  private auditLog: AuditLog;
  private writablePaths: string[];
  private readOnlyPaths: string[];
  private invocationCounter: number = 0;

  constructor(options: SafeBashServerOptions) {
    this.projectRoot = options.projectRoot;
    this.writablePaths = options.writablePaths || [];
    this.readOnlyPaths = options.readOnlyPaths || [];
    this.taintTracker = new TaintTracker(this.projectRoot);
    this.sandboxCapabilities = detectSandboxCapabilitiesSync();
    this.auditLog = new AuditLog(this.projectRoot, options.auditLogPath);

    this.server = new Server(
      {
        name: 'safe-bash',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'safe_bash',
          description:
            'Execute a shell command with semantic security checks. Commands are parsed, validated, and optionally sandboxed before execution. Use this instead of the Bash tool.',
          inputSchema: {
            type: 'object',
            properties: {
              command: {
                type: 'string',
                description: 'The shell command to execute',
              },
              timeout: {
                type: 'number',
                description: 'Maximum execution time in milliseconds (default: 120000)',
                default: 120000,
              },
              cwd: {
                type: 'string',
                description: 'Working directory for command execution (default: project root)',
              },
              allowNetwork: {
                type: 'boolean',
                description: 'Allow network access for this command (default: false)',
                default: false,
              },
            },
            required: ['command'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(
      CallToolRequestSchema,
      async (request) => {
        if (request.params.name === 'safe_bash') {
          const args = request.params.arguments || {};
          return this.handleSafeBash({
            command: String(args.command || ''),
            timeout: typeof args.timeout === 'number' ? args.timeout : 120000,
            cwd: typeof args.cwd === 'string' ? args.cwd : undefined,
            allowNetwork: typeof args.allowNetwork === 'boolean' ? args.allowNetwork : false,
          });
        }
        throw new Error(`Unknown tool: ${request.params.name}`);
      },
    );
  }

  private async handleSafeBash(args: {
    command: string;
    timeout: number;
    cwd?: string;
    allowNetwork: boolean;
  }): Promise<{ content: Array<{ type: string; text: string }>; isError?: boolean }> {
    const { command, timeout, cwd, allowNetwork } = args;
    const workingDir = cwd || this.projectRoot;
    const invocationId = `sb-${++this.invocationCounter}-${Date.now()}`;
    const startTime = Date.now();

    // 1. Parse the command
    const parsed = parseShellCommand(command);

    // 2. Check for pipes — each segment is validated individually
    if (parsed.pipeTargets.length > 0) {
      for (let i = 1; i < parsed.pipeSegments.length; i++) {
        const segmentParsed = parseShellCommand(parsed.pipeSegments[i]);
        const segmentResult = await this.validateCommand(segmentParsed, workingDir, allowNetwork);
        if (!segmentResult.safe) {
          this.logAudit(invocationId, command, parsed, segmentResult, startTime, -1, []);
          return {
            content: [{ type: 'text', text: `BLOCKED (pipe segment): ${segmentResult.reason}` }],
            isError: true,
          };
        }
      }
    }

    // 3. Validate the primary command
    const validationResult = await this.validateCommand(parsed, workingDir, allowNetwork);
    if (!validationResult.safe) {
      this.logAudit(invocationId, command, parsed, validationResult, startTime, -1, []);
      return {
        content: [{ type: 'text', text: `BLOCKED: ${validationResult.reason}` }],
        isError: true,
      };
    }

    // 4. Apply OS sandbox wrapping (if available)
    const sandboxResult = wrapInSandbox(command, {
      projectRoot: this.projectRoot,
      allowNetwork,
      writablePaths: this.writablePaths,
      readOnlyPaths: this.readOnlyPaths,
    }, this.sandboxCapabilities);

    // 5. Execute
    try {
      const { stdout, stderr, exitCode } = await executeCommand(
        sandboxResult.wrappedCommand,
        { cwd: workingDir, timeout, env: { ...process.env, ...sandboxResult.env } },
      );

      // 6. Update taint tracker
      this.taintTracker.postExecScan();

      // 7. Audit log
      this.logAudit(invocationId, command, parsed, validationResult, startTime, exitCode, []);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            stdout,
            stderr,
            exitCode,
            sandboxed: sandboxResult.type !== 'none',
            sandboxType: sandboxResult.type,
          }, null, 2),
        }],
      };
    } catch (error: any) {
      const exitCode = error.code === 'ETIMEDOUT' ? -1 : (error.exitCode || -1);
      this.logAudit(invocationId, command, parsed, validationResult, startTime, exitCode, []);

      return {
        content: [{ type: 'text', text: `Execution error: ${error.message}` }],
        isError: true,
      };
    }
  }

  /**
   * Run all validation checks on a parsed command.
   */
  private async validateCommand(
    parsed: ParsedCommand,
    workingDir: string,
    allowNetwork: boolean,
  ): Promise<ValidationResult> {
    // 1. Subshell check — block $() and backticks
    if (parsed.subshells.length > 0) {
      return {
        safe: false,
        reason: `Subshells are not allowed: ${parsed.subshells.join(', ')}`,
        failedCheck: 'subshell',
      };
    }

    // 2. Injection flag detection
    const injectionResult = checkInjection(parsed);
    if (!injectionResult.safe) {
      return {
        safe: false,
        reason: injectionResult.reason,
        failedCheck: 'injection',
      };
    }

    // 3. Binary allowlist check
    const binaryResult = checkBinary(parsed);
    if (!binaryResult.allowed) {
      return {
        safe: false,
        reason: binaryResult.reason,
        failedCheck: 'binary',
      };
    }

    // 4. Path resolution and bounds checking
    const pathResult = resolveAndCheckPaths(parsed, this.projectRoot, this.writablePaths);
    if (!pathResult.safe) {
      return {
        safe: false,
        reason: pathResult.violations.map(v => v.reason).join('; '),
        failedCheck: 'path',
      };
    }

    // 5. Redirect guard — writes outside project blocked
    for (const redirect of parsed.redirects) {
      if ((redirect.type === 'write' || redirect.type === 'append' || redirect.type === 'stderr-write')) {
        if (redirect.targetResolved && !redirect.targetResolved.startsWith(this.projectRoot)) {
          return {
            safe: false,
            reason: `Redirect target outside project: ${redirect.target} -> ${redirect.targetResolved}`,
            failedCheck: 'redirect',
          };
        }
        // Also check unresolved targets
        if (!redirect.targetResolved && looksLikeAbsolutePath(redirect.target)) {
          const resolved = path.resolve(workingDir, redirect.target);
          if (!resolved.startsWith(this.projectRoot)) {
            return {
              safe: false,
              reason: `Redirect target outside project: ${redirect.target}`,
              failedCheck: 'redirect',
            };
          }
        }
      }
    }

    // 6. Taint tracking check
    const taintResult = this.taintTracker.checkExecution(parsed);
    if (!taintResult.safe) {
      return {
        safe: false,
        reason: taintResult.reason,
        failedCheck: 'taint',
      };
    }

    // 7. Network check
    if (!allowNetwork && NETWORK_BINARIES.includes(parsed.binaryName.toLowerCase())) {
      return {
        safe: false,
        reason: `Network access not allowed for: ${parsed.binaryName}. Set allowNetwork: true if needed.`,
        failedCheck: 'network',
      };
    }

    return { safe: true, reason: 'OK' };
  }

  private logAudit(
    invocationId: string,
    command: string,
    parsed: ParsedCommand,
    validationResult: ValidationResult,
    startTime: number,
    exitCode: number,
    writtenFiles: string[],
  ): void {
    this.auditLog.append({
      timestamp: new Date().toISOString(),
      invocationId,
      command,
      parsed,
      validationResult,
      sandboxType: this.sandboxCapabilities.type,
      exitCode,
      duration: Date.now() - startTime,
      writtenFiles,
    });
  }

  /**
   * Start the MCP server.
   */
  async run(): Promise<void> {
    // Initialize taint tracker
    await this.taintTracker.snapshotProjectFiles();

    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

/**
 * Execute a command and return stdout, stderr, exitCode.
 */
function executeCommand(
  command: string,
  options: { cwd: string; timeout: number; env: Record<string, string | undefined> },
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolve) => {
    exec(command, {
      cwd: options.cwd,
      timeout: options.timeout,
      env: options.env as Record<string, string>,
      maxBuffer: 10 * 1024 * 1024, // 10MB
    }, (error, stdout, stderr) => {
      resolve({
        stdout: stdout || '',
        stderr: stderr || '',
        exitCode: error ? (error.exitCode ?? -1) : 0,
      });
    });
  });
}

function looksLikeAbsolutePath(p: string): boolean {
  return p.startsWith('/') || p.startsWith('~');
}