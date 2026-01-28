# Get GID and UID for Docker build
GID := $(shell id -g)
UID := $(shell id -u)

# Define directories
BASE_DIR := $(shell pwd)
DOCKER_DIR := $(BASE_DIR)/infra/docker
COMPOSE_DIR := $(BASE_DIR)/infra/compose

# Docker Compose files
COMPOSE_DEV := $(COMPOSE_DIR)/compose.dev.yml
COMPOSE_PROD := $(COMPOSE_DIR)/compose.prod.yml
COMPOSE_LOCAL := $(COMPOSE_DIR)/compose.local.yml

# Environment files
ENV_FILE := $(BASE_DIR)/.env.local
ENV_EXAMPLE_FILE ?= $(BASE_DIR)/.env.example

# Project name
PROJECT_NAME := devxhub_nextjs_shadcn_boilerplate

# Common Docker Compose options
DC_REMOVE_ORPHANS := --remove-orphans
DC_BUILD_ARGS := --pull --no-cache

# Docker Compose command shortcuts with env file
DOCKER_COMPOSE_BASE := docker compose -p $(PROJECT_NAME) --env-file $(ENV_FILE)
DOCKER_COMPOSE_DEV := $(DOCKER_COMPOSE_BASE) -f $(COMPOSE_DEV)
DOCKER_COMPOSE_PROD := $(DOCKER_COMPOSE_BASE) -f $(COMPOSE_PROD)
DOCKER_COMPOSE_LOCAL := $(DOCKER_COMPOSE_BASE) -f $(COMPOSE_LOCAL)

# Docker image details
DOCKER_IMAGE := dxhltd/nextjs-shadcn-boilerplate
DOCKERFILE_PROD := $(DOCKER_DIR)/Dockerfile.prod
DOCKERFILE_LOCAL := $(DOCKER_DIR)/Dockerfile.local
DOCKER_IMAGE_TAG ?= local

# Colors for pretty output
RED := \033[31m
GREEN := \033[32m
YELLOW := \033[33m
CYAN := \033[36m
RESET := \033[0m

# Targets
.PHONY: all dev prod local stop clean logs rebuild push push-local build build-local \
        restart-dev restart-prod restart-local pull pull-local test shell help check-env ps \
        validate-compose health-check-dev health-check-prod health-check-local \
        deps-check deps-update backup restore new-route

# Default target
all: help

# Validation
validate-compose:
	@for file in $(COMPOSE_DEV) $(COMPOSE_PROD) $(COMPOSE_LOCAL); do \
		if [ ! -f $$file ]; then \
			echo "$(RED)Missing compose file: $$file$(RESET)"; \
			exit 1; \
		fi \
	done

# Ensure .env file exists
check-env: ## Check if .env file exists and create if missing
	@if [ ! -f $(ENV_FILE) ]; then \
		if [ -f $(ENV_EXAMPLE_FILE) ]; then \
			cp $(ENV_EXAMPLE_FILE) $(ENV_FILE); \
			echo "$(YELLOW)Created $(ENV_FILE) from $(ENV_EXAMPLE_FILE)$(RESET)"; \
			echo "$(YELLOW)Please review and update $(ENV_FILE) with your settings$(RESET)"; \
		else \
			echo "$(RED)Error: Neither $(ENV_FILE) nor $(ENV_EXAMPLE_FILE) found$(RESET)"; \
			echo "$(RED)Please create $(ENV_FILE) manually or provide $(ENV_EXAMPLE_FILE)$(RESET)"; \
			exit 1; \
		fi \
	else \
		if ! grep -q "." $(ENV_FILE); then \
			echo "$(RED)Warning: $(ENV_FILE) appears to be empty$(RESET)"; \
			exit 1; \
		fi \
	fi; \
	if grep -q "^UID=" $(ENV_FILE); then \
		sed -i.bak 's/^UID=.*/UID=$(UID)/' $(ENV_FILE); \
	else \
		echo "UID=$(UID)" >> $(ENV_FILE); \
	fi; \
	if grep -q "^GID=" $(ENV_FILE); then \
		sed -i.bak 's/^GID=.*/GID=$(GID)/' $(ENV_FILE); \
	else \
		echo "GID=$(GID)" >> $(ENV_FILE); \
	fi; \
	rm -f $(ENV_FILE).bak; \
	echo "$(GREEN)Updated $(ENV_FILE) with UID=$(UID) and GID=$(GID)$(RESET)"

# Development environment
dev: check-env validate-compose ## Start the development environment
	@echo "$(CYAN)Starting development environment...$(RESET)"
	@$(DOCKER_COMPOSE_DEV) pull
	@$(DOCKER_COMPOSE_DEV) build --build-arg GID=$(GID) --build-arg UID=$(UID)
	@$(DOCKER_COMPOSE_DEV) up

# Production environment
prod: check-env validate-compose ## Start the production environment
	@echo "$(CYAN)Starting production environment...$(RESET)"
	@$(DOCKER_COMPOSE_PROD) pull
	@$(DOCKER_COMPOSE_PROD) down
	@$(DOCKER_COMPOSE_PROD) up -d

# Local production-like environment
local: check-env validate-compose ## Start the production-like environment locally
	@echo "$(CYAN)Starting local production-like environment...$(RESET)"
	@$(DOCKER_COMPOSE_LOCAL) pull
	@$(DOCKER_COMPOSE_LOCAL) down
	@$(DOCKER_COMPOSE_LOCAL) up -d

# Stop services
stop-dev: check-env ## Stop development services
	@echo "$(CYAN)Stopping development services...$(RESET)"
	@$(DOCKER_COMPOSE_DEV) down

stop-prod: check-env ## Stop production services
	@echo "$(CYAN)Stopping production services...$(RESET)"
	@$(DOCKER_COMPOSE_PROD) down

stop-local: check-env ## Stop local production-like services
	@echo "$(CYAN)Stopping local services...$(RESET)"
	@$(DOCKER_COMPOSE_LOCAL) down

stop: stop-dev stop-prod stop-local ## Stop all running services

# Clean up Docker volumes
clean-dev: check-env ## Clean development environment
	@echo "$(YELLOW)Cleaning development environment...$(RESET)"
	@$(DOCKER_COMPOSE_DEV) down -v

clean-prod: check-env ## Clean production environment
	@echo "$(YELLOW)Cleaning production environment...$(RESET)"
	@$(DOCKER_COMPOSE_PROD) down -v

clean-local: check-env ## Clean local production-like environment
	@echo "$(YELLOW)Cleaning local environment...$(RESET)"
	@$(DOCKER_COMPOSE_LOCAL) down -v

clean: clean-dev clean-prod clean-local ## Clean all environments

# Show running containers
ps: ## Show running containers
	@echo "$(CYAN)Development containers:$(RESET)"
	@$(DOCKER_COMPOSE_DEV) ps
	@echo "$(CYAN)Production containers:$(RESET)"
	@$(DOCKER_COMPOSE_PROD) ps
	@echo "$(CYAN)Local containers:$(RESET)"
	@$(DOCKER_COMPOSE_LOCAL) ps

# Health checks
health-check-dev: ## Check health of development services
	@echo "$(CYAN)Checking development services health...$(RESET)"
	@$(DOCKER_COMPOSE_DEV) ps --format json | jq -r '.[] | select(.State != "running") | .Name' | \
		if [ -n "$$(cat)" ]; then \
			echo "$(RED)Some services are not running:$(RESET)"; cat; exit 1; \
		else \
			echo "$(GREEN)All services are running$(RESET)"; \
		fi

health-check-prod: ## Check health of production services
	@echo "$(CYAN)Checking production services health...$(RESET)"
	@$(DOCKER_COMPOSE_PROD) ps --format json | jq -r '.[] | select(.State != "running") | .Name' | \
		if [ -n "$$(cat)" ]; then \
			echo "$(RED)Some services are not running:$(RESET)"; cat; exit 1; \
		else \
			echo "$(GREEN)All services are running$(RESET)"; \
		fi

health-check-local: ## Check health of local services
	@echo "$(CYAN)Checking local services health...$(RESET)"
	@$(DOCKER_COMPOSE_LOCAL) ps --format json | jq -r '.[] | select(.State != "running") | .Name' | \
		if [ -n "$$(cat)" ]; then \
			echo "$(RED)Some services are not running:$(RESET)"; cat; exit 1; \
		else \
			echo "$(GREEN)All services are running$(RESET)"; \
		fi

# Restart services
restart-dev: stop-dev dev ## Restart development services
restart-prod: stop-prod prod ## Restart production services
restart-local: stop-local local ## Restart local production-like services

# Rebuild images
rebuild: check-env ## Rebuild development images
	@echo "$(CYAN)Rebuilding development images...$(RESET)"
	@$(DOCKER_COMPOSE_DEV) build $(DC_BUILD_ARGS)

# Build Docker images
build: ## Build production image
	@if [ -z "$$tag" ]; then \
		read -p "Enter image tag (default: latest): " tag; \
		tag=$${tag:-latest}; \
	fi; \
	echo "$(CYAN)Building image $(DOCKER_IMAGE):$$tag$(RESET)"; \
	export tag=$$tag; \
	docker buildx build \
		--platform linux/amd64,linux/arm64 \
		--tag $(DOCKER_IMAGE):$$tag \
		--cache-to mode=max,type=registry,ref=$(DOCKER_IMAGE):$$tag-cache \
		--cache-from type=registry,ref=$(DOCKER_IMAGE):$$tag-cache \
		-f $(DOCKERFILE_PROD) $(BASE_DIR) || \
		{ echo "$(RED)Build failed$(RESET)"; exit 1; }

# Push Docker images
push: check-env ## Build and push production image
	@if [ -z "$$tag" ]; then \
		read -p "Enter image tag (default: latest): " tag; \
		tag=$${tag:-latest}; \
	fi; \
	echo "$(CYAN)Building image $(DOCKER_IMAGE):$$tag$(RESET)"; \
	export tag=$$tag; \
	docker buildx build \
		--push \
		--platform linux/amd64,linux/arm64 \
		--tag $(DOCKER_IMAGE):$$tag \
		--cache-to mode=max,type=registry,ref=$(DOCKER_IMAGE):$$tag-cache \
		--cache-from type=registry,ref=$(DOCKER_IMAGE):$$tag-cache \
		-f $(DOCKERFILE_PROD) $(BASE_DIR) || \
		{ echo "$(RED)Build failed$(RESET)"; exit 1; }

push-local: check-env ## Build production-like image for local use
	@if [ -z "$$tag" ]; then \
		read -p "Enter image tag (default: local): " tag; \
		tag=$${tag:-local}; \
	fi; \
	echo "$(CYAN)Building local image $(DOCKER_IMAGE):$$tag$(RESET)"; \
	export tag=$$tag; \
	docker buildx build \
		--push \
		--platform linux/amd64,linux/arm64 \
		--tag $(DOCKER_IMAGE):$$tag \
		-f $(DOCKERFILE_LOCAL) $(BASE_DIR) || \
		{ echo "$(RED)Build failed$(RESET)"; exit 1; }

# Pull Docker images
pull: ## Pull production image
	@read -p "Enter image tag (default: latest): " tag; \
	tag=$${tag:-latest}; \
	echo "$(CYAN)Pulling image $(DOCKER_IMAGE):$$tag$(RESET)"; \
	@docker pull $(DOCKER_IMAGE):$$tag

pull-local: ## Pull local image
	@read -p "Enter image tag (default: local): " tag; \
	tag=$${tag:-local}; \
	echo "$(CYAN)Pulling local image $(DOCKER_IMAGE):$$tag$(RESET)"; \
	@docker pull $(DOCKER_IMAGE):$$tag

# Dependency management
deps-check: ## Check for outdated dependencies
	@echo "$(CYAN)Checking for outdated dependencies...$(RESET)"
	@$(DOCKER_COMPOSE_DEV) exec django pip list --outdated

deps-update: ## Update project dependencies
	@echo "$(CYAN)Updating dependencies...$(RESET)"
	@$(DOCKER_COMPOSE_DEV) exec django pip install --upgrade -r requirements/production.txt

# Database management
backup: ## Backup database
	@echo "$(CYAN)Creating database backup...$(RESET)"
	@$(DOCKER_COMPOSE_PROD) exec postgres pg_dump -U postgres > backup_$$(date +%Y%m%d_%H%M%S).sql && \
		echo "$(GREEN)Backup created successfully$(RESET)" || \
		{ echo "$(RED)Backup failed$(RESET)"; exit 1; }

restore: ## Restore database from backup
	@read -p "Enter backup file: " file; \
	if [ -f "$$file" ]; then \
		echo "$(CYAN)Restoring from $$file...$(RESET)"; \
		$(DOCKER_COMPOSE_PROD) exec -T postgres psql -U postgres < $$file && \
		echo "$(GREEN)Database restored successfully$(RESET)" || \
		{ echo "$(RED)Restore failed$(RESET)"; exit 1; }; \
	else \
		echo "$(RED)Backup file not found: $$file$(RESET)"; \
		exit 1; \
	fi

# View logs for any environment
logs: ## View logs (dev/prod/local)
	@read -p "Enter environment (dev/prod/local, default: prod): " env; \
	env=$${env:-prod}; \
	case $$env in \
		dev) cmd="$(DOCKER_COMPOSE_DEV) logs -f" ;; \
		prod) cmd="$(DOCKER_COMPOSE_PROD) logs -f" ;; \
		local) cmd="$(DOCKER_COMPOSE_LOCAL) logs -f" ;; \
		*) echo "$(YELLOW)Invalid environment: $$env. Use dev, prod, or local.$(RESET)"; exit 1 ;; \
	esac; \
	echo "$(CYAN)Showing logs for $$env environment...$(RESET)"; \
	eval $$cmd

# Open shell in Django container
shell: check-env ## Open shell in django container
	@echo "$(CYAN)Opening shell in django container...$(RESET)"
	@$(DOCKER_COMPOSE_DEV) exec django /bin/bash

# Generate new route with complete module structure
new-route: ## Generate a new route with complete module structure
	@echo "$(CYAN)Creating new route with complete module structure...$(RESET)"
	@read -p "Enter route name (e.g., manage-products): " route_name; \
	if [ -z "$$route_name" ]; then \
		echo "$(RED)Route name cannot be empty$(RESET)"; \
		exit 1; \
	fi; \
	component_name=$$(echo $$route_name | sed 's/-\([a-z]\)/\U\1/g' | sed 's/^\([a-z]\)/\U\1/'); \
	route_dir="apps/web/src/app/(protected)/$$route_name"; \
	module_dir="apps/web/src/modules/$$route_name"; \
	service_dir="apps/web/src/services/$$route_name"; \
	if [ -d "$$route_dir" ]; then \
		echo "$(RED)Route '$$route_name' already exists$(RESET)"; \
		exit 1; \
	fi; \
	echo "$(CYAN)Creating route directory: $$route_dir$(RESET)"; \
	mkdir -p "$$route_dir"; \
	echo "$(CYAN)Creating module directory: $$module_dir$(RESET)"; \
	mkdir -p "$$module_dir"; \
	echo "$(CYAN)Creating service directory: $$service_dir$(RESET)"; \
	mkdir -p "$$service_dir"; \
	echo "$(CYAN)Creating page.tsx file$(RESET)"; \
	printf '"use client";\n\nimport { useTranslation } from "react-i18next";\n\nimport dynamic from "next/dynamic";\n\nimport { Breadcrumb, CircularLoader, PageContainer } from "@/shared/components";\n\nconst %sList = dynamic(\n  () => import("@/modules/%s").then((mod) => mod.%sList),\n  {\n    loading: () => <CircularLoader />,\n  }\n);\n\nconst %s = () => {\n  const { t } = useTranslation();\n\n  const BCrumb = [\n    {\n      to: "/",\n      title: t("breadcrumb.home"),\n    },\n    {\n      title: t("menu.%s"),\n    },\n  ];\n\n  return (\n    <PageContainer\n      title={t("menu.%s")}\n      description="View and manage %s"\n    >\n      <Breadcrumb title={t("menu.%s")} items={BCrumb} />\n      <%sList />\n    </PageContainer>\n  );\n};\n\nexport default %s;\n' "$$component_name" "$$route_name" "$$component_name" "$$component_name" "$$route_name" "$$route_name" "$$route_name" "$$route_name" "$$component_name" "$$component_name" > "$$route_dir/page.tsx"; \
	echo "$(CYAN)Creating module components...$(RESET)"; \
	$(MAKE) create-module-components route_name="$$route_name" component_name="$$component_name"; \
	echo "$(GREEN)Route '$$route_name' with complete module structure created successfully!$(RESET)"; \
	echo "$(YELLOW)Next steps:$(RESET)"; \
	echo "  1. Add translation keys to: apps/web/src/languages/en.json"; \
	echo "  2. Add menu item to database with routePath: '$$route_name'"; \
	echo "  3. Add icon mapping to: apps/web/src/utils/iconMap.ts"; \
	echo "  4. Update API endpoints in service files"

# Helper target to create module components
create-module-components:
	@route_name=$(route_name); \
	component_name=$(component_name); \
	echo "$(CYAN)Running component generator script...$(RESET)"; \
	./route-generator.sh "$$route_name" "$$component_name"

# Help menu (auto-generated)
help: ## Show this help message
	@echo "$(CYAN)Available commands:$(RESET)"
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = "(:|##)"}; {printf "  $(GREEN)%-20s$(RESET) %s\n", $$1, $$3}'
