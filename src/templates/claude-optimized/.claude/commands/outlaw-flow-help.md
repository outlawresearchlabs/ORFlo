---
name: outlaw-flow-help
description: Show Outlaw-Flow commands and usage with batchtools optimization
---

# Outlaw-Flow Commands (Batchtools Optimized)

## Core Commands with Batch Operations

### System Management (Batch Operations)
- `npx outlaw-flow start` - Start orchestration system
- `npx outlaw-flow status` - Check system status
- `npx outlaw-flow monitor` - Real-time monitoring
- `npx outlaw-flow stop` - Stop orchestration

**Batch Operations:**
```bash
# Check multiple system components in parallel
npx outlaw-flow batch status --components "agents,tasks,memory,connections"

# Start multiple services concurrently
npx outlaw-flow batch start --services "monitor,scheduler,coordinator"
```

### Agent Management (Parallel Operations)
- `npx outlaw-flow agent spawn <type>` - Create new agent
- `npx outlaw-flow agent list` - List active agents
- `npx outlaw-flow agent info <id>` - Agent details
- `npx outlaw-flow agent terminate <id>` - Stop agent

**Batch Operations:**
```bash
# Spawn multiple agents in parallel
npx outlaw-flow agent batch-spawn "code:3,test:2,review:1"

# Get info for multiple agents concurrently
npx outlaw-flow agent batch-info "agent1,agent2,agent3"

# Terminate multiple agents
npx outlaw-flow agent batch-terminate --pattern "test-*"
```

### Task Management (Concurrent Processing)
- `npx outlaw-flow task create <type> "description"` - Create task
- `npx outlaw-flow task list` - List all tasks
- `npx outlaw-flow task status <id>` - Task status
- `npx outlaw-flow task cancel <id>` - Cancel task

**Batch Operations:**
```bash
# Create multiple tasks from file
npx outlaw-flow task batch-create tasks.json

# Check status of multiple tasks concurrently
npx outlaw-flow task batch-status --ids "task1,task2,task3"

# Process task queue in parallel
npx outlaw-flow task process-queue --parallel 5
```

### Memory Operations (Bulk Processing)
- `npx outlaw-flow memory store "key" "value"` - Store data
- `npx outlaw-flow memory query "search"` - Search memory
- `npx outlaw-flow memory stats` - Memory statistics
- `npx outlaw-flow memory export <file>` - Export memory

**Batch Operations:**
```bash
# Bulk store from JSON file
npx outlaw-flow memory batch-store data.json

# Parallel query across namespaces
npx outlaw-flow memory batch-query "search term" --namespaces "all"

# Export multiple namespaces concurrently
npx outlaw-flow memory batch-export --namespaces "project,agents,tasks"
```

### SPARC Development (Parallel Workflows)
- `npx outlaw-flow sparc modes` - List SPARC modes
- `npx outlaw-flow sparc run <mode> "task"` - Run mode
- `npx outlaw-flow sparc tdd "feature"` - TDD workflow
- `npx outlaw-flow sparc info <mode>` - Mode details

**Batch Operations:**
```bash
# Run multiple SPARC modes in parallel
npx outlaw-flow sparc batch-run --modes "spec:task1,architect:task2,code:task3"

# Execute parallel TDD for multiple features
npx outlaw-flow sparc batch-tdd features.json

# Analyze multiple components concurrently
npx outlaw-flow sparc batch-analyze --components "auth,api,database"
```

### Swarm Coordination (Enhanced Parallelization)
- `npx outlaw-flow swarm "task" --strategy <type>` - Start swarm
- `npx outlaw-flow swarm "task" --background` - Long-running swarm
- `npx outlaw-flow swarm "task" --monitor` - With monitoring

**Batch Operations:**
```bash
# Launch multiple swarms for different components
npx outlaw-flow swarm batch --config swarms.json

# Coordinate parallel swarm strategies
npx outlaw-flow swarm multi-strategy "project" --strategies "dev:frontend,test:backend,docs:api"
```

## Advanced Batch Examples

### Parallel Development Workflow:
```bash
# Initialize complete project setup in parallel
npx outlaw-flow batch init --actions "memory:setup,agents:spawn,tasks:queue"

# Run comprehensive analysis
npx outlaw-flow batch analyze --targets "code:quality,security:audit,performance:profile"
```

### Concurrent Testing Suite:
```bash
# Execute parallel test suites
npx outlaw-flow sparc batch-test --suites "unit,integration,e2e" --parallel

# Generate reports concurrently
npx outlaw-flow batch report --types "coverage,performance,security"
```

### Bulk Operations:
```bash
# Process multiple files in parallel
npx outlaw-flow batch process --files "*.ts" --action "lint,format,analyze"

# Parallel code generation
npx outlaw-flow batch generate --templates "api:users,api:products,api:orders"
```

## Performance Tips
- Use `--parallel` flag for concurrent operations
- Batch similar operations to reduce overhead
- Leverage `--async` for non-blocking execution
- Use `--stream` for real-time progress updates
- Enable `--cache` for repeated operations

## Monitoring Batch Operations
```bash
# Real-time batch monitoring
npx outlaw-flow monitor --batch

# Batch operation statistics
npx outlaw-flow stats --batch-ops

# Performance profiling
npx outlaw-flow profile --batch-execution
```