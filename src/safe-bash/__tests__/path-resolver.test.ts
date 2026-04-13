import { resolveAndCheckPaths } from '../path-resolver.js';
import { parseShellCommand } from '../shell-parser.js';

function check(cmd: string, projectRoot: string = '/project') {
  return resolveAndCheckPaths(parseShellCommand(cmd), projectRoot);
}

describe('path-resolver', () => {
  test('allows project-relative paths', () => {
    const result = check('node ./app.js', '/project');
    expect(result.safe).toBe(true);
  });

  test('blocks redirect to /tmp', () => {
    const result = check('echo hello > /tmp/out.txt', '/project');
    expect(result.safe).toBe(false);
    expect(result.violations.some(v => v.type === 'redirect-outside-project')).toBe(true);
  });

  test('allows redirect to project dir', () => {
    const result = check('echo hello > ./out.txt', '/project');
    expect(result.safe).toBe(true);
  });

  test('blocks path in /tmp', () => {
    const result = check('node /tmp/x.js', '/project');
    expect(result.safe).toBe(false);
    expect(result.violations.some(v => v.type === 'tmp-directory')).toBe(true);
  });

  test('blocks path in /var/tmp', () => {
    const result = check('node /var/tmp/x.js', '/project');
    expect(result.safe).toBe(false);
  });

  test('blocks path in /dev/shm', () => {
    const result = check('node /dev/shm/x.js', '/project');
    expect(result.safe).toBe(false);
  });

  test('allows URLs (not treated as paths)', () => {
    const result = check('curl -fsSL https://example.com/api', '/project');
    expect(result.safe).toBe(true);
  });

  test('allows flag arguments (starting with -)', () => {
    const result = check('git commit -m "message"', '/project');
    expect(result.safe).toBe(true);
  });

  test('skips non-path arguments', () => {
    const result = check('npm install lodash', '/project');
    expect(result.safe).toBe(true);
  });
});