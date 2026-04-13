/**
 * Help text templates for Outlaw Flow CLI
 * Provides clear, actionable command documentation
 */

export const VERSION = '2.0.0';

export const MAIN_HELP = `
🌊 Outlaw-Flow v${VERSION} - Enterprise-Grade AI Agent Orchestration Platform

🎯 ENTERPRISE FEATURES: Complete ruv-swarm integration with 87 MCP tools, neural networking, and production-ready infrastructure
🐝 NEW: Advanced Hive Mind System with Queen-led coordination, collective intelligence, and unlimited scaling

USAGE:
  outlaw-flow <command> [options]
  outlaw-flow <command> --help    # Get detailed help for any command

🚀 QUICK START:
  # First time setup (creates CLAUDE.md & .claude/commands)
  npx outlaw-flow@2.0.0 init --sparc
  
  # 🐝 HIVE MIND QUICK START (NEW!):
  outlaw-flow hive-mind wizard          # Interactive setup wizard
  outlaw-flow hive-mind spawn "objective"  # Create intelligent swarm
  
  # After setup, use without npx:
  outlaw-flow start --ui --swarm         # Start with swarm intelligence UI
  outlaw-flow swarm "build REST API"     # Deploy multi-agent workflow

🐝 HIVE MIND COMMANDS (NEW!):
  hive-mind wizard         🎯 Interactive setup wizard (RECOMMENDED)
  hive-mind init           Initialize Hive Mind system with SQLite
  hive-mind spawn <task>   Create intelligent swarm with objective
  hive-mind status         View active swarms and performance metrics
  hive-mind metrics        Advanced performance analytics

📋 CORE COMMANDS:
  init                     Initialize Outlaw Flow v2.0.0 (creates CLAUDE.md & .claude/commands)
  start [--ui] [--swarm]   Start orchestration system
  swarm <objective>        Multi-agent swarm coordination
  agent <action>           Agent management (spawn, list, terminate)
  sparc <mode>             SPARC development modes (17 available)
  memory <action>          Persistent memory operations
  github <mode>            GitHub workflow automation (6 modes)
  status                   System status and health
  
📋 SWARM INTELLIGENCE COMMANDS:
  training <command>       Neural pattern learning & model updates (3 commands)
  coordination <command>   Swarm & agent orchestration (3 commands)
  analysis <command>       Performance & usage analytics (3 commands)
  automation <command>     Intelligent agent & workflow management (3 commands)
  hooks <command>          Lifecycle event management (5 commands)
  monitoring <command>     Real-time system monitoring (3 commands)
  optimization <command>   Performance & topology optimization (3 commands)
  
📋 ADDITIONAL COMMANDS:
  task <action>            Task and workflow management
  config <action>          System configuration
  mcp <action>             MCP server management
  batch <action>           Batch operations

🔍 GET HELP:
  outlaw-flow --help                Show this help
  outlaw-flow help                  Show this help
  outlaw-flow help <command>        Detailed command help
  outlaw-flow <command> --help      Detailed command help

🎯 RECOMMENDED FOR NEW USERS:
  outlaw-flow hive-mind wizard     # Start here! Interactive guided setup
  outlaw-flow init --sparc         # Initialize with SPARC methodology
  outlaw-flow help hive-mind       # Learn about Hive Mind features

📚 Documentation: https://github.com/ruvnet/outlaw-flow
🐝 Hive Mind Guide: https://github.com/ruvnet/outlaw-flow/docs/hive-mind
🐝 ruv-swarm: https://github.com/ruvnet/ruv-FANN/tree/main/ruv-swarm
`;

export const COMMAND_HELP = {
  swarm: `
🧠 SWARM COMMAND - Multi-Agent AI Coordination

USAGE:
  outlaw-flow swarm <objective> [options]

DESCRIPTION:
  Deploy intelligent multi-agent swarms to accomplish complex objectives.
  Agents work in parallel with neural optimization and real-time coordination.

OPTIONS:
  --strategy <type>    Execution strategy: research, development, analysis, 
                       testing, optimization, maintenance
  --mode <type>        Coordination mode: centralized, distributed, 
                       hierarchical, mesh, hybrid
  --max-agents <n>     Maximum number of agents (default: 5)
  --parallel           Enable parallel execution (2.8-4.4x speed improvement)
  --monitor            Real-time swarm monitoring
  --ui                 Interactive user interface
  --background         Run in background with progress tracking

EXAMPLES:
  outlaw-flow swarm "Build a REST API with authentication"
  outlaw-flow swarm "Research cloud architecture patterns" --strategy research
  outlaw-flow swarm "Optimize database queries" --max-agents 3 --parallel
  outlaw-flow swarm "Develop feature X" --strategy development --monitor --ui

AGENT TYPES:
  researcher    Research with web access and data analysis
  coder         Code development with neural patterns
  analyst       Performance analysis and optimization
  architect     System design with enterprise patterns
  tester        Comprehensive testing with automation
  coordinator   Multi-agent orchestration
`,

  github: `
🐙 GITHUB COMMAND - Workflow Automation

USAGE:
  outlaw-flow github <mode> <objective> [options]

DESCRIPTION:
  Automate GitHub workflows with 6 specialized AI-powered modes.
  Each mode handles specific aspects of repository management.

MODES:
  gh-coordinator      GitHub workflow orchestration and CI/CD
  pr-manager          Pull request management with reviews
  issue-tracker       Issue management and project coordination
  release-manager     Release coordination and deployment
  repo-architect      Repository structure optimization
  sync-coordinator    Multi-package synchronization

OPTIONS:
  --auto-approve      Automatically approve safe changes
  --dry-run           Preview changes without applying
  --verbose           Detailed operation logging
  --config <file>     Custom configuration file

EXAMPLES:
  outlaw-flow github pr-manager "create feature PR with tests"
  outlaw-flow github gh-coordinator "setup CI/CD pipeline" --auto-approve
  outlaw-flow github release-manager "prepare v2.0.0 release"
  outlaw-flow github repo-architect "optimize monorepo structure"
  outlaw-flow github issue-tracker "analyze and label issues"
  outlaw-flow github sync-coordinator "sync versions across packages"
`,

  agent: `
🤖 AGENT COMMAND - AI Agent Management

USAGE:
  outlaw-flow agent <action> [options]

ACTIONS:
  spawn <type>      Create new AI agent
  list              List all active agents
  terminate <id>    Terminate specific agent
  info <id>         Show agent details
  hierarchy         Manage agent hierarchies
  ecosystem         View agent ecosystem

OPTIONS:
  --name <name>     Custom agent name
  --verbose         Detailed output
  --json            JSON output format

AGENT TYPES:
  researcher        Research and data analysis
  coder            Code generation and refactoring
  analyst          Performance and security analysis
  architect        System design and architecture
  tester           Test creation and execution
  coordinator      Task coordination
  reviewer         Code and design review
  optimizer        Performance optimization

EXAMPLES:
  outlaw-flow agent spawn researcher --name "DataBot"
  outlaw-flow agent list --verbose
  outlaw-flow agent terminate agent-123
  outlaw-flow agent hierarchy create enterprise
  outlaw-flow agent ecosystem status
`,

  memory: `
💾 MEMORY COMMAND - Persistent Memory Management

USAGE:
  outlaw-flow memory <action> [options]

ACTIONS:
  store <key> <value>     Store data in memory
  get <key>               Retrieve stored data
  query <search>          Search memory contents
  list                    List all stored items
  delete <key>            Delete specific entry
  stats                   Memory usage statistics
  export <file>           Export memory to file
  import <file>           Import memory from file
  cleanup                 Clean old entries

OPTIONS:
  --namespace <ns>        Use specific namespace
  --format <type>         Output format (json, table)
  --verbose               Detailed output

EXAMPLES:
  outlaw-flow memory store architecture "microservices pattern"
  outlaw-flow memory get architecture
  outlaw-flow memory query "API design"
  outlaw-flow memory stats
  outlaw-flow memory export backup.json
  outlaw-flow memory cleanup --older-than 30d
`,

  sparc: `
🚀 SPARC COMMAND - Development Mode Operations

USAGE:
  outlaw-flow sparc [mode] [objective]
  outlaw-flow sparc <action>

DESCRIPTION:
  SPARC provides 17 specialized development modes for different workflows.
  Each mode optimizes AI assistance for specific tasks.

MODES:
  architect      System architecture and design
  code           Code generation and implementation
  tdd            Test-driven development workflow
  debug          Debugging and troubleshooting
  security       Security analysis and fixes
  refactor       Code refactoring and optimization
  docs           Documentation generation
  review         Code review and quality checks
  data           Data modeling and analysis
  api            API design and implementation
  ui             UI/UX development
  ops            DevOps and infrastructure
  ml             Machine learning workflows
  blockchain     Blockchain development
  mobile         Mobile app development
  game           Game development
  iot            IoT system development

ACTIONS:
  modes          List all available modes
  info <mode>    Show mode details
  run <mode>     Run specific mode

EXAMPLES:
  outlaw-flow sparc "design authentication system"    # Auto-select mode
  outlaw-flow sparc architect "design microservices"  # Use architect mode
  outlaw-flow sparc tdd "user registration feature"   # TDD workflow
  outlaw-flow sparc modes                            # List all modes
  outlaw-flow sparc info security                    # Mode details
`,

  init: `
🎯 INIT COMMAND - Initialize Outlaw Flow Environment

USAGE:
  outlaw-flow init [options]

DESCRIPTION:
  Initialize Outlaw Flow v2.0.0 in your project with full MCP integration.
  By default creates enhanced setup with CLAUDE.md and .claude/commands.

OPTIONS:
  --force          Overwrite existing configuration
  --dry-run        Preview what will be created
  --basic          Use basic initialization (pre-v2.0.0)
  --sparc          SPARC enterprise setup with additional features
  --minimal        Minimal setup without examples
  --template <t>   Use specific project template

WHAT outlaw-flow init CREATES (DEFAULT):
  📄 CLAUDE.md          AI-readable project instructions & context
  📁 .claude/           Enterprise configuration directory containing:
    └── commands/       Custom commands and automation scripts
    └── settings.json   Advanced configuration and hooks
    └── hooks/          Pre/post operation automation
  📋 .roomodes          17 specialized SPARC development modes
  
  CLAUDE.md CONTENTS:
  • Project overview and objectives
  • Technology stack and architecture
  • Development guidelines and patterns
  • AI-specific instructions for better assistance
  • Integration with ruv-swarm MCP tools
  
  .claude/commands INCLUDES:
  • Custom project-specific commands
  • Automated workflow scripts
  • Integration hooks for Claude Code
  • Team collaboration tools
  
  Features enabled:
  • ruv-swarm integration with 27 MCP tools
  • Neural network processing with WASM
  • Multi-agent coordination topologies
  • Cross-session memory persistence
  • GitHub workflow automation
  • Performance monitoring
  • Enterprise security features

EXAMPLES:
  npx outlaw-flow@2.0.0 init              # Default: Full v2.0.0 setup
  outlaw-flow init                        # Initialize with enhanced features
  outlaw-flow init --force                # Overwrite existing configuration
  outlaw-flow init --dry-run              # Preview what will be created
  outlaw-flow init --sparc                # SPARC enterprise setup
  outlaw-flow init --minimal              # Basic setup only
`,

  start: `
🚀 START COMMAND - Start Orchestration System

USAGE:
  outlaw-flow start [options]

DESCRIPTION:
  Start the Outlaw Flow orchestration system with optional UI and swarm intelligence.

OPTIONS:
  --ui             Enable interactive user interface
  --swarm          Enable swarm intelligence features
  --daemon         Run as background daemon
  --port <port>    MCP server port (default: 3000)
  --verbose        Detailed logging
  --config <file>  Custom configuration file

EXAMPLES:
  outlaw-flow start                      # Basic start
  outlaw-flow start --ui --swarm         # Full UI with swarm features
  outlaw-flow start --daemon             # Background daemon
  outlaw-flow start --port 8080          # Custom MCP port
  outlaw-flow start --config prod.json   # Production config
`,

  status: `
📊 STATUS COMMAND - System Status

USAGE:
  outlaw-flow status [options]

DESCRIPTION:
  Show comprehensive system status including agents, tasks, and resources.

OPTIONS:
  --verbose        Detailed system information
  --json           JSON output format
  --watch          Live updates
  --interval <ms>  Update interval (with --watch)

OUTPUT INCLUDES:
  • Orchestrator status
  • Active agents and their state
  • Task queue and progress
  • Memory usage statistics
  • MCP server status
  • System resources
  • Performance metrics

EXAMPLES:
  outlaw-flow status                     # Basic status
  outlaw-flow status --verbose           # Detailed information
  outlaw-flow status --json              # Machine-readable format
  outlaw-flow status --watch             # Live monitoring
`,

  training: `
🧠 TRAINING COMMAND - Neural Pattern Learning & Model Updates

USAGE:
  outlaw-flow training <command> [options]

DESCRIPTION:
  Train neural patterns from operations, learn from outcomes, and update agent models 
  with real ruv-swarm integration for continuous learning and optimization.

COMMANDS:
  neural-train      Train neural patterns from operations data
  pattern-learn     Learn from specific operation outcomes  
  model-update      Update agent models with new insights

NEURAL TRAIN OPTIONS:
  --data <source>   Training data source (default: recent)
                    Options: recent, historical, custom, swarm-<id>
  --model <name>    Target model (default: general-predictor)
                    Options: task-predictor, agent-selector, performance-optimizer
  --epochs <n>      Training epochs (default: 50)

PATTERN LEARN OPTIONS:
  --operation <op>  Operation type to learn from
  --outcome <result> Operation outcome (success/failure/partial)

MODEL UPDATE OPTIONS:
  --agent-type <type>      Agent type to update (coordinator, coder, researcher, etc.)
  --operation-result <res> Result from operation execution

EXAMPLES:
  outlaw-flow training neural-train --data recent --model task-predictor
  outlaw-flow training pattern-learn --operation "file-creation" --outcome "success"
  outlaw-flow training model-update --agent-type coordinator --operation-result "efficient"
  outlaw-flow training neural-train --data "swarm-123" --epochs 100 --model "coordinator-predictor"

🎯 Neural training improves:
  • Task selection accuracy
  • Agent performance prediction  
  • Coordination efficiency
  • Error prevention patterns
`,

  coordination: `
🐝 COORDINATION COMMAND - Swarm & Agent Orchestration

USAGE:
  outlaw-flow coordination <command> [options]

DESCRIPTION:
  Initialize swarms, spawn coordinated agents, and orchestrate task execution 
  across agents with real ruv-swarm MCP integration for optimal performance.

COMMANDS:
  swarm-init        Initialize swarm coordination infrastructure
  agent-spawn       Spawn and coordinate new agents
  task-orchestrate  Orchestrate task execution across agents

SWARM-INIT OPTIONS:
  --swarm-id <id>      Swarm identifier (auto-generated if not provided)
  --topology <type>    Coordination topology (default: hierarchical)
                       Options: hierarchical, mesh, ring, star, hybrid
  --max-agents <n>     Maximum number of agents (default: 5)
  --strategy <strategy> Coordination strategy (default: balanced)

AGENT-SPAWN OPTIONS:
  --type <type>        Agent type (default: general)
                       Options: coordinator, developer, researcher, analyzer, tester, general
  --name <name>        Custom agent name (auto-generated if not provided)
  --swarm-id <id>      Target swarm for agent coordination
  --capabilities <cap> Custom capabilities specification

TASK-ORCHESTRATE OPTIONS:
  --task <description> Task description (required)
  --swarm-id <id>      Target swarm for task execution
  --strategy <strategy> Coordination strategy (default: adaptive)
                       Options: adaptive, parallel, sequential, hierarchical
  --share-results      Enable result sharing across swarm

EXAMPLES:
  outlaw-flow coordination swarm-init --topology hierarchical --max-agents 8
  outlaw-flow coordination agent-spawn --type developer --name "api-dev" --swarm-id swarm-123
  outlaw-flow coordination task-orchestrate --task "Build REST API" --strategy parallel --share-results
  outlaw-flow coordination swarm-init --topology mesh --max-agents 12

🎯 Coordination enables:
  • Intelligent task distribution
  • Agent synchronization
  • Shared memory coordination
  • Performance optimization
  • Fault tolerance
`,

  analysis: `
📊 ANALYSIS COMMAND - Performance & Usage Analytics

USAGE:
  outlaw-flow analysis <command> [options]

DESCRIPTION:
  Detect performance bottlenecks, generate comprehensive reports, and analyze 
  token consumption using real ruv-swarm analytics for system optimization.

COMMANDS:
  bottleneck-detect    Detect performance bottlenecks in the system
  performance-report   Generate comprehensive performance reports
  token-usage          Analyze token consumption and costs

BOTTLENECK DETECT OPTIONS:
  --scope <scope>      Analysis scope (default: system)
                       Options: system, swarm, agent, task, memory
  --target <target>    Specific target to analyze (default: all)
                       Examples: agent-id, swarm-id, task-type

PERFORMANCE REPORT OPTIONS:
  --timeframe <time>   Report timeframe (default: 24h)
                       Options: 1h, 6h, 24h, 7d, 30d
  --format <format>    Report format (default: summary)
                       Options: summary, detailed, json, csv

TOKEN USAGE OPTIONS:
  --agent <agent>      Filter by agent type or ID (default: all)
  --breakdown          Include detailed breakdown by agent type
  --cost-analysis      Include cost projections and optimization

EXAMPLES:
  outlaw-flow analysis bottleneck-detect --scope system
  outlaw-flow analysis bottleneck-detect --scope agent --target coordinator-1
  outlaw-flow analysis performance-report --timeframe 7d --format detailed
  outlaw-flow analysis token-usage --breakdown --cost-analysis
  outlaw-flow analysis bottleneck-detect --scope swarm --target swarm-123

🎯 Analysis helps with:
  • Performance optimization
  • Cost management
  • Resource allocation
  • Bottleneck identification
  • Trend analysis
`,

  automation: `
🤖 AUTOMATION COMMAND - Intelligent Agent & Workflow Management

USAGE:
  outlaw-flow automation <command> [options]

DESCRIPTION:
  Automatically spawn optimal agents, intelligently manage workflows, and select 
  optimal configurations with real ruv-swarm intelligence for maximum efficiency.

COMMANDS:
  auto-agent        Automatically spawn optimal agents based on task complexity
  smart-spawn       Intelligently spawn agents based on specific requirements
  workflow-select   Select and configure optimal workflows for project types

AUTO-AGENT OPTIONS:
  --task-complexity <level>  Task complexity level (default: medium)
                             Options: low, medium, high, enterprise
  --swarm-id <id>           Target swarm ID for agent spawning

SMART-SPAWN OPTIONS:
  --requirement <req>       Specific requirement description
                           Examples: "web-development", "data-analysis", "enterprise-api"
  --max-agents <n>         Maximum number of agents to spawn (default: 10)

WORKFLOW-SELECT OPTIONS:
  --project-type <type>     Project type (default: general)
                           Options: web-app, api, data-analysis, enterprise, general
  --priority <priority>     Optimization priority (default: balanced)
                           Options: speed, quality, cost, balanced

EXAMPLES:
  outlaw-flow automation auto-agent --task-complexity enterprise --swarm-id swarm-123
  outlaw-flow automation smart-spawn --requirement "web-development" --max-agents 8
  outlaw-flow automation workflow-select --project-type api --priority speed
  outlaw-flow automation auto-agent --task-complexity low

🎯 Automation benefits:
  • Optimal resource allocation
  • Intelligent agent selection
  • Workflow optimization
  • Reduced manual configuration
  • Performance-based scaling
`,

  hooks: `
🔗 HOOKS COMMAND - Lifecycle Event Management

USAGE:
  outlaw-flow hooks <command> [options]

DESCRIPTION:
  Execute lifecycle hooks before and after tasks, edits, and sessions with 
  real ruv-swarm integration for automated preparation, tracking, and cleanup.

COMMANDS:
  pre-task      Execute before task begins (preparation & setup)
  post-task     Execute after task completion (analysis & cleanup)
  pre-edit      Execute before file modifications (backup & validation)
  post-edit     Execute after file modifications (tracking & coordination)
  session-end   Execute at session termination (cleanup & export)

PRE-TASK OPTIONS:
  --description <desc>     Task description
  --task-id <id>          Task identifier
  --agent-id <id>         Executing agent identifier
  --auto-spawn-agents     Auto-spawn agents for task (default: true)

POST-TASK OPTIONS:
  --task-id <id>               Task identifier
  --analyze-performance        Generate performance analysis
  --generate-insights          Create AI-powered insights

PRE-EDIT OPTIONS:
  --file <path>           Target file path
  --operation <type>      Edit operation type (edit, create, delete)

POST-EDIT OPTIONS:
  --file <path>           Modified file path
  --memory-key <key>      Coordination memory key for storing edit info

SESSION-END OPTIONS:
  --export-metrics        Export session performance metrics
  --swarm-id <id>         Swarm identifier for coordination cleanup
  --generate-summary      Create comprehensive session summary

EXAMPLES:
  outlaw-flow hooks pre-task --description "Build API" --task-id task-123 --agent-id agent-456
  outlaw-flow hooks post-task --task-id task-123 --analyze-performance --generate-insights
  outlaw-flow hooks pre-edit --file "src/api.js" --operation edit
  outlaw-flow hooks post-edit --file "src/api.js" --memory-key "swarm/123/edits/timestamp"
  outlaw-flow hooks session-end --export-metrics --generate-summary --swarm-id swarm-123

🎯 Hooks enable:
  • Automated preparation & cleanup
  • Performance tracking
  • Coordination synchronization
  • Error prevention
  • Insight generation
`
};

export function getCommandHelp(command) {
  return COMMAND_HELP[command] || `Help not available for command: ${command}`;
}

export function getMainHelp() {
  return MAIN_HELP;
}