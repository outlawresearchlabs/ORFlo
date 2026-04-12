/**
 * Safe permissions configuration for claude-flow.
 * Replaces --dangerously-skip-permissions with granular tool allowlists.
 */

// Core Claude Code tools available in all modes
const CORE_TOOLS = 'Read,Write,Edit,Glob,Grep,Bash,WebSearch,WebFetch';

// MCP tools for swarm coordination
const SWARM_MCP_TOOLS = [
  'mcp__claude-flow__agent_spawn',
  'mcp__claude-flow__task_create',
  'mcp__claude-flow__task_orchestrate',
  'mcp__claude-flow__swarm_status',
  'mcp__claude-flow__swarm_monitor',
  'mcp__claude-flow__memory_store',
  'mcp__claude-flow__memory_query',
  'mcp__claude-flow__memory_search',
  'mcp__claude-flow__coordination_sync',
  'mcp__claude-flow__topology_optimize',
  'mcp__claude-flow__load_balance',
  'mcp__claude-flow__neural_status',
  'mcp__claude-flow__neural_predict',
  'mcp__claude-flow__health_check',
  'mcp__claude-flow__benchmark_run',
  'mcp__claude-flow__performance_report',
  'mcp__ruv-swarm__agent_spawn',
  'mcp__ruv-swarm__task_orchestrate',
  'mcp__ruv-swarm__swarm_status',
  'mcp__ruv-swarm__memory_usage',
  'mcp__ruv-swarm__neural_status',
  'mcp__ruv-swarm__topology_optimize',
  'mcp__ruv-swarm__health_check',
].join(',');

// Tools allowed for swarm/hive-mind execution
const SWARM_ALLOWED_TOOLS = CORE_TOOLS + ',' + SWARM_MCP_TOOLS;

// SPARC MCP tools (subset for focused development)
const SPARC_MCP_TOOLS = [
  'mcp__claude-flow__memory_store',
  'mcp__claude-flow__memory_query',
  'mcp__claude-flow__sparc_mode',
  'mcp__claude-flow__workflow_create',
  'mcp__claude-flow__health_check',
].join(',');

// Tools allowed for SPARC execution
const SPARC_ALLOWED_TOOLS = CORE_TOOLS + ',' + SPARC_MCP_TOOLS;

// GitHub MCP tools
const GITHUB_MCP_TOOLS = [
  'mcp__claude-flow__github_repo_analyze',
  'mcp__claude-flow__github_pr_manage',
  'mcp__claude-flow__github_issue_track',
  'mcp__claude-flow__github_release_coord',
  'mcp__claude-flow__github_workflow_auto',
  'mcp__claude-flow__github_code_review',
  'mcp__claude-flow__github_sync_coord',
  'mcp__claude-flow__github_metrics',
].join(',');

// Tools allowed for GitHub integration
const GITHUB_ALLOWED_TOOLS = CORE_TOOLS + ',' + GITHUB_MCP_TOOLS;

// Bash patterns allowed via settings.json permissions.allow
const SWARM_ALLOWED_BASH_PATTERNS = [
  // claude-flow and ruv-swarm commands
  'Bash(npx claude-flow *)',
  'Bash(npx ruv-swarm *)',
  'Bash(npx claude-flow@alpha *)',
  // Package management
  'Bash(npm *)',
  'Bash(npx *)',
  'Bash(node *)',
  'Bash(bun *)',
  // Git operations
  'Bash(git *)',
  'Bash(gh *)',
  // File operations
  'Bash(cat *)',
  'Bash(ls *)',
  'Bash(pwd)',
  'Bash(echo *)',
  'Bash(mkdir *)',
  'Bash(cp *)',
  'Bash(mv *)',
  'Bash(touch *)',
  'Bash(chmod +x *)',
  'Bash(chmod +r *)',
  'Bash(chmod +w *)',
  'Bash(chmod 755 *)',
  'Bash(chmod 644 *)',
  'Bash(diff *)',
  'Bash(find *)',
  'Bash(grep *)',
  'Bash(sed *)',
  'Bash(awk *)',
  'Bash(tar *)',
  'Bash(wc *)',
  'Bash(sort *)',
  'Bash(head *)',
  'Bash(tail *)',
  // Network — restricted to download-only (no pipe-to-shell)
  'Bash(curl -f *)',
  'Bash(curl -sSf *)',
  'Bash(curl -fsSL *)',
  'Bash(curl -o *)',
  'Bash(wget -q *)',
  // Docker (for containerized swarm)
  'Bash(docker *)',
  // Claude CLI (for nested spawns)
  'Bash(claude *)',
  // Testing
  'Bash(npm run lint)',
  'Bash(npm run test:*)',
  'Bash(npm test *)',
  // Which/type commands
  'Bash(which *)',
  'Bash(type *)',
  'Bash(whoami)',
];

// Bash patterns that are ALWAYS denied
const SWARM_DENIED_BASH_PATTERNS = [
  'Bash(rm -rf /)',
  'Bash(rm -rf *)',
  'Bash(sudo *)',
  'Bash(curl * | bash)',
  'Bash(curl * | sh)',
  'Bash(curl * | fish)',
  'Bash(wget * | sh)',
  'Bash(wget * | bash)',
  'Bash(bash -c *)',
  'Bash(sh -c *)',
  'Bash(eval *)',
  'Bash(chown *)',
  'Bash(chmod 777 *)',
  'Bash(chmod 666 *)',
  'Bash(chmod a+rw *)',
  'Bash(chmod a+rwx *)',
];

module.exports = {
  CORE_TOOLS,
  SWARM_ALLOWED_TOOLS,
  SPARC_ALLOWED_TOOLS,
  GITHUB_ALLOWED_TOOLS,
  SWARM_ALLOWED_BASH_PATTERNS,
  SWARM_DENIED_BASH_PATTERNS,
};
