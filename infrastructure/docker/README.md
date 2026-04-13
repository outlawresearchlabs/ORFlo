# Docker Infrastructure

This directory contains Docker configurations for Outlaw Flow.

## Files

- `Dockerfile`: Main Docker image definition for Outlaw Flow
- `docker-compose.yml`: Complete stack configuration including:
  - Outlaw Flow main service
  - MCP Server
  - ruv-swarm integration
  - Development environment
  - Test runner

## Directory Structure

- **testing/**: Docker-based testing infrastructure
  - Contains test-specific Docker configurations
  - Automated testing scripts
  - Performance monitoring tools

## Quick Start

### Build and Run

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Development

```bash
# Start development environment
docker-compose run --rm dev bash

# Run tests
docker-compose run --rm test
```

### Environment Variables

Required environment variables:
- `GITHUB_TOKEN`: GitHub access token
- `NODE_ENV`: Environment (production/development/test)
- `MCP_SERVER_URL`: MCP server URL (default: http://mcp-server:3001)

## Services

### outlaw-flow
- Main Outlaw Flow service
- Port: 3000
- Volume: outlaw-flow-data

### mcp-server
- MCP Server for Outlaw Flow
- Port: 3001
- Volume: mcp-data

### ruv-swarm
- ruv-swarm integration service
- Depends on: outlaw-flow, mcp-server
- Volume: swarm-data

### dev
- Development environment with hot reload
- Interactive shell access

### test
- Automated test runner
- CI-friendly configuration