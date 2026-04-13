import { TaintTracker } from '../taint-tracker.js';
import { parseShellCommand } from '../shell-parser.js';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

// Use a temp directory for tests
const tmpDir = path.join(os.tmpdir(), `safe-bash-taint-test-${Date.now()}`);

beforeAll(() => {
  fs.mkdirSync(tmpDir, { recursive: true });
});

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('taint-tracker', () => {
  test('allows interpreters to run existing files', async () => {
    // Create a file before tracker init so it's in the initial snapshot
    const existingFile = path.join(tmpDir, 'existing.js');
    fs.writeFileSync(existingFile, 'console.log("ok")');

    const tracker = new TaintTracker(tmpDir);
    await tracker.snapshotProjectFiles();

    const result = tracker.checkExecution(parseShellCommand(`node ${existingFile}`));
    expect(result.safe).toBe(true);
  });

  test('blocks interpreters running Write-tool files', async () => {
    const tracker = new TaintTracker(tmpDir);
    await tracker.snapshotProjectFiles();

    // Record a file as written by the Write tool
    const taintedFile = path.join(tmpDir, 'tainted.js');
    tracker.recordWriteToolFile(taintedFile);

    const result = tracker.checkExecution(parseShellCommand(`node ${taintedFile}`));
    expect(result.safe).toBe(false);
    expect(result.taintedFiles).toContain(taintedFile);
  });

  test('allows non-interpreters to run any file', async () => {
    const tracker = new TaintTracker(tmpDir);
    await tracker.snapshotProjectFiles();

    const taintedFile = path.join(tmpDir, 'script.sh');
    tracker.recordWriteToolFile(taintedFile);

    // npm is not an interpreter — allowed
    const result = tracker.checkExecution(parseShellCommand(`npm test`));
    expect(result.safe).toBe(true);
  });

  test('allows safe-bash-written files', async () => {
    const tracker = new TaintTracker(tmpDir);
    await tracker.snapshotProjectFiles();

    const sbFile = path.join(tmpDir, 'from-safe-bash.js');
    tracker.recordSafeBashFile(sbFile);

    // Files written by safe_bash itself are not tainted for interpreter execution
    // (they're medium-trust — binary allowlist still applies)
    const result = tracker.checkExecution(parseShellCommand(`node ${sbFile}`));
    expect(result.safe).toBe(true);
  });
});