# ADR-0013: DevOps & Infrastructure

**Status**: Accepted  
**Date**: 2026-07-22

## Context

The marketplace must be deployable locally for development and on a VPS for production. Infrastructure must be reproducible, observable, and maintainable.

## Decision

Use Docker Compose for local development and VPS deployment. GitHub Actions for CI/CD. Infrastructure defined as code where practical.

### Development Environment

```yaml
# docker-compose.yml
services:
  postgres:    # PostgreSQL 16 with RLS
  redis:       # Redis 7 for caching
  api:         # NestJS API (port 3000)
  web:         # Next.js frontend (port 3001)
  nginx:       # Reverse proxy (port 80)
```

### Production Architecture

```
                    ┌─────────────┐
                    │   VPS       │
                    │  (Ubuntu)   │
                    └──────┬──────┘
                           │
                    ┌──────┴──────┐
                    │   nginx     │
                    │  (reverse)  │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────┴─────┐  ┌──────┴──────┐  ┌─────┴─────┐
    │  Storefront│  │  Seller ERP │  │  Admin    │
    │  (Next.js) │  │  (Next.js)  │  │  (Next.js)│
    └─────┬─────┘  └──────┬──────┘  └─────┬─────┘
          │                │                │
          └────────────────┼────────────────┘
                           │
                    ┌──────┴──────┐
                    │  NestJS API │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────┴─────┐ ┌───┴────┐ ┌────┴─────┐
        │ PostgreSQL │ │ Redis  │ │ Storage  │
        │  (RLS)     │ │        │ │ (S3/FS)  │
        └────────────┘ └────────┘ └──────────┘
```

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
on: [push, pull_request]

jobs:
  lint:
    - pnpm lint
    - pnpm typecheck
  
  test:
    - unit tests (Jest)
    - integration tests (Testcontainers)
  
  build:
    - docker build api
    - docker build web
  
  security:
    - npm audit
    - trivy image scan
    - gitleaks secrets scan

# .github/workflows/cd-prod.yml
on:
  push:
    branches: [main]

jobs:
  deploy:
    - build images
    - push to registry
    - SSH to VPS
    - docker compose up -d
    - run migrations
    - smoke test
```

### Monitoring

| Tool | Purpose | Endpoint |
|------|---------|----------|
| Prometheus | Metrics | `/metrics` |
| Grafana | Dashboards | `:3000` |
| Loki | Logs | `:3100` |
| Jaeger | Tracing | `:16686` |
| Health checks | Liveness | `/healthz` |

### Backup Strategy

| Data | Frequency | Retention |
|------|-----------|-----------|
| PostgreSQL | Daily (WAL archiving) | 30 days |
| Redis | RDB snapshot | 7 days |
| File storage | Real-time replication | 90 days |

### Security

| Control | Implementation |
|---------|---------------|
| Secrets | Environment variables (never in code) |
| Images | Multi-stage, non-root, distroless |
| Network | Internal Docker network for services |
| SSL | Let's Encrypt via nginx |
| Updates | Dependabot + Trivy scanning |

## Consequences

### Positive
- Reproducible environments (dev = prod)
- Automated testing and deployment
- Scalable architecture (horizontal scaling ready)
- Observable with standard tooling

### Negative
- Docker overhead on small VPS
- CI/CD pipeline requires maintenance
- Monitoring infrastructure adds complexity
- Backup strategy requires testing and validation
