# Outlaw Flow v2.0.0 - Correct Command Usage Guide

## ✅ CORRECT COMMAND USAGE

All commands must be prefixed with `outlaw-flow`:

### 🧠 Swarm Commands
```bash
# CORRECT:
outlaw-flow swarm "Build a REST API with authentication"
outlaw-flow swarm "Research cloud patterns" --strategy research
outlaw-flow swarm "Optimize performance" --max-agents 3 --parallel

# INCORRECT:
swarm "Build a REST API"  # ❌ Won't work
```

### 🐙 GitHub Commands
```bash
# CORRECT:
outlaw-flow github pr-manager "create feature PR with tests"
outlaw-flow github gh-coordinator "setup CI/CD pipeline"
outlaw-flow github release-manager "prepare v2.0.0 release"

# INCORRECT:
github pr-manager "create PR"  # ❌ Won't work
```

### 🤖 Agent Commands
```bash
# CORRECT:
outlaw-flow agent spawn researcher --name "DataBot"
outlaw-flow agent list --verbose
outlaw-flow agent terminate agent-123

# INCORRECT:
agent spawn researcher  # ❌ Won't work
spawn researcher  # ❌ Won't work
```

### 💾 Memory Commands
```bash
# CORRECT:
outlaw-flow memory store architecture "microservices pattern"
outlaw-flow memory get architecture
outlaw-flow memory query "API design"

# INCORRECT:
memory store key value  # ❌ Won't work
```

### 🚀 SPARC Commands
```bash
# CORRECT:
outlaw-flow sparc "design authentication system"
outlaw-flow sparc architect "design microservices"
outlaw-flow sparc tdd "user registration feature"

# INCORRECT:
sparc architect "design"  # ❌ Won't work
```

### 📋 Other Commands
```bash
# CORRECT:
outlaw-flow init --sparc
outlaw-flow start --ui --swarm
outlaw-flow status --verbose
outlaw-flow task create research "Market analysis"
outlaw-flow config set terminal.poolSize 15
outlaw-flow mcp status
outlaw-flow monitor --watch
outlaw-flow batch create-config my-batch.json

# INCORRECT:
init --sparc  # ❌ Won't work
start --ui  # ❌ Won't work
status  # ❌ Won't work
```

## 🔍 GET HELP

### Main Help
```bash
outlaw-flow --help
outlaw-flow help
outlaw-flow  # (no arguments also shows help)
```

### Command-Specific Help
```bash
outlaw-flow swarm --help
outlaw-flow github --help
outlaw-flow agent --help
outlaw-flow memory --help
outlaw-flow sparc --help
outlaw-flow init --help
outlaw-flow help swarm
outlaw-flow help github
# ... etc for any command
```

## 🚀 QUICK START

```bash
# 1. Initialize with SPARC
npx outlaw-flow@2.0.0 init --sparc

# 2. Start orchestration
outlaw-flow start --ui --swarm

# 3. Deploy a swarm
outlaw-flow swarm "Build REST API" --strategy development --parallel

# 4. Use GitHub automation
outlaw-flow github pr-manager "coordinate release"

# 5. Check status
outlaw-flow status --verbose
```

## 📝 IMPORTANT NOTES

1. **Always prefix with `outlaw-flow`** - The commands won't work without it
2. **Use quotes for objectives** - Especially with spaces: `"Build REST API"`
3. **Check help for options** - Each command has specific options
4. **Use --help liberally** - Detailed help is available for every command

## 🎯 INSTALLATION

### Global Installation (Recommended)
```bash
npm install -g outlaw-flow@2.0.0
outlaw-flow init --sparc
```

### Local Installation
```bash
npm install outlaw-flow@2.0.0
npx outlaw-flow init --sparc
```

### Direct NPX Usage
```bash
npx outlaw-flow@2.0.0 init --sparc
npx outlaw-flow@2.0.0 swarm "Build app"
```

---

Remember: All commands require the `outlaw-flow` prefix. When in doubt, use `outlaw-flow --help` or `outlaw-flow <command> --help` for guidance!