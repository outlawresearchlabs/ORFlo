# 📖 Outlaw Flow v2.0.0 Usage Guide

## 🎯 Quick Start

### ⚡ Immediate Usage (NPX - Recommended)

The fastest way to start using Outlaw Flow v2.0.0 is through NPX:

```bash
# Check version and availability
npx outlaw-flow@2.0.0 --version

# Show complete help system
npx outlaw-flow@2.0.0 --help

# Check system status
npx outlaw-flow@2.0.0 status

# Initialize project with enterprise features
npx outlaw-flow@2.0.0 init --sparc
```

## 🐝 Swarm Intelligence Operations

### Basic Swarm Deployment

```bash
# Simple objective-based swarm
npx outlaw-flow@2.0.0 swarm "Build a REST API with authentication"

# Research-focused swarm with monitoring
npx outlaw-flow@2.0.0 swarm "Research modern web frameworks" --strategy research --monitor

# Development swarm with parallel execution
npx outlaw-flow@2.0.0 swarm "Implement user management system" --strategy development --parallel
```

### Advanced Swarm Configurations

```bash
# Enterprise-scale swarm (8 agents, mesh topology)
npx outlaw-flow@2.0.0 swarm "Optimize database performance" \
  --max-agents 8 \
  --mode mesh \
  --parallel \
  --monitor \
  --ui

# Background processing with quality controls
npx outlaw-flow@2.0.0 swarm "Analyze codebase for security issues" \
  --strategy analysis \
  --background \
  --review \
  --testing \
  --quality-threshold 0.9

# Distributed coordination with encryption
npx outlaw-flow@2.0.0 swarm "Process sensitive data analysis" \
  --distributed \
  --encryption \
  --memory-namespace secure \
  --timeout 120
```

### Swarm Strategy Guide

| Strategy | Best For | Agent Types | Use Cases |
|----------|----------|-------------|-----------|
| `auto` | General purpose | coordinator, developer, researcher, analyzer | Mixed objectives |
| `research` | Information gathering | researcher, analyzer, documenter | Technical research, market analysis |
| `development` | Software creation | developer, tester, reviewer, documenter | Code implementation, feature development |
| `analysis` | Data processing | analyzer, researcher, documenter | Performance analysis, data insights |
| `testing` | Quality assurance | tester, developer, reviewer | Testing, debugging, QA |
| `optimization` | Performance tuning | analyzer, developer, monitor | Performance improvements |
| `maintenance` | System upkeep | developer, monitor, tester | Bug fixes, updates, maintenance |

### Coordination Modes

| Mode | Description | Best For | Performance |
|------|-------------|----------|-------------|
| `centralized` | Single coordinator | Simple tasks, clear hierarchy | Fast, reliable |
| `distributed` | Multiple coordinators | Complex tasks, fault tolerance | Robust, scalable |
| `hierarchical` | Tree structure | Large teams, clear reporting | Organized, efficient |
| `mesh` | Peer-to-peer | Creative tasks, collaboration | Flexible, innovative |
| `hybrid` | Adaptive mix | Variable workloads | Balanced, adaptive |

## 🚀 SPARC Development Methodology

### Available SPARC Modes

```bash
# List all available modes
npx outlaw-flow@2.0.0 sparc modes

# Get detailed information about a mode
npx outlaw-flow@2.0.0 sparc info architect

# Use specific mode
npx outlaw-flow@2.0.0 sparc architect "design microservices architecture"
```

### SPARC Mode Examples

```bash
# System Architecture & Design
npx outlaw-flow@2.0.0 sparc architect "design scalable e-commerce platform"

# Code Generation & Implementation
npx outlaw-flow@2.0.0 sparc code "implement JWT authentication middleware"

# Test-Driven Development
npx outlaw-flow@2.0.0 sparc tdd "user registration with validation"

# Security Analysis
npx outlaw-flow@2.0.0 sparc security "audit API endpoints for vulnerabilities"

# Performance Debugging
npx outlaw-flow@2.0.0 sparc debug "investigate memory leaks in Node.js app"

# Code Refactoring
npx outlaw-flow@2.0.0 sparc refactor "optimize database queries for performance"

# API Design
npx outlaw-flow@2.0.0 sparc api "design REST API for social media platform"

# DevOps & Infrastructure
npx outlaw-flow@2.0.0 sparc ops "set up CI/CD pipeline with Docker"
```

## 🤖 Agent Management

### Spawning Agents

```bash
# Basic agent spawning
npx outlaw-flow@2.0.0 agent spawn researcher "Lead Researcher"

# Agent with specific capabilities
npx outlaw-flow@2.0.0 agent spawn coder "API Developer" \
  --capabilities "rest-api,database,testing" \
  --max-tasks 5 \
  --priority high

# Multiple agents for different roles
npx outlaw-flow@2.0.0 agent spawn architect "System Architect"
npx outlaw-flow@2.0.0 agent spawn tester "QA Engineer" 
npx outlaw-flow@2.0.0 agent spawn reviewer "Code Reviewer"
```

### Agent Types & Capabilities

| Agent Type | Primary Skills | Use Cases | Performance |
|------------|----------------|-----------|-------------|
| `researcher` | Information gathering, analysis | Market research, technical documentation | High accuracy |
| `coder` | Implementation, debugging | Feature development, bug fixes | High speed |
| `analyst` | Data analysis, metrics | Performance analysis, insights | High precision |
| `architect` | System design, planning | Architecture, scalability | High quality |
| `tester` | Quality assurance, testing | Test automation, validation | High reliability |
| `coordinator` | Project management | Team coordination, planning | High organization |
| `reviewer` | Code review, optimization | Quality control, best practices | High standards |

### Managing Agents

```bash
# List all active agents
npx outlaw-flow@2.0.0 agent list

# Filter by type or status
npx outlaw-flow@2.0.0 agent list --type researcher --status active

# Get JSON output for scripting
npx outlaw-flow@2.0.0 agent list --json
```

## 💾 Memory & Task Management

### Memory Operations

```bash
# Store data in shared memory
npx outlaw-flow@2.0.0 memory store "project-config" '{"api_version": "v2", "db_type": "postgresql"}'

# Retrieve data
npx outlaw-flow@2.0.0 memory get "project-config"

# Search memory entries
npx outlaw-flow@2.0.0 memory search "api" --limit 10

# Store in specific partition
npx outlaw-flow@2.0.0 memory store "secrets" "api-key-123" --partition secure
```

### Task Management

```bash
# Create tasks with different priorities
npx outlaw-flow@2.0.0 task create "Implement user authentication" --priority high

# Create task with dependencies
npx outlaw-flow@2.0.0 task create "Deploy to production" \
  --dependencies "testing,review" \
  --deadline "2024-01-15"

# List tasks with filters
npx outlaw-flow@2.0.0 task list --status in_progress
npx outlaw-flow@2.0.0 task list --priority critical --agent researcher-1
```

## 🐙 GitHub Integration

### GitHub Workflow Automation

```bash
# PR management with multi-reviewer coordination
npx outlaw-flow@2.0.0 github pr-manager "coordinate feature review for authentication module"

# Automated issue tracking
npx outlaw-flow@2.0.0 github issue-tracker "track and update progress on performance improvements"

# Release coordination
npx outlaw-flow@2.0.0 github release-manager "prepare and coordinate v2.1.0 release"

# Repository architecture management
npx outlaw-flow@2.0.0 github repo-architect "optimize repository structure for monorepo"

# Cross-repository synchronization
npx outlaw-flow@2.0.0 github sync-coordinator "sync dependencies across microservices"

# GitHub Actions workflow automation
npx outlaw-flow@2.0.0 github workflow-automation "create CI/CD pipeline for Node.js app"
```

## 📊 Monitoring & Analytics

### Real-time Monitoring

```bash
# Start real-time monitoring
npx outlaw-flow@2.0.0 monitor --realtime

# Monitor specific components
npx outlaw-flow@2.0.0 monitor --agents --tasks --metrics

# Status with detailed metrics
npx outlaw-flow@2.0.0 status --detailed --json
```

### System Status Components

```bash
# Check all system components
npx outlaw-flow@2.0.0 status

# Expected output:
# ✅ Outlaw-Flow System Status:
# 🟢 Orchestrator: Running
# 🟢 MCP Server: Connected  
# 🟢 Memory Bank: Active (1.2GB)
# 🟢 Swarm Intelligence: 3 agents active
# 🟢 Neural Networks: 27 models loaded
```

## 🔌 MCP (Model Context Protocol) Integration

### MCP Server Management

```bash
# Start MCP server
npx outlaw-flow@2.0.0 mcp start --port 3001

# List available MCP tools (27 total)
npx outlaw-flow@2.0.0 mcp tools

# Start with specific tools enabled
npx outlaw-flow@2.0.0 mcp start --tools "swarm_init,agent_spawn,task_orchestrate"
```

### Available MCP Tools

#### Core Coordination (7 tools)
- `swarm_init` - Initialize swarm coordination
- `agent_spawn` - Spawn specialized agents  
- `task_orchestrate` - Task orchestration
- `memory_usage` - Memory operations
- `neural_status` - Neural network status
- `swarm_monitor` - Real-time monitoring
- `performance_metrics` - Performance tracking

#### Advanced Features (20 tools)
- GitHub integration tools (6)
- Neural network tools (5)
- Performance optimization tools (4)
- Security and compliance tools (3)
- Enterprise features (2)

## 🛠️ Configuration & Setup

### Project Initialization

```bash
# Full enterprise setup with SPARC methodology
npx outlaw-flow@2.0.0 init --sparc

# Minimal setup
npx outlaw-flow@2.0.0 init --minimal

# Docker-ready setup
npx outlaw-flow@2.0.0 init --docker

# CI/CD friendly setup (no prompts)
npx outlaw-flow@2.0.0 init --ci --sparc
```

### What `--sparc` Creates

The `--sparc` flag creates a comprehensive enterprise setup:

```
project/
├── .claude/
│   ├── commands/          # 65+ specialized commands
│   ├── settings.json      # Enterprise configuration
│   └── sessions/          # Session management
├── CLAUDE.md             # Project coordination instructions
├── README.md             # Project documentation
└── .gitignore            # Optimized git ignore
```

## 🚨 Troubleshooting

### Common Issues & Solutions

#### Issue: Swarm LoadBalancer Error
```bash
# Error: LoadBalancer is not defined
# Solution: Use latest NPX version
npx outlaw-flow@2.0.0 swarm "your objective"
```

#### Issue: Module Resolution Errors
```bash
# Local build errors with TypeScript
# Solution: Use NPX version instead
npx outlaw-flow@2.0.0 <command>
```

#### Issue: Permission Errors
```bash
# Permission denied errors
# Solution: Check file permissions
chmod +x outlaw-flow
```

### Debug Commands

```bash
# Comprehensive system check
npx outlaw-flow@2.0.0 status --detailed

# Validate installation
npx outlaw-flow@2.0.0 --version

# Test basic functionality
npx outlaw-flow@2.0.0 --help

# Reset to clean state
npx outlaw-flow@2.0.0 init --sparc --force
```

## 📈 Performance Tips

### Optimization Strategies

1. **Use Parallel Execution**: Add `--parallel` for 2.8-4.4x speed improvement
2. **Background Processing**: Use `--background` for long-running tasks
3. **Appropriate Agent Count**: Start with 3-5 agents, scale based on workload
4. **Memory Partitioning**: Use `--memory-namespace` for organized data
5. **Quality Thresholds**: Set `--quality-threshold` based on requirements

### Performance Benchmarks

| Operation | NPX Performance | Local Build | Docker |
|-----------|----------------|-------------|---------|
| Swarm Init | 5.2ms ✅ | ❌ Build errors | 8.1ms ✅ |
| Agent Spawn | 3.4ms ✅ | ❌ Build errors | 5.2ms ✅ |
| Task Orchestration | 6ms ✅ | ❌ Build errors | 9.1ms ✅ |
| Memory Operations | 2ms ✅ | ❌ Build errors | 3.8ms ✅ |
| Neural Processing | 20.2ms ✅ | ❌ Build errors | 28.5ms ✅ |

## 🎯 Use Cases & Examples

### Enterprise Development Workflow

```bash
# 1. Initialize enterprise project
npx outlaw-flow@2.0.0 init --sparc

# 2. Research phase
npx outlaw-flow@2.0.0 swarm "research modern authentication patterns" \
  --strategy research --monitor

# 3. Architecture design
npx outlaw-flow@2.0.0 sparc architect "design scalable auth microservice"

# 4. Implementation phase
npx outlaw-flow@2.0.0 swarm "implement JWT authentication service" \
  --strategy development --parallel --review

# 5. Testing phase
npx outlaw-flow@2.0.0 swarm "comprehensive testing of auth service" \
  --strategy testing --quality-threshold 0.95

# 6. GitHub integration
npx outlaw-flow@2.0.0 github pr-manager "coordinate auth service review"
```

### Data Analysis Workflow

```bash
# Research data processing techniques
npx outlaw-flow@2.0.0 swarm "research time series analysis methods" \
  --strategy research

# Analyze existing dataset
npx outlaw-flow@2.0.0 swarm "analyze sales data for trends and patterns" \
  --strategy analysis --max-agents 4

# Create visualization dashboard
npx outlaw-flow@2.0.0 sparc ui "create interactive dashboard for sales metrics"
```

### Performance Optimization Workflow

```bash
# Analyze performance bottlenecks
npx outlaw-flow@2.0.0 swarm "identify performance bottlenecks in web app" \
  --strategy analysis --monitor

# Optimize critical paths
npx outlaw-flow@2.0.0 swarm "optimize database queries and API endpoints" \
  --strategy optimization --parallel

# Validate improvements
npx outlaw-flow@2.0.0 swarm "benchmark and validate performance improvements" \
  --strategy testing --quality-threshold 0.9
```

## 🔗 Integration Examples

### CI/CD Pipeline Integration

```yaml
# .github/workflows/outlaw-flow.yml
name: Outlaw Flow CI/CD
on:
  push:
    branches: [main]
  pull_request:
    types: [opened, synchronize]

jobs:
  outlaw-flow:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Outlaw Flow Analysis
        run: |
          npx outlaw-flow@2.0.0 swarm "analyze code changes and run tests" \
            --strategy testing --parallel --ci
      - name: GitHub Integration
        run: |
          npx outlaw-flow@2.0.0 github workflow-automation \
            "update PR with analysis results"
```

### Docker Integration

```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install -g outlaw-flow@2.0.0
COPY . .
CMD ["npx", "outlaw-flow@2.0.0", "start", "--ui", "--port", "3000"]
```

## 📚 Advanced Topics

### Custom Agent Capabilities

```bash
# Spawn agent with custom capabilities
npx outlaw-flow@2.0.0 agent spawn coder "ML Engineer" \
  --capabilities "python,tensorflow,data-science,ml-ops" \
  --max-tasks 3 \
  --priority high
```

### Memory Partitioning Strategy

```bash
# Organize memory by domains
npx outlaw-flow@2.0.0 memory store "db-config" '{"host":"localhost"}' --partition infrastructure
npx outlaw-flow@2.0.0 memory store "api-keys" "secret-key" --partition security  
npx outlaw-flow@2.0.0 memory store "user-prefs" '{"theme":"dark"}' --partition application
```

### Quality Control Workflows

```bash
# High-quality development with review gates
npx outlaw-flow@2.0.0 swarm "implement critical payment processing" \
  --strategy development \
  --review \
  --testing \
  --quality-threshold 0.95 \
  --encryption
```

## 🎓 Learning Path

### Beginner (New to Outlaw Flow)
1. Start with `npx outlaw-flow@2.0.0 --help`
2. Try basic swarm: `npx outlaw-flow@2.0.0 swarm "simple task"`
3. Explore SPARC modes: `npx outlaw-flow@2.0.0 sparc modes`
4. Initialize project: `npx outlaw-flow@2.0.0 init --sparc`

### Intermediate (Familiar with basics)
1. Use advanced swarm options: `--parallel`, `--monitor`, `--strategy`
2. Explore agent management and memory operations
3. Try GitHub integration features
4. Experiment with different coordination modes

### Advanced (Production usage)
1. Implement enterprise workflows with quality controls
2. Use distributed coordination and encryption
3. Integrate with CI/CD pipelines
4. Monitor performance and optimize configurations

---

## 📞 Support & Resources

- **GitHub Repository**: https://github.com/ruvnet/outlaw-flow
- **Issue Tracker**: https://github.com/ruvnet/outlaw-flow/issues
- **ruv-swarm Integration**: https://github.com/ruvnet/ruv-FANN/tree/main/ruv-swarm
- **NPM Package**: https://www.npmjs.com/package/outlaw-flow

---

*Last Updated: 2025-01-05*  
*Version: 2.0.0*  
*Status: Production Ready (NPX)*