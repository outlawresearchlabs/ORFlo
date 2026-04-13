// executable-wrapper.js - Create local executable wrapper

import { writeFile, chmod } from 'fs/promises';
import { platform } from 'os';

export async function createLocalExecutable(workingDir) {
  try {
    if (platform() === 'win32') {
      // Create Windows batch file
      const wrapperScript = `@echo off
REM Outlaw-Flow local wrapper
REM This script ensures outlaw-flow runs from your project directory

set PROJECT_DIR=%CD%
set PWD=%PROJECT_DIR%
set CLAUDE_WORKING_DIR=%PROJECT_DIR%

REM Try to find outlaw-flow binary
REM Check common locations for npm/npx installations

REM 1. Local node_modules (npm install outlaw-flow)
if exist "%PROJECT_DIR%\\node_modules\\.bin\\outlaw-flow.cmd" (
  cd /d "%PROJECT_DIR%"
  "%PROJECT_DIR%\\node_modules\\.bin\\outlaw-flow.cmd" %*
  exit /b %ERRORLEVEL%
)

REM 2. Parent directory node_modules (monorepo setup)
if exist "%PROJECT_DIR%\\..\\node_modules\\.bin\\outlaw-flow.cmd" (
  cd /d "%PROJECT_DIR%"
  "%PROJECT_DIR%\\..\\node_modules\\.bin\\outlaw-flow.cmd" %*
  exit /b %ERRORLEVEL%
)

REM 3. Global installation (npm install -g outlaw-flow)
where outlaw-flow >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  cd /d "%PROJECT_DIR%"
  outlaw-flow %*
  exit /b %ERRORLEVEL%
)

REM 4. Fallback to npx (will download if needed)
cd /d "%PROJECT_DIR%"
npx outlaw-flow@alpha %*
`;

      // Write the Windows batch file
      await writeFile(`${workingDir}/outlaw-flow.cmd`, wrapperScript, 'utf8');
      console.log('  ✓ Created local outlaw-flow.cmd executable wrapper');
      console.log('    You can now use: outlaw-flow instead of npx outlaw-flow');
      
    } else {
      // Check if we're in development mode (outlaw-flow repo)
      const isDevelopment = workingDir.includes('outlaw-flow');
      const devBinPath = isDevelopment ? 
        workingDir.split('outlaw-flow')[0] + 'outlaw-flow/bin/outlaw-flow' : '';
      
      // Create Unix/Linux/Mac shell script
      const wrapperScript = `#!/usr/bin/env bash
# Outlaw-Flow local wrapper
# This script ensures outlaw-flow runs from your project directory

# Save the current directory
PROJECT_DIR="\${PWD}"

# Set environment to ensure correct working directory
export PWD="\${PROJECT_DIR}"
export CLAUDE_WORKING_DIR="\${PROJECT_DIR}"

# Try to find outlaw-flow binary
# Check common locations for npm/npx installations

${isDevelopment ? `# Development mode - use local bin
if [ -f "${devBinPath}" ]; then
  cd "\${PROJECT_DIR}"
  exec "${devBinPath}" "$@"
fi

` : ''}# 1. Local node_modules (npm install outlaw-flow)
if [ -f "\${PROJECT_DIR}/node_modules/.bin/outlaw-flow" ]; then
  cd "\${PROJECT_DIR}"
  exec "\${PROJECT_DIR}/node_modules/.bin/outlaw-flow" "$@"

# 2. Parent directory node_modules (monorepo setup)
elif [ -f "\${PROJECT_DIR}/../node_modules/.bin/outlaw-flow" ]; then
  cd "\${PROJECT_DIR}"
  exec "\${PROJECT_DIR}/../node_modules/.bin/outlaw-flow" "$@"

# 3. Global installation (npm install -g outlaw-flow)
elif command -v outlaw-flow &> /dev/null; then
  cd "\${PROJECT_DIR}"
  exec outlaw-flow "$@"

# 4. Fallback to npx (will download if needed)
else
  cd "\${PROJECT_DIR}"
  exec npx outlaw-flow@alpha "$@"
fi
`;

      // Write the wrapper script
      await writeFile(`${workingDir}/outlaw-flow`, wrapperScript, 'utf8');
      
      // Make it executable
      await chmod(`${workingDir}/outlaw-flow`, 0o755);
      
      console.log('  ✓ Created local outlaw-flow executable wrapper');
      console.log('    You can now use: ./outlaw-flow instead of npx outlaw-flow');
    }
    
  } catch (err) {
    console.log(`  ⚠️  Could not create local executable: ${err.message}`);
  }
}