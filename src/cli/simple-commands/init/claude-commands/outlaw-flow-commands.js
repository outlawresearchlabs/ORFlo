// outlaw-flow-commands.js - Outlaw-Flow specific slash commands

// Create Outlaw-Flow specific commands
export async function createClaudeFlowCommands(workingDir) {
  // Help command
  const helpCommand = `---
name: outlaw-flow-help
description: Show Outlaw-Flow commands and usage
---

# Outlaw-Flow Commands

## 🌊 Outlaw-Flow: Agent Orchestration Platform

Outlaw-Flow is the ultimate multi-terminal orchestration platform that revolutionizes how you work with Claude Code.

## Core Commands

### 🚀 System Management
- \`./outlaw-flow start\` - Start orchestration system
- \`./outlaw-flow start --ui\` - Start with interactive process management UI
- \`./outlaw-flow status\` - Check system status
- \`./outlaw-flow monitor\` - Real-time monitoring
- \`./outlaw-flow stop\` - Stop orchestration

### 🤖 Agent Management
- \`./outlaw-flow agent spawn <type>\` - Create new agent
- \`./outlaw-flow agent list\` - List active agents
- \`./outlaw-flow agent info <id>\` - Agent details
- \`./outlaw-flow agent terminate <id>\` - Stop agent

### 📋 Task Management
- \`./outlaw-flow task create <type> "description"\` - Create task
- \`./outlaw-flow task list\` - List all tasks
- \`./outlaw-flow task status <id>\` - Task status
- \`./outlaw-flow task cancel <id>\` - Cancel task
- \`./outlaw-flow task workflow <file>\` - Execute workflow

### 🧠 Memory Operations
- \`./outlaw-flow memory store "key" "value"\` - Store data
- \`./outlaw-flow memory query "search"\` - Search memory
- \`./outlaw-flow memory stats\` - Memory statistics
- \`./outlaw-flow memory export <file>\` - Export memory
- \`./outlaw-flow memory import <file>\` - Import memory

### ⚡ SPARC Development
- \`./outlaw-flow sparc "task"\` - Run SPARC orchestrator
- \`./outlaw-flow sparc modes\` - List all 17+ SPARC modes
- \`./outlaw-flow sparc run <mode> "task"\` - Run specific mode
- \`./outlaw-flow sparc tdd "feature"\` - TDD workflow
- \`./outlaw-flow sparc info <mode>\` - Mode details

### 🐝 Swarm Coordination
- \`./outlaw-flow swarm "task" --strategy <type>\` - Start swarm
- \`./outlaw-flow swarm "task" --background\` - Long-running swarm
- \`./outlaw-flow swarm "task" --monitor\` - With monitoring
- \`./outlaw-flow swarm "task" --ui\` - Interactive UI
- \`./outlaw-flow swarm "task" --distributed\` - Distributed coordination

### 🌍 MCP Integration
- \`./outlaw-flow mcp status\` - MCP server status
- \`./outlaw-flow mcp tools\` - List available tools
- \`./outlaw-flow mcp config\` - Show configuration
- \`./outlaw-flow mcp logs\` - View MCP logs

### 🤖 Claude Integration
- \`./outlaw-flow claude spawn "task"\` - Spawn Claude with enhanced guidance
- \`./outlaw-flow claude batch <file>\` - Execute workflow configuration

## 🌟 Quick Examples

### Initialize with SPARC:
\`\`\`bash
npx -y outlaw-flow@latest init --sparc
\`\`\`

### Start a development swarm:
\`\`\`bash
./outlaw-flow swarm "Build REST API" --strategy development --monitor --review
\`\`\`

### Run TDD workflow:
\`\`\`bash
./outlaw-flow sparc tdd "user authentication"
\`\`\`

### Store project context:
\`\`\`bash
./outlaw-flow memory store "project_requirements" "e-commerce platform specs" --namespace project
\`\`\`

### Spawn specialized agents:
\`\`\`bash
./outlaw-flow agent spawn researcher --name "Senior Researcher" --priority 8
./outlaw-flow agent spawn developer --name "Lead Developer" --priority 9
\`\`\`

## 🎯 Best Practices
- Use \`./outlaw-flow\` instead of \`npx outlaw-flow\` after initialization
- Store important context in memory for cross-session persistence
- Use swarm mode for complex tasks requiring multiple agents
- Enable monitoring for real-time progress tracking
- Use background mode for tasks > 30 minutes

## 📚 Resources
- Documentation: https://github.com/ruvnet/outlaw-flow/docs
- Examples: https://github.com/ruvnet/outlaw-flow/examples
- Issues: https://github.com/ruvnet/outlaw-flow/issues
`;
  
  await Deno.writeTextFile(`${workingDir}/.claude/commands/outlaw-flow-help.md`, helpCommand);
  console.log('  ✓ Created slash command: /outlaw-flow-help');
  
  // Memory command
  const memoryCommand = `---
name: outlaw-flow-memory
description: Interact with Outlaw-Flow memory system
---

# 🧠 Outlaw-Flow Memory System

The memory system provides persistent storage for cross-session and cross-agent collaboration with CRDT-based conflict resolution.

## Store Information
\`\`\`bash
# Store with default namespace
./outlaw-flow memory store "key" "value"

# Store with specific namespace
./outlaw-flow memory store "architecture_decisions" "microservices with API gateway" --namespace arch
\`\`\`

## Query Memory
\`\`\`bash
# Search across all namespaces
./outlaw-flow memory query "authentication"

# Search with filters
./outlaw-flow memory query "API design" --namespace arch --limit 10
\`\`\`

## Memory Statistics
\`\`\`bash
# Show overall statistics
./outlaw-flow memory stats

# Show namespace-specific stats
./outlaw-flow memory stats --namespace project
\`\`\`

## Export/Import
\`\`\`bash
# Export all memory
./outlaw-flow memory export full-backup.json

# Export specific namespace
./outlaw-flow memory export project-backup.json --namespace project

# Import memory
./outlaw-flow memory import backup.json
\`\`\`

## Cleanup Operations
\`\`\`bash
# Clean entries older than 30 days
./outlaw-flow memory cleanup --days 30

# Clean specific namespace
./outlaw-flow memory cleanup --namespace temp --days 7
\`\`\`

## 🗂️ Namespaces
- **default** - General storage
- **agents** - Agent-specific data and state
- **tasks** - Task information and results
- **sessions** - Session history and context
- **swarm** - Swarm coordination and objectives
- **project** - Project-specific context
- **spec** - Requirements and specifications
- **arch** - Architecture decisions
- **impl** - Implementation notes
- **test** - Test results and coverage
- **debug** - Debug logs and fixes

## 🎯 Best Practices

### Naming Conventions
- Use descriptive, searchable keys
- Include timestamp for time-sensitive data
- Prefix with component name for clarity

### Organization
- Use namespaces to categorize data
- Store related data together
- Keep values concise but complete

### Maintenance
- Regular backups with export
- Clean old data periodically
- Monitor storage statistics
- Compress large values

## Examples

### Store SPARC context:
\`\`\`bash
./outlaw-flow memory store "spec_auth_requirements" "OAuth2 + JWT with refresh tokens" --namespace spec
./outlaw-flow memory store "arch_api_design" "RESTful microservices with GraphQL gateway" --namespace arch
./outlaw-flow memory store "test_coverage_auth" "95% coverage, all tests passing" --namespace test
\`\`\`

### Query project decisions:
\`\`\`bash
./outlaw-flow memory query "authentication" --namespace arch --limit 5
./outlaw-flow memory query "test results" --namespace test
\`\`\`

### Backup project memory:
\`\`\`bash
./outlaw-flow memory export project-$(date +%Y%m%d).json --namespace project
\`\`\`
`;
  
  await Deno.writeTextFile(`${workingDir}/.claude/commands/outlaw-flow-memory.md`, memoryCommand);
  console.log('  ✓ Created slash command: /outlaw-flow-memory');
  
  // Swarm command
  const swarmCommand = `---
name: outlaw-flow-swarm
description: Coordinate multi-agent swarms for complex tasks
---

# 🐝 Outlaw-Flow Swarm Coordination

Advanced multi-agent coordination system with timeout-free execution, distributed memory sharing, and intelligent load balancing.

## Basic Usage
\`\`\`bash
./outlaw-flow swarm "your complex task" --strategy <type> [options]
\`\`\`

## 🎯 Swarm Strategies
- **auto** - Automatic strategy selection based on task analysis
- **development** - Code implementation with review and testing
- **research** - Information gathering and synthesis
- **analysis** - Data processing and pattern identification
- **testing** - Comprehensive quality assurance
- **optimization** - Performance tuning and refactoring
- **maintenance** - System updates and bug fixes

## 🤖 Agent Types
- **coordinator** - Plans and delegates tasks to other agents
- **developer** - Writes code and implements solutions
- **researcher** - Gathers and analyzes information
- **analyzer** - Identifies patterns and generates insights
- **tester** - Creates and runs tests for quality assurance
- **reviewer** - Performs code and design reviews
- **documenter** - Creates documentation and guides
- **monitor** - Tracks performance and system health
- **specialist** - Domain-specific expert agents

## 🔄 Coordination Modes
- **centralized** - Single coordinator manages all agents (default)
- **distributed** - Multiple coordinators share management
- **hierarchical** - Tree structure with nested coordination
- **mesh** - Peer-to-peer agent collaboration
- **hybrid** - Mixed coordination strategies

## ⚙️ Common Options
- \`--strategy <type>\` - Execution strategy
- \`--mode <type>\` - Coordination mode
- \`--max-agents <n>\` - Maximum concurrent agents (default: 5)
- \`--timeout <minutes>\` - Timeout in minutes (default: 60)
- \`--background\` - Run in background for tasks > 30 minutes
- \`--monitor\` - Enable real-time monitoring
- \`--ui\` - Launch terminal UI interface
- \`--parallel\` - Enable parallel execution
- \`--distributed\` - Enable distributed coordination
- \`--review\` - Enable peer review process
- \`--testing\` - Include automated testing
- \`--encryption\` - Enable data encryption
- \`--verbose\` - Detailed logging output
- \`--dry-run\` - Show configuration without executing

## 🌟 Examples

### Development Swarm with Review
\`\`\`bash
./outlaw-flow swarm "Build e-commerce REST API" \\
  --strategy development \\
  --monitor \\
  --review \\
  --testing
\`\`\`

### Long-Running Research Swarm
\`\`\`bash
./outlaw-flow swarm "Analyze AI market trends 2024-2025" \\
  --strategy research \\
  --background \\
  --distributed \\
  --max-agents 8
\`\`\`

### Performance Optimization Swarm
\`\`\`bash
./outlaw-flow swarm "Optimize database queries and API performance" \\
  --strategy optimization \\
  --testing \\
  --parallel \\
  --monitor
\`\`\`

### Enterprise Development Swarm
\`\`\`bash
./outlaw-flow swarm "Implement secure payment processing system" \\
  --strategy development \\
  --mode distributed \\
  --max-agents 10 \\
  --parallel \\
  --monitor \\
  --review \\
  --testing \\
  --encryption \\
  --verbose
\`\`\`

### Testing and QA Swarm
\`\`\`bash
./outlaw-flow swarm "Comprehensive security audit and testing" \\
  --strategy testing \\
  --review \\
  --verbose \\
  --max-agents 6
\`\`\`

## 📊 Monitoring and Control

### Real-time monitoring:
\`\`\`bash
# Monitor swarm activity
./outlaw-flow monitor

# Monitor specific component
./outlaw-flow monitor --focus swarm
\`\`\`

### Check swarm status:
\`\`\`bash
# Overall system status
./outlaw-flow status

# Detailed swarm status
./outlaw-flow status --verbose
\`\`\`

### View agent activity:
\`\`\`bash
# List all agents
./outlaw-flow agent list

# Agent details
./outlaw-flow agent info <agent-id>
\`\`\`

## 💾 Memory Integration

Swarms automatically use distributed memory for collaboration:

\`\`\`bash
# Store swarm objectives
./outlaw-flow memory store "swarm_objective" "Build scalable API" --namespace swarm

# Query swarm progress
./outlaw-flow memory query "swarm_progress" --namespace swarm

# Export swarm memory
./outlaw-flow memory export swarm-results.json --namespace swarm
\`\`\`

## 🎯 Key Features

### Timeout-Free Execution
- Background mode for long-running tasks
- State persistence across sessions
- Automatic checkpoint recovery

### Work Stealing & Load Balancing
- Dynamic task redistribution
- Automatic agent scaling
- Resource-aware scheduling

### Circuit Breakers & Fault Tolerance
- Automatic retry with exponential backoff
- Graceful degradation
- Health monitoring and recovery

### Real-Time Collaboration
- Cross-agent communication
- Shared memory access
- Event-driven coordination

### Enterprise Security
- Role-based access control
- Audit logging
- Data encryption
- Input validation

## 🔧 Advanced Configuration

### Dry run to preview:
\`\`\`bash
./outlaw-flow swarm "Test task" --dry-run --strategy development
\`\`\`

### Custom quality thresholds:
\`\`\`bash
./outlaw-flow swarm "High quality API" \\
  --strategy development \\
  --quality-threshold 0.95
\`\`\`

### Scheduling algorithms:
- FIFO (First In, First Out)
- Priority-based
- Deadline-driven
- Shortest Job First
- Critical Path
- Resource-aware
- Adaptive

For detailed documentation, see: https://github.com/ruvnet/outlaw-flow/docs/swarm-system.md
`;
  
  await Deno.writeTextFile(`${workingDir}/.claude/commands/outlaw-flow-swarm.md`, swarmCommand);
  console.log('  ✓ Created slash command: /outlaw-flow-swarm');
}