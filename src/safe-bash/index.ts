/**
 * SafeBash MCP Server entry point.
 *
 * Starts the SafeBash MCP server that provides a `safe_bash` tool
 * with semantic command analysis and OS sandbox support.
 */

import { SafeBashMCPServer } from './safe-bash-server.js';

const projectRoot = process.env.OUTLAW_FLOW_PROJECT_ROOT || process.cwd();
const auditLogPath = process.env.OUTLAW_FLOW_SAFE_BASH_AUDIT_LOG;

const server = new SafeBashMCPServer({
  projectRoot,
  auditLogPath,
});

server.run().catch((error) => {
  console.error('SafeBash MCP server failed to start:', error);
  process.exit(1);
});