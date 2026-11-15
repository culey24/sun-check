# Uvie — common tasks. Run `make help` to list them.

NPM    ?= npm
PYTHON ?= python3

.DEFAULT_GOAL := help
.PHONY: help install dev build preview typecheck samples clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "} {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

node_modules: package.json package-lock.json
	$(NPM) install
	@touch node_modules

install: node_modules ## Install npm dependencies

dev: node_modules ## Start the dev server (http://localhost:5173)
	$(NPM) run dev

build: node_modules ## Typecheck and build for production into dist/
	$(NPM) run build

preview: build ## Build, then serve the production build
	$(NPM) run preview

typecheck: node_modules ## Run the TypeScript checker
	$(NPM) run typecheck

samples: ## Regenerate sample sticker photos in public/samples/ (needs Pillow + NumPy)
	$(PYTHON) scripts/generate_sample_photos.py

clean: ## Remove build output
	rm -rf dist
