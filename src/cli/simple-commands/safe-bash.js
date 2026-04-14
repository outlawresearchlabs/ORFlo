// safe-bash.js - SafeBash MCP server command
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function safeBashCommand(subArgs, flags) {
  const subCommand = subArgs[0] || 'start';

  switch (subCommand) {
    case 'start': {
      console.log('Starting SafeBash MCP server...');
      const serverPath = path.join(__dirname, '..', '..', 'safe-bash', 'index.ts');

      const child = spawn('node', ['--import', 'tsx', serverPath], {
        stdio: 'inherit',
        cwd: process.cwd(),
        env: {
          ...process.env,
          OUTLAW_FLOW_PROJECT_ROOT: process.cwd(),
        },
      });

      child.on('error', (err) => {
        console.error('SafeBash server error:', err.message);
        process.exit(1);
      });

      child.on('exit', (code) => {
        process.exit(code || 0);
      });

      process.on('SIGINT', () => {
        child.kill('SIGINT');
      });

      process.on('SIGTERM', () => {
        child.kill('SIGTERM');
      });

      break;
    }

    case 'check': {
      // Run a quick validation check
      const testCommand = subArgs.slice(1).join(' ');
      if (!testCommand) {
        console.log('Usage: outlaw-flow safe-bash check "<command>"');
        console.log('Tests whether a command would be allowed by SafeBash.');
        return;
      }

      try {
        // Register tsx for .ts imports when running under plain node
        if (!process[Symbol.for('tsx:registered')]) {
          await import('tsx/esm');
        }
        const { parseShellCommand } = await import('../../safe-bash/shell-parser.ts');
        const { checkInjection } = await import('../../safe-bash/injection-detector.ts');
        const { checkBinary } = await import('../../safe-bash/binary-allowlist.ts');
        const { resolveAndCheckPaths } = await import('../../safe-bash/path-resolver.ts');
        const { detectSandboxCapabilitiesSync } = await import('../../safe-bash/os-sandbox.ts');

        const parsed = parseShellCommand(testCommand);
        const injection = checkInjection(parsed);
        const binary = checkBinary(parsed);
        const paths = resolveAndCheckPaths(parsed, process.cwd());
        const sandbox = detectSandboxCapabilitiesSync();

        console.log('\n=== SafeBash Check ===');
        console.log(`Command: ${testCommand}`);
        console.log(`Binary: ${parsed.binaryName} (${binary.allowed ? 'ALLOWED' : 'BLOCKED: ' + binary.reason})`);
        console.log(`Injection: ${injection.safe ? 'SAFE' : 'BLOCKED: ' + injection.reason}`);
        console.log(`Paths: ${paths.safe ? 'SAFE' : 'VIOLATIONS: ' + paths.violations.map(v => v.reason).join('; ')}`);
        console.log(`Redirects: ${parsed.redirects.length > 0 ? parsed.redirects.map(r => `${r.type} ${r.target}`).join(', ') : 'none'}`);
        console.log(`Subshells: ${parsed.subshells.length > 0 ? 'BLOCKED: ' + parsed.subshells.join(', ') : 'none'}`);
        console.log(`Sandbox: ${sandbox.available ? sandbox.type : 'none (SafeBash-only)'}`);
        console.log();
      } catch (err) {
        console.error('Check failed:', err.message);
      }
      break;
    }

    default:
      console.log('Usage: outlaw-flow safe-bash <start|check>');
      console.log('  start       Start SafeBash MCP server');
      console.log('  check "<cmd>"  Test if a command would be allowed');
      break;
  }
}