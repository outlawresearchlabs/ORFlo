import { parseShellCommand } from '../shell-parser.js';

describe('shell-parser', () => {
  test('parses simple command', () => {
    const result = parseShellCommand('npm install');
    expect(result.binaryName).toBe('npm');
    expect(result.args).toEqual(['install']);
    expect(result.raw).toBe('npm install');
  });

  test('parses command with flags', () => {
    const result = parseShellCommand('git commit -m "fix: bug"');
    expect(result.binaryName).toBe('git');
    expect(result.args).toEqual(['commit', '-m', 'fix: bug']);
  });

  test('parses command with redirects', () => {
    const result = parseShellCommand('echo hello > output.txt');
    expect(result.binaryName).toBe('echo');
    expect(result.redirects).toHaveLength(1);
    expect(result.redirects[0].type).toBe('write');
    expect(result.redirects[0].target).toBe('output.txt');
  });

  test('parses append redirect', () => {
    const result = parseShellCommand('echo hello >> log.txt');
    expect(result.redirects).toHaveLength(1);
    expect(result.redirects[0].type).toBe('append');
    expect(result.redirects[0].target).toBe('log.txt');
  });

  test('parses stderr redirect', () => {
    const result = parseShellCommand('node app.js 2> errors.log');
    expect(result.redirects).toHaveLength(1);
    expect(result.redirects[0].type).toBe('stderr-write');
    expect(result.redirects[0].target).toBe('errors.log');
  });

  test('parses pipe', () => {
    const result = parseShellCommand('cat file.txt | grep pattern');
    expect(result.pipeTargets).toEqual(['grep']);
    expect(result.pipeSegments).toHaveLength(2);
  });

  test('detects $() subshells', () => {
    const result = parseShellCommand('echo $(whoami)');
    expect(result.subshells.length).toBeGreaterThan(0);
    expect(result.subshells[0]).toContain('whoami');
  });

  test('detects backtick subshells', () => {
    const result = parseShellCommand('echo `whoami`');
    expect(result.subshells.length).toBeGreaterThan(0);
  });

  test('does not detect subshells inside single quotes', () => {
    const result = parseShellCommand("echo '$(whoami)'");
    expect(result.subshells).toHaveLength(0);
  });

  test('parses env assignments', () => {
    const result = parseShellCommand('NODE_ENV=production node app.js');
    expect(result.envAssignments).toEqual({ NODE_ENV: 'production' });
    expect(result.binaryName).toBe('node');
  });

  test('handles empty command', () => {
    const result = parseShellCommand('');
    expect(result.binaryName).toBe('');
    expect(result.args).toEqual([]);
  });

  test('parses redirect with quoted target', () => {
    const result = parseShellCommand('echo hello > "my output.txt"');
    expect(result.redirects).toHaveLength(1);
    expect(result.redirects[0].type).toBe('write');
    expect(result.redirects[0].target).toBe('my output.txt');
  });

  test('parses redirect with single-quoted target', () => {
    const result = parseShellCommand("echo hello > 'my output.txt'");
    expect(result.redirects).toHaveLength(1);
    expect(result.redirects[0].type).toBe('write');
    expect(result.redirects[0].target).toBe('my output.txt');
  });
});