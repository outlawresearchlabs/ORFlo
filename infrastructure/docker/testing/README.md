# Docker Testing Environment for outlaw-flow

This directory contains a comprehensive Docker testing environment for outlaw-flow and ruv-swarm integration.

## 🏗️ Architecture

### Multi-Stage Docker Build

The `Dockerfile` implements a multi-stage build process:

1. **Base Stage**: Common system dependencies and Node.js setup
2. **Dependencies Stage**: Optimized dependency installation
3. **Development Stage**: Full development environment with source code
4. **Testing Stage**: Test-specific configuration and tools
5. **Production Stage**: Minimal production runtime
6. **Swarm Integration Stage**: ruv-swarm MCP integration testing

### Docker Compose Orchestration

The `docker-compose.yml` provides:

- **outlaw-flow-dev**: Development environment with hot reloading
- **outlaw-flow-test**: Automated testing environment
- **outlaw-flow-prod**: Production-ready deployment
- **ruv-swarm-integration**: Swarm coordination testing
- **Database Services**: SQLite databases for both services
- **Monitoring**: Performance monitoring and metrics collection
- **Load Balancer**: Nginx for production load balancing

## 🚀 Quick Start

### 1. Build and Test Everything

```bash
# Run complete build and test pipeline
./scripts/build-and-test.sh
```

### 2. Development Environment

```bash
# Start development environment
docker-compose up -d outlaw-flow-dev

# View logs
docker-compose logs -f outlaw-flow-dev

# Access the application
open http://localhost:3000
```

### 3. Testing Environment

```bash
# Run all tests
docker-compose --profile testing up test-runner

# Run specific test suites
docker-compose run --rm outlaw-flow-test npm run test:unit
docker-compose run --rm outlaw-flow-test npm run test:integration
```

### 4. Swarm Integration Testing

```bash
# Start swarm integration environment
docker-compose --profile swarm up -d

# Run swarm tests
docker-compose run --rm ruv-swarm-integration npm run test:swarm

# Monitor swarm coordination
docker-compose logs -f ruv-swarm-integration
```

### 5. Production Deployment

```bash
# Start production environment
docker-compose --profile production up -d

# Access production instance
open http://localhost:3002

# Check health
curl http://localhost:3002/health
```

## 📊 Monitoring and Metrics

### Performance Monitoring

The environment includes comprehensive monitoring:

```bash
# Start performance monitoring
docker-compose --profile monitoring up -d performance-monitor

# View metrics
curl http://localhost/metrics

# Check performance reports
cat infrastructure/docker/testing/volumes/shared/performance-report.json
```

### Health Checks

All services include health checks:

```bash
# Check all service health
docker-compose ps

# Manual health check
curl http://localhost:3000/health
```

## 🔧 Configuration

### Environment Variables

Key environment variables:

```bash
# Development
NODE_ENV=development
DEBUG=outlaw-flow:*
SWARM_MODE=true
MCP_ENABLED=true

# Testing
NODE_ENV=test
CI=true
PARALLEL_TESTS=true

# Production
NODE_ENV=production
PORT=3000
```

### Volume Mounts

The environment uses strategic volume mounting:

- **Source Code**: Live mounting for development
- **Node Modules**: Cached for performance
- **Shared Data**: Cross-container communication
- **Test Results**: Persistent test artifacts
- **Database**: Persistent data storage

## 🧪 Testing Strategy

### Test Suites

1. **Unit Tests**: Component-level testing
2. **Integration Tests**: Service integration testing
3. **E2E Tests**: End-to-end workflow testing
4. **Performance Tests**: Load and stress testing
5. **Swarm Tests**: Multi-agent coordination testing
6. **MCP Tests**: Protocol integration testing

### Test Execution

```bash
# Run all tests
./scripts/run-all-tests.sh

# Run specific test categories
docker-compose run --rm outlaw-flow-test npm run test:unit
docker-compose run --rm outlaw-flow-test npm run test:integration
docker-compose run --rm outlaw-flow-test npm run test:performance
```

## 📂 Directory Structure

```
infrastructure/docker/testing/
├── Dockerfile                 # Multi-stage build definition
├── docker-compose.yml         # Service orchestration
├── docker-compose.test.yml    # Test-specific orchestration
├── docker-compose.override.yml # Local overrides
├── .dockerignore              # Build context exclusions
├── nginx.conf                 # Load balancer configuration
├── README.md                  # This file
├── scripts/
│   ├── build-and-test.sh      # Main build and test pipeline
│   ├── run-all-tests.sh       # Comprehensive test runner
│   └── performance-monitor.js  # Performance monitoring
└── volumes/
    ├── outlaw-flow/           # outlaw-flow specific data
    ├── ruv-swarm/             # ruv-swarm specific data
    └── shared/                # Cross-container shared data
```

## 🔄 CI/CD Integration

### GitHub Actions Integration

The Docker environment is designed for CI/CD:

```yaml
# Example GitHub Actions workflow
name: Docker Test Pipeline
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Docker Tests
        run: |
          cd infrastructure/docker/testing
          ./scripts/build-and-test.sh
```

### Automated Testing

The pipeline includes:

- **Multi-stage builds** for different environments
- **Parallel test execution** for faster feedback
- **Comprehensive reporting** with detailed metrics
- **Automated cleanup** to prevent resource leaks
- **Health monitoring** for service reliability

## 🛠️ Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports 3000-3002, 8080 are available
2. **Docker Memory**: Increase Docker memory allocation if needed
3. **Volume Permissions**: Check volume mount permissions
4. **Network Issues**: Verify Docker network configuration

### Debug Commands

```bash
# View container logs
docker-compose logs -f [service-name]

# Execute interactive shell
docker-compose exec outlaw-flow-dev /bin/bash

# Check container resource usage
docker stats

# Inspect container configuration
docker-compose config
```

### Performance Optimization

For optimal performance:

1. **Use `.dockerignore`** to reduce build context
2. **Layer caching** for faster builds
3. **Multi-stage builds** for smaller images
4. **Volume mounting** for development efficiency
5. **Health checks** for reliability

## 📋 Testing Checklist

Before deployment, verify:

- [ ] All Docker images build successfully
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Performance tests meet requirements
- [ ] Swarm integration works correctly
- [ ] MCP protocol integration functions
- [ ] Health checks are responsive
- [ ] Monitoring captures metrics
- [ ] Production deployment is secure

## 🚀 Next Steps

1. **CI/CD Integration**: Add to GitHub Actions
2. **Kubernetes Deployment**: Create K8s manifests
3. **Multi-Architecture**: Support ARM64 builds
4. **Security Scanning**: Add vulnerability scanning
5. **Documentation**: Update deployment guides

## 📞 Support

For issues or questions:

- **GitHub Issues**: https://github.com/ruvnet/outlaw-flow/issues
- **Documentation**: https://github.com/ruvnet/outlaw-flow/docs
- **Discord**: Community support channel

---

**Note**: This Docker environment is optimized for testing outlaw-flow and ruv-swarm integration. For production deployments, review security configurations and resource limits.