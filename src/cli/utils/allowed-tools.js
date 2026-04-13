/**
 * Safe permissions configuration for outlaw-flow.
 *
 * Bash tool is replaced by mcp__safe-bash__safe_bash which provides
 * semantic command analysis and OS sandbox support.
 * SWARM_ALLOWED_BASH_PATTERNS and SWARM_DENIED_BASH_PATTERNS are
 * DEPRECATED — kept for backward compat, superseded by SafeBash.
 */

// Core Claude Code tools available in all modes (no Bash — use safe_bash instead)
const CORE_TOOLS = 'Read,Write,Edit,Glob,Grep,WebSearch,WebFetch';

// SafeBash MCP tool — replaces Bash for command execution
const SAFE_BASH_MCP_TOOL = 'mcp__safe-bash__safe_bash';

// MCP tools for swarm coordination
const SWARM_MCP_TOOLS = [
  'mcp__outlaw-flow__agent_spawn',
  'mcp__outlaw-flow__task_create',
  'mcp__outlaw-flow__task_orchestrate',
  'mcp__outlaw-flow__swarm_status',
  'mcp__outlaw-flow__swarm_monitor',
  'mcp__outlaw-flow__memory_store',
  'mcp__outlaw-flow__memory_query',
  'mcp__outlaw-flow__memory_search',
  'mcp__outlaw-flow__coordination_sync',
  'mcp__outlaw-flow__topology_optimize',
  'mcp__outlaw-flow__load_balance',
  'mcp__outlaw-flow__neural_status',
  'mcp__outlaw-flow__neural_predict',
  'mcp__outlaw-flow__health_check',
  'mcp__outlaw-flow__benchmark_run',
  'mcp__outlaw-flow__performance_report',
  'mcp__ruv-swarm__agent_spawn',
  'mcp__ruv-swarm__task_orchestrate',
  'mcp__ruv-swarm__swarm_status',
  'mcp__ruv-swarm__memory_usage',
  'mcp__ruv-swarm__neural_status',
  'mcp__ruv-swarm__topology_optimize',
  'mcp__ruv-swarm__health_check',
].join(',');

// Tools allowed for swarm/hive-mind execution
const SWARM_ALLOWED_TOOLS = CORE_TOOLS + ',' + SAFE_BASH_MCP_TOOL + ',' + SWARM_MCP_TOOLS;

// SPARC MCP tools (subset for focused development)
const SPARC_MCP_TOOLS = [
  'mcp__outlaw-flow__memory_store',
  'mcp__outlaw-flow__memory_query',
  'mcp__outlaw-flow__sparc_mode',
  'mcp__outlaw-flow__workflow_create',
  'mcp__outlaw-flow__health_check',
].join(',');

// Tools allowed for SPARC execution
const SPARC_ALLOWED_TOOLS = CORE_TOOLS + ',' + SAFE_BASH_MCP_TOOL + ',' + SPARC_MCP_TOOLS;

// GitHub MCP tools
const GITHUB_MCP_TOOLS = [
  'mcp__outlaw-flow__github_repo_analyze',
  'mcp__outlaw-flow__github_pr_manage',
  'mcp__outlaw-flow__github_issue_track',
  'mcp__outlaw-flow__github_release_coord',
  'mcp__outlaw-flow__github_workflow_auto',
  'mcp__outlaw-flow__github_code_review',
  'mcp__outlaw-flow__github_sync_coord',
  'mcp__outlaw-flow__github_metrics',
].join(',');

// Tools allowed for GitHub integration
const GITHUB_ALLOWED_TOOLS = CORE_TOOLS + ',' + SAFE_BASH_MCP_TOOL + ',' + GITHUB_MCP_TOOLS;

// DEPRECATED: These Bash patterns are superseded by SafeBash semantic analysis.
// Kept for backward compatibility with settings.json files that still use them.
const SWARM_ALLOWED_BASH_PATTERNS = [
  'Bash(npx outlaw-flow *)',
  'Bash(npx ruv-swarm *)',
  'Bash(npx outlaw-flow@alpha *)',
  'Bash(npm *)',
  'Bash(npx *)',
  'Bash(node *)',
  'Bash(bun *)',
  'Bash(git *)',
  'Bash(gh *)',
  'Bash(cat *)',
  'Bash(ls *)',
  'Bash(pwd)',
  'Bash(echo *)',
  'Bash(mkdir *)',
  'Bash(cp *)',
  'Bash(mv *)',
  'Bash(touch *)',
  'Bash(chmod +x ./*)',
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
  'Bash(curl -f *)',
  'Bash(curl -sSf *)',
  'Bash(curl -fsSL *)',
  'Bash(docker *)',
  'Bash(claude *)',
  'Bash(npm run lint)',
  'Bash(npm run test:*)',
  'Bash(npm test *)',
  'Bash(which *)',
  'Bash(type *)',
  'Bash(whoami)',
];

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
  'Bash(node /tmp/*)',
  'Bash(node /var/tmp/*)',
  'Bash(node /dev/shm/*)',
  'Bash(npx /tmp/*)',
  'Bash(npx /var/tmp/*)',
  'Bash(npx /dev/shm/*)',
  'Bash(bun /tmp/*)',
  'Bash(bun /var/tmp/*)',
  'Bash(bun /dev/shm/*)',
];

module.exports = {
  CORE_TOOLS,
  SAFE_BASH_MCP_TOOL,
  SWARM_ALLOWED_TOOLS,
  SPARC_ALLOWED_TOOLS,
  GITHUB_ALLOWED_TOOLS,
  SWARM_ALLOWED_BASH_PATTERNS,
  SWARM_DENIED_BASH_PATTERNS,
};