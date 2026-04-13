import { checkInjection } from '../injection-detector.js';
import { parseShellCommand } from '../shell-parser.js';

function check(cmd: string) {
  return checkInjection(parseShellCommand(cmd));
}

describe('injection-detector', () => {
  test('allows npm install', () => {
    const result = check('npm install');
    expect(result.safe).toBe(true);
  });

  test('blocks node --require', () => {
    const result = check('node --require /tmp/x app.js');
    expect(result.safe).toBe(false);
    expect(result.blockedFlags).toContain('--require');
  });

  test('blocks node -e', () => {
    const result = check('node -e "process.exit(1)"');
    expect(result.safe).toBe(false);
    expect(result.blockedFlags).toContain('-e');
  });

  test('blocks python -c', () => {
    const result = check('python -c "import os"');
    expect(result.safe).toBe(false);
    expect(result.blockedFlags).toContain('-c');
  });

  test('blocks perl -e', () => {
    const result = check('perl -e "print 1"');
    expect(result.safe).toBe(false);
  });

  test('blocks bash -c', () => {
    const result = check('bash -c "rm -rf /"');
    expect(result.safe).toBe(false);
  });

  test('blocks direct bash invocation', () => {
    const result = check('bash script.sh');
    expect(result.safe).toBe(false);
  });

  test('allows node script.js (no flags)', () => {
    const result = check('node app.js');
    expect(result.safe).toBe(true);
  });

  test('allows git commit', () => {
    const result = check('git commit -m "fix"');
    expect(result.safe).toBe(true);
  });

  test('blocks node --eval', () => {
    const result = check('node --eval "console.log(1)"');
    expect(result.safe).toBe(false);
  });

  test('blocks node -p (print)', () => {
    const result = check('node -p "1+1"');
    expect(result.safe).toBe(false);
  });

  test('allows curl (no injection rules)', () => {
    const result = check('curl -fsSL https://example.com');
    expect(result.safe).toBe(true);
  });
});