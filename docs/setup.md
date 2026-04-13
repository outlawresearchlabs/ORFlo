# 🚀 Outlaw Flow v2.0.0 Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Installation Methods](#installation-methods)
4. [Initial Configuration](#initial-configuration)
5. [Environment Setup](#environment-setup)
6. [Verification](#verification)
7. [Advanced Setup](#advanced-setup)
8. [Troubleshooting](#troubleshooting)

## ✅ Prerequisites

### System Requirements
- **Node.js**: v20.0.0 or higher (v22 recommended)
- **NPM**: v10.0.0 or higher
- **Operating System**: Windows 10+, macOS 11+, or Linux
- **Memory**: 4GB RAM minimum (8GB recommended)
- **Disk Space**: 500MB free space

### Check Prerequisites
```bash
# Check Node.js version
node --version  # Should be v20.0.0 or higher

# Check NPM version
npm --version  # Should be v10.0.0 or higher

# Check available disk space
df -h .  # Linux/macOS
# or use File Explorer on Windows
```

## 🚀 Quick Start

The fastest way to get started with Outlaw Flow v2.0.0:

```bash
# One-command setup with full enterprise features
npx outlaw-flow@2.0.0 init --sparc

# Start orchestration immediately
./outlaw-flow start --ui --port 3000
```

This creates a complete enterprise environment with:
- ✅ Local `./outlaw-flow` wrapper script
- ✅ `.claude/` configuration directory
- ✅ `CLAUDE.md` with ruv-swarm integration docs
- ✅ 27 MCP tools for swarm intelligence
- ✅ Docker support files
- ✅ GitHub workflow automation

## 📦 Installation Methods

### Method 1: NPX Quick Start (Recommended)
```bash
# Initialize with enterprise features and ruv-swarm
npx outlaw-flow@2.0.0 init --sparc

# Or minimal setup
npx outlaw-flow@2.0.0 init --minimal

# With Docker support
npx outlaw-flow@2.0.0 init --docker
```

### Method 2: Global Installation
```bash
# Install globally
npm install -g outlaw-flow@2.0.0

# Verify installation
outlaw-flow --version

# Initialize in any directory
outlaw-flow init --sparc
```

### Method 3: Project Installation
```bash
# Add to existing project
npm install outlaw-flow@2.0.0 --save-dev

# Add to package.json scripts
npm pkg set scripts.flow="outlaw-flow"
npm pkg set scripts.flow:start="outlaw-flow start --ui"
npm pkg set scripts.flow:swarm="outlaw-flow swarm"

# Initialize
npx outlaw-flow init --sparc
```

### Method 4: Docker Installation
```bash
# Pull official image
docker pull ruvnet/outlaw-flow:2.0.0

# Run with volume mapping
docker run -it -v $(pwd):/app -p 3000:3000 ruvnet/outlaw-flow:2.0.0 init --sparc
```

## ⚙️ Initial Configuration

### 1. Run Initialization
```bash
./outlaw-flow init --sparc
```

You'll be prompted for:
- **Project name**: Your project identifier
- **MCP integration**: Enable Model Context Protocol (recommended: Yes)
- **GitHub integration**: Enable workflow automation (recommended: Yes)
- **Docker support**: Add Docker configuration (optional)
- **Memory persistence**: Enable cross-session memory (recommended: Yes)

### 2. Configuration Structure
After initialization, your project will have:
```
your-project/
├── outlaw-flow          # Executable wrapper script
├── .claude/             # Configuration directory
│   ├── config.json      # Main configuration
│   ├── settings.json    # User preferences
│   ├── commands/        # Custom commands
│   └── templates/       # Project templates
├── CLAUDE.md           # Integration documentation
├── memory/             # Persistent memory storage
└── logs/               # System logs
```

### 3. Customize Configuration
Edit `.claude/config.json`:
```json
{
  "version": "2.0.0",
  "features": {
    "mcp": true,
    "swarm": true,
    "github": true,
    "docker": false,
    "monitoring": true
  },
  "ui": {
    "port": 3000,
    "theme": "dark",
    "autoOpen": true
  },
  "swarm": {
    "defaultTopology": "hierarchical",
    "maxAgents": 8,
    "parallelExecution": true
  }
}
```

## 🌍 Environment Setup

### 1. Environment Variables
Create `.env` file:
```bash
# Outlaw Flow Configuration
OUTLAW_FLOW_PORT=3000
OUTLAW_FLOW_UI_THEME=dark
OUTLAW_FLOW_LOG_LEVEL=info

# MCP Configuration
MCP_SERVER_PORT=3001
MCP_TIMEOUT=30000

# Swarm Configuration
SWARM_MAX_AGENTS=8
SWARM_DEFAULT_TOPOLOGY=hierarchical
SWARM_PARALLEL_EXECUTION=true

# Memory Configuration
MEMORY_PERSISTENCE=true
MEMORY_BACKUP_INTERVAL=3600000

# Optional: API Keys
GITHUB_TOKEN=your_github_token
OPENAI_API_KEY=your_openai_key
```

### 2. Shell Configuration

#### Bash/Zsh
Add to `~/.bashrc` or `~/.zshrc`:
```bash
# Outlaw Flow aliases
alias cf="./outlaw-flow"
alias cfs="./outlaw-flow start --ui"
alias cfswarm="./outlaw-flow swarm"
alias cfsparc="./outlaw-flow sparc"

# Add current directory to PATH for outlaw-flow
export PATH="$PATH:."
```

#### PowerShell (Windows)
Add to PowerShell profile:
```powershell
# Outlaw Flow aliases
Set-Alias cf ".\outlaw-flow"
Set-Alias cfs ".\outlaw-flow start --ui"
Set-Alias cfswarm ".\outlaw-flow swarm"
Set-Alias cfsparc ".\outlaw-flow sparc"
```

### 3. IDE Configuration

#### VS Code
Create `.vscode/settings.json`:
```json
{
  "outlaw-flow.enable": true,
  "outlaw-flow.ui.port": 3000,
  "outlaw-flow.swarm.autoStart": true,
  "terminal.integrated.env.linux": {
    "OUTLAW_FLOW_CONFIG": "${workspaceFolder}/.claude"
  }
}
```

## ✅ Verification

### 1. Check Installation
```bash
# Verify version
./outlaw-flow --version
# Expected: outlaw-flow/2.0.0 darwin-arm64 node-v22.11.0

# Check system status
./outlaw-flow status
# Should show all components as "Ready"
```

### 2. Test Core Features
```bash
# Start UI
./outlaw-flow start --ui
# Visit http://localhost:3000

# Spawn test agent
./outlaw-flow agent spawn researcher --name "TestBot"

# Run simple SPARC command
./outlaw-flow sparc run code "create hello world function"
```

### 3. Verify MCP Integration
```bash
# Check MCP server
./outlaw-flow mcp status

# List available tools
./outlaw-flow mcp tools

# Should show 27+ tools including:
# - swarm_init
# - agent_spawn
# - task_orchestrate
# - memory_usage
# - neural_train
```

### 4. Test Swarm Features
```bash
# Initialize swarm
./outlaw-flow swarm init --topology mesh --max-agents 3

# Run test swarm
./outlaw-flow swarm "analyze this codebase" --monitor
```

## 🔧 Advanced Setup

### 1. Custom Command Directory
```bash
# Create custom commands
mkdir -p .claude/commands

# Add custom command
cat > .claude/commands/my-workflow.js << 'EOF'
module.exports = {
  name: 'my-workflow',
  description: 'Custom development workflow',
  action: async (args) => {
    console.log('Running custom workflow...');
    // Your custom logic here
  }
};
EOF
```

### 2. Memory Bank Configuration
```bash
# Initialize memory with custom settings
./outlaw-flow memory init --size 100mb --compression gzip

# Configure auto-backup
./outlaw-flow memory config --auto-backup --interval 1h
```

### 3. Performance Optimization
```bash
# Enable performance features
./outlaw-flow config set performance.cache true
./outlaw-flow config set performance.parallelAgents 8
./outlaw-flow config set performance.tokenOptimization true
```

### 4. Security Configuration
```bash
# Set up access control
./outlaw-flow security init

# Configure audit logging
./outlaw-flow audit config --enable --retention 90d

# Set up API key encryption
./outlaw-flow security encrypt-keys
```

### 5. CI/CD Integration

#### GitHub Actions
```yaml
# .github/workflows/outlaw-flow.yml
name: Outlaw Flow CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npx outlaw-flow@2.0.0 init --ci
      - run: ./outlaw-flow test
      - run: ./outlaw-flow swarm "run tests" --parallel
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Permission Denied
```bash
# Solution: Make wrapper executable
chmod +x outlaw-flow

# Or use npm/npx
npx outlaw-flow start
```

#### 2. Port Already in Use
```bash
# Change port
./outlaw-flow start --ui --port 3001

# Or kill existing process
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows
```

#### 3. MCP Connection Failed
```bash
# Check MCP server
./outlaw-flow mcp diagnose

# Restart MCP
./outlaw-flow mcp restart

# Check logs
tail -f logs/mcp-server.log
```

#### 4. Memory Issues
```bash
# Clear memory cache
./outlaw-flow memory clear --cache

# Rebuild memory index
./outlaw-flow memory rebuild

# Check memory usage
./outlaw-flow memory stats
```

### Diagnostic Commands
```bash
# Full system diagnostic
./outlaw-flow diagnose --full

# Component-specific checks
./outlaw-flow diagnose --mcp
./outlaw-flow diagnose --swarm
./outlaw-flow diagnose --memory

# Generate diagnostic report
./outlaw-flow diagnose --report > diagnostic-report.txt
```

## 📚 Next Steps

1. **Read the Documentation**
   - [Migration Guide](./MIGRATION_GUIDE.md) - If upgrading from Deno
   - [API Reference](./API_REFERENCE.md) - Complete command list
   - [GitHub Integration](./GITHUB_INTEGRATION.md) - Workflow automation

2. **Try Example Workflows**
   ```bash
   # Development workflow
   ./outlaw-flow sparc run architect "design REST API"
   
   # Testing workflow
   ./outlaw-flow swarm "comprehensive test suite" --strategy testing
   
   # Deployment workflow
   ./outlaw-flow sparc run devops "setup CI/CD pipeline"
   ```

3. **Join the Community**
   - [GitHub Discussions](https://github.com/ruvnet/outlaw-flow/discussions)
   - [Discord Server](https://discord.gg/outlaw-flow)
   - [YouTube Tutorials](https://youtube.com/@outlaw-flow)

## 🎯 Quick Reference Card

```bash
# Essential Commands
./outlaw-flow init --sparc        # Initialize with all features
./outlaw-flow start --ui          # Start with web interface
./outlaw-flow status              # Check system health
./outlaw-flow swarm "task"        # Run multi-agent task
./outlaw-flow sparc run code      # SPARC code generation
./outlaw-flow agent spawn type    # Create new agent
./outlaw-flow memory store/query  # Memory operations
./outlaw-flow monitor             # Real-time monitoring

# Keyboard Shortcuts (in UI)
Ctrl/Cmd + K    # Command palette
Ctrl/Cmd + P    # Quick file search
Ctrl/Cmd + T    # New terminal
Ctrl/Cmd + S    # Save current state
```

---

**🎉 Setup Complete! You're ready to use Outlaw Flow v2.0.0**

For additional help, run: `./outlaw-flow help` or visit our [documentation](https://github.com/ruvnet/outlaw-flow/docs).