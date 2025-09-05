.PHONY: help dev build test clean docker-up docker-down docker-reset db-setup

# Default target
help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Development commands
dev: ## Start development environment
	@echo "Starting development environment..."
	@make docker-up
	@echo "Waiting for services to be ready..."
	@sleep 10
	@make db-setup
	@echo "Development environment ready!"
	@echo "🎰 Web: http://localhost:3000"
	@echo "🔧 API: http://localhost:3001"
	@echo "📊 Grafana: http://localhost:3000 (admin/admin)"
	@echo "📈 Prometheus: http://localhost:9090"
	@echo "📧 Mailhog: http://localhost:8025"
	@echo "💾 MinIO: http://localhost:9001 (minioadmin/minioadmin123)"

build: ## Build all applications
	pnpm build

test: ## Run all tests
	pnpm test

test-e2e: ## Run end-to-end tests
	pnpm test:e2e

clean: ## Clean all build artifacts
	pnpm clean
	docker system prune -f

# Docker commands
docker-up: ## Start all Docker services
	docker-compose up -d

docker-down: ## Stop all Docker services
	docker-compose down

docker-reset: ## Reset Docker environment (removes volumes)
	docker-compose down -v
	docker-compose up -d

docker-logs: ## Show logs from all services
	docker-compose logs -f

# Database commands
db-setup: ## Set up database (migrate and seed)
	@echo "Setting up database..."
	@sleep 5
	pnpm --filter=@crypto-casino/api db:generate
	pnpm --filter=@crypto-casino/api db:migrate
	pnpm --filter=@crypto-casino/api db:seed

db-migrate: ## Run database migrations
	pnpm --filter=@crypto-casino/api db:migrate

db-migrate-dev: ## Run database migrations in development
	pnpm --filter=@crypto-casino/api db:migrate:dev

db-seed: ## Seed database with sample data
	pnpm --filter=@crypto-casino/api db:seed

db-reset: ## Reset database (WARNING: destroys all data)
	pnpm --filter=@crypto-casino/api db:reset

db-studio: ## Open Prisma Studio
	pnpm --filter=@crypto-casino/api db:studio

# Installation commands
install: ## Install all dependencies
	pnpm install

# Linting and formatting
lint: ## Run linters
	pnpm lint

format: ## Format code
	pnpm format

typecheck: ## Run TypeScript checks
	pnpm typecheck

# Monitoring
logs-api: ## Show API logs
	docker-compose logs -f api

logs-web: ## Show web logs
	docker-compose logs -f web

logs-db: ## Show database logs
	docker-compose logs -f postgres

# Quick commands for common tasks
quick-start: install docker-up db-setup ## Quick start for new developers

full-reset: docker-down clean install docker-up db-setup ## Full environment reset

# Production-like commands
prod-build: ## Build for production
	NODE_ENV=production pnpm build

prod-test: ## Run tests in CI mode
	CI=true pnpm test

security-check: ## Run security checks
	pnpm audit

# Backup and restore (for production)
backup-db: ## Backup database
	docker exec crypto-casino-postgres pg_dump -U crypto_casino crypto_casino > backup.sql

restore-db: ## Restore database from backup
	docker exec -i crypto-casino-postgres psql -U crypto_casino crypto_casino < backup.sql