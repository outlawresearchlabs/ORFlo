# Claude Code Configuration

## Build Commands
- `npm run build`: Build the project
- `npm run test`: Run the full test suite
- `npm run lint`: Run ESLint and format checks
- `npm run typecheck`: Run TypeScript type checking
- `./outlaw-flow --help`: Show all available commands

## Outlaw-Flow Complete Command Reference

### Core System Commands
- `./outlaw-flow start [--ui] [--port 3000] [--host localhost]`: Start orchestration system with optional web UI
- `./outlaw-flow status`: Show comprehensive system status
- `./outlaw-flow monitor`: Real-time system monitoring dashboard
- `./outlaw-flow config <subcommand>`: Configuration management (show, get, set, init, validate)

### Agent Management
- `./outlaw-flow agent spawn <type> [--name <name>]`: Create AI agents (researcher, coder, analyst, etc.)
- `./outlaw-flow agent list`: List all active agents
- `./outlaw-flow spawn <type>`: Quick agent spawning (alias for agent spawn)

### Task Orchestration
- `./outlaw-flow task create <type> [description]`: Create and manage tasks
- `./outlaw-flow task list`: View active task queue
- `./outlaw-flow workflow <file>`: Execute workflow automation files

### Memory Management
- `./outlaw-flow memory store <key> <data>`: Store persistent data across sessions
- `./outlaw-flow memory get <key>`: Retrieve stored information
- `./outlaw-flow memory list`: List all memory keys
- `./outlaw-flow memory export <file>`: Export memory to file
- `./outlaw-flow memory import <file>`: Import memory from file
- `./outlaw-flow memory stats`: Memory usage statistics
- `./outlaw-flow memory cleanup`: Clean unused memory entries

### SPARC Development Modes
- `./outlaw-flow sparc "<task>"`: Run orchestrator mode (default)
- `./outlaw-flow sparc run <mode> "<task>"`: Run specific SPARC mode
- `./outlaw-flow sparc tdd "<feature>"`: Test-driven development mode
- `./outlaw-flow sparc modes`: List all 17 available SPARC modes

Available SPARC modes: orchestrator, coder, researcher, tdd, architect, reviewer, debugger, tester, analyzer, optimizer, documenter, designer, innovator, swarm-coordinator, memory-manager, batch-executor, workflow-manager

### Swarm Coordination
- `./outlaw-flow swarm "<objective>" [options]`: Multi-agent swarm coordination
- `--strategy`: research, development, analysis, testing, optimization, maintenance
- `--mode`: centralized, distributed, hierarchical, mesh, hybrid
- `--max-agents <n>`: Maximum number of agents (default: 5)
- `--parallel`: Enable parallel execution
- `--monitor`: Real-time monitoring
- `--output <format>`: json, sqlite, csv, html

### MCP Server Integration
- `./outlaw-flow mcp start [--port 3000] [--host localhost]`: Start MCP server
- `./outlaw-flow mcp status`: Show MCP server status
- `./outlaw-flow mcp tools`: List available MCP tools

### Claude Integration
- `./outlaw-flow claude auth`: Authenticate with Claude API
- `./outlaw-flow claude models`: List available Claude models
- `./outlaw-flow claude chat`: Interactive chat mode

### Session Management
- `./outlaw-flow session`: Manage terminal sessions
- `./outlaw-flow repl`: Start interactive REPL mode

### Enterprise Features
- `./outlaw-flow project <subcommand>`: Project management (Enterprise)
- `./outlaw-flow deploy <subcommand>`: Deployment operations (Enterprise)
- `./outlaw-flow cloud <subcommand>`: Cloud infrastructure management (Enterprise)
- `./outlaw-flow security <subcommand>`: Security and compliance tools (Enterprise)
- `./outlaw-flow analytics <subcommand>`: Analytics and insights (Enterprise)

### Project Initialization
- `./outlaw-flow init`: Initialize Outlaw-Flow project
- `./outlaw-flow init --sparc`: Initialize with full SPARC development environment

## Quick Start Workflows

### Research Workflow
```bash
# Start a research swarm with distributed coordination
./outlaw-flow swarm "Research modern web frameworks" --strategy research --mode distributed --parallel --monitor

# Or use SPARC researcher mode for focused research
./outlaw-flow sparc run researcher "Analyze React vs Vue vs Angular performance characteristics"

# Store findings in memory for later use
./outlaw-flow memory store "research_findings" "Key insights from framework analysis"
```

### Development Workflow
```bash
# Start orchestration system with web UI
./outlaw-flow start --ui --port 3000

# Run TDD workflow for new feature
./outlaw-flow sparc tdd "User authentication system with JWT tokens"

# Development swarm for complex projects
./outlaw-flow swarm "Build e-commerce API with payment integration" --strategy development --mode hierarchical --max-agents 8 --monitor

# Check system status
./outlaw-flow status
```

### Analysis Workflow
```bash
# Analyze codebase performance
./outlaw-flow sparc run analyzer "Identify performance bottlenecks in current codebase"

# Data analysis swarm
./outlaw-flow swarm "Analyze user behavior patterns from logs" --strategy analysis --mode mesh --parallel --output sqlite

# Store analysis results
./outlaw-flow memory store "performance_analysis" "Bottlenecks identified in database queries"
```

### Maintenance Workflow
```bash
# System maintenance with safety controls
./outlaw-flow swarm "Update dependencies and security patches" --strategy maintenance --mode centralized --monitor

# Security review
./outlaw-flow sparc run reviewer "Security audit of authentication system"

# Export maintenance logs
./outlaw-flow memory export maintenance_log.json
```

## Integration Patterns

### Memory-Driven Coordination
Use Memory to coordinate information across multiple SPARC modes and swarm operations:

```bash
# Store architecture decisions
./outlaw-flow memory store "system_architecture" "Microservices with API Gateway pattern"

# All subsequent operations can reference this decision
./outlaw-flow sparc run coder "Implement user service based on system_architecture in memory"
./outlaw-flow sparc run tester "Create integration tests for microservices architecture"
```

### Multi-Stage Development
Coordinate complex development through staged execution:

```bash
# Stage 1: Research and planning
./outlaw-flow sparc run researcher "Research authentication best practices"
./outlaw-flow sparc run architect "Design authentication system architecture"

# Stage 2: Implementation
./outlaw-flow sparc tdd "User registration and login functionality"
./outlaw-flow sparc run coder "Implement JWT token management"

# Stage 3: Testing and deployment
./outlaw-flow sparc run tester "Comprehensive security testing"
./outlaw-flow swarm "Deploy authentication system" --strategy maintenance --mode centralized
```

### Enterprise Integration
For enterprise environments with additional tooling:

```bash
# Project management integration
./outlaw-flow project create "authentication-system"
./outlaw-flow project switch "authentication-system"

# Security compliance
./outlaw-flow security scan
./outlaw-flow security audit

# Analytics and monitoring
./outlaw-flow analytics dashboard
./outlaw-flow deploy production --monitor
```

## Advanced Batch Tool Patterns

### TodoWrite Coordination
Always use TodoWrite for complex task coordination:

```javascript
TodoWrite([
  {
    id: "architecture_design",
    content: "Design system architecture and component interfaces",
    status: "pending",
    priority: "high",
    dependencies: [],
    estimatedTime: "60min",
    assignedAgent: "architect"
  },
  {
    id: "frontend_development", 
    content: "Develop React components and user interface",
    status: "pending",
    priority: "medium",
    dependencies: ["architecture_design"],
    estimatedTime: "120min",
    assignedAgent: "frontend_team"
  }
]);
```

### Task and Memory Integration
Launch coordinated agents with shared memory:

```javascript
// Store architecture in memory
Task("System Architect", "Design architecture and store specs in Memory");

// Other agents use memory for coordination
Task("Frontend Team", "Develop UI using Memory architecture specs");
Task("Backend Team", "Implement APIs according to Memory specifications");
```

## Code Style Preferences
- Use ES modules (import/export) syntax
- Destructure imports when possible
- Use TypeScript for all new code
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Use async/await instead of Promise chains
- Prefer const/let over var

## Workflow Guidelines
- Always run typecheck after making code changes
- Run tests before committing changes
- Use meaningful commit messages
- Create feature branches for new functionality
- Ensure all tests pass before merging

## Important Notes
- **Use TodoWrite extensively** for all complex task coordination
- **Leverage Task tool** for parallel agent execution on independent work
- **Store all important information in Memory** for cross-agent coordination
- **Use batch file operations** whenever reading/writing multiple files
- **Check .claude/commands/** for detailed command documentation
- **All swarm operations include automatic batch tool coordination**
- **Monitor progress** with TodoRead during long-running operations
- **Enable parallel execution** with --parallel flags for maximum efficiency

This configuration ensures optimal use of Claude Code's batch tools for swarm orchestration and parallel task execution with full Outlaw-Flow capabilities.
