import { checkBinary } from '../binary-allowlist.js';
import { parseShellCommand } from '../shell-parser.js';

function check(cmd: string) {
  return checkBinary(parseShellCommand(cmd));
}

describe('binary-allowlist', () => {
  test('allows npm', () => {
    expect(check('npm install').allowed).toBe(true);
  });

  test('allows node', () => {
    expect(check('node app.js').allowed).toBe(true);
  });

  test('allows git', () => {
    expect(check('git status').allowed).toBe(true);
  });

  test('allows curl', () => {
    expect(check('curl -fsSL https://example.com').allowed).toBe(true);
  });

  test('allows docker ps', () => {
    expect(check('docker ps').allowed).toBe(true);
  });

  test('blocks sudo', () => {
    expect(check('sudo rm -rf /').allowed).toBe(false);
  });

  test('blocks bash', () => {
    expect(check('bash script.sh').allowed).toBe(false);
  });

  test('blocks sh', () => {
    expect(check('sh -c echo').allowed).toBe(false);
  });

  test('blocks wget', () => {
    expect(check('wget https://example.com').allowed).toBe(false);
  });

  test('blocks chown', () => {
    expect(check('chown root:root /etc/passwd').allowed).toBe(false);
  });

  test('blocks socat', () => {
    expect(check('socat - tcp:host:port').allowed).toBe(false);
  });

  test('blocks unknown binary', () => {
    expect(check('randombinary --flag').allowed).toBe(false);
  });

  test('blocks docker run --privileged', () => {
    expect(check('docker run --privileged ubuntu').allowed).toBe(false);
  });

  test('allows docker run (restricted)', () => {
    expect(check('docker run ubuntu').allowed).toBe(true);
  });

  test('blocks docker run --network=host', () => {
    expect(check('docker run --network=host ubuntu').allowed).toBe(false);
  });

  test('allows claude', () => {
    expect(check('claude --help').allowed).toBe(true);
  });

  test('allows npx', () => {
    expect(check('npx jest').allowed).toBe(true);
  });
});