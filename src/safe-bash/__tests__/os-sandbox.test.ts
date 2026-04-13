import { detectSandboxCapabilitiesSync, wrapInSandbox } from '../os-sandbox.js';

describe('os-sandbox', () => {
  test('detectSandboxCapabilitiesSync returns valid result', () => {
    const caps = detectSandboxCapabilitiesSync();
    expect(caps).toHaveProperty('available');
    expect(caps).toHaveProperty('type');
    expect(['bubblewrap', 'sandbox-exec', 'none']).toContain(caps.type);
  });

  test('wrapInSandbox returns none when no sandbox available', () => {
    const caps = {
      available: false,
      type: 'none' as const,
      bwrapPath: null,
      sandboxExecPath: null,
    };
    const result = wrapInSandbox('echo hello', {
      projectRoot: '/project',
      allowNetwork: false,
      writablePaths: [],
      readOnlyPaths: [],
    }, caps);
    expect(result.type).toBe('none');
    expect(result.wrappedCommand).toBe('echo hello');
  });

  test('wrapInSandbox with bubblewrap produces bwrap command', () => {
    const caps = {
      available: true,
      type: 'bubblewrap' as const,
      bwrapPath: '/usr/bin/bwrap',
      sandboxExecPath: null,
    };
    const result = wrapInSandbox('npm test', {
      projectRoot: '/project',
      allowNetwork: false,
      writablePaths: [],
      readOnlyPaths: [],
    }, caps);
    expect(result.type).toBe('bubblewrap');
    expect(result.wrappedCommand).toContain('bwrap');
    expect(result.wrappedCommand).toContain('--unshare-net');
  });

  test('wrapInSandbox with network allows removes --unshare-net', () => {
    const caps = {
      available: true,
      type: 'bubblewrap' as const,
      bwrapPath: '/usr/bin/bwrap',
      sandboxExecPath: null,
    };
    const result = wrapInSandbox('npm install', {
      projectRoot: '/project',
      allowNetwork: true,
      writablePaths: [],
      readOnlyPaths: [],
    }, caps);
    expect(result.type).toBe('bubblewrap');
    expect(result.wrappedCommand).not.toContain('--unshare-net');
  });
});