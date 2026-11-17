# Gravitational Camera: one place to set up, build and test everything.
#
#   make doctor     check the system tools, with how to install what is missing
#   make setup      Python environment (.venv), the site's packages, the test browser
#   make dev        the site at http://localhost:5173
#   make test       everything CI runs: reference, site checks, unit and end-to-end tests
#   make paper      the PDF, paper/main.pdf
#
# `make help` lists every target. Nothing here needs sudo; system tools (Node, pandoc, TeX, poppler) are
# installed by you, and `make doctor` says how.

SHELL := /bin/bash
.DEFAULT_GOAL := help

VENV    ?= .venv
PYTHON  ?= python3
PY      := $(VENV)/bin/python
# pnpm itself, or the version pinned in app/package.json through corepack (ships with Node)
PNPM    := $(shell command -v pnpm >/dev/null 2>&1 && echo pnpm || echo corepack pnpm)

.PHONY: help doctor setup setup-python setup-site setup-browser setup-3d \
        dev build preview test test-reference test-site test-unit test-e2e check lint format \
        fixtures paper site-pdf figures figures-3d clean distclean

help: ## List the targets
	@grep -hE '^[a-zA-Z0-9_-]+:.*## ' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*## "}; {printf "  \033[1m%-16s\033[0m %s\n", $$1, $$2}'

# --- checking the system ------------------------------------------------------------------------------------------

define need
	@if command -v $(1) >/dev/null 2>&1; then \
		printf "  \033[32mok\033[0m       %-12s %s\n" "$(1)" "$$($(1) $(2) 2>&1 | head -n1)"; \
	else \
		printf "  \033[31mmissing\033[0m  %-12s %s\n" "$(1)" "$(3)"; \
	fi
endef

doctor: ## Check the tools each part needs
	@echo "Python reference (needed for tests and figures):"
	$(call need,$(PYTHON),--version,Python 3.11 or later: brew install python / apt install python3 python3-venv)
	@echo "Site (needed for make dev, build, test):"
	$(call need,node,--version,Node 22 or later: https://nodejs.org or brew install node@22)
	$(call need,pandoc,--version,converts the paper for the site: brew install pandoc / apt install pandoc)
	@if command -v pnpm >/dev/null 2>&1; then \
		printf "  \033[32mok\033[0m       %-12s %s\n" pnpm "$$(pnpm --version)"; \
	else \
		printf "  \033[33mvia\033[0m      %-12s %s\n" pnpm "corepack (comes with Node) will fetch the pinned version"; \
	fi
	@echo "Paper PDF (needed for make paper):"
	$(call need,latexmk,--version,TeX Live with REVTeX: brew install --cask mactex / apt install texlive-latex-extra texlive-publishers texlive-fonts-recommended lmodern latexmk)
	@echo "Figures (only to redraw them):"
	$(call need,latex,--version,comes with TeX Live; the figures also need cm-super and dvipng)
	$(call need,pdftocairo,-v,poppler: brew install poppler / apt install poppler-utils)

# --- setting up ---------------------------------------------------------------------------------------------------

setup: setup-python setup-site setup-browser ## Set up everything (Python env, site packages, test browser)
	@echo
	@echo "Set up. Next: make dev (the site), make test (all checks), make paper (the PDF)."

$(PY):
	$(PYTHON) -m venv $(VENV)
	$(PY) -m pip install --upgrade pip

setup-python: $(PY) ## Create .venv and install the reference implementation (editable) with test and figure extras
	$(PY) -m pip install -e 'reference[test,figures]'

setup-site: ## Install the site's packages
	cd app && $(PNPM) install --frozen-lockfile

setup-browser: ## Download Playwright's Chromium for the end-to-end tests (on Linux you may also need: pnpm exec playwright install-deps)
	cd app && $(PNPM) exec playwright install chromium

setup-3d: ## Install the packages for the figures modelled in 3D (figures3d/)
	cd figures3d && npm install

# --- the site -----------------------------------------------------------------------------------------------------

dev: ## Run the site locally with live reload
	cd app && $(PNPM) dev

build: site-pdf ## Build the static site into app/build, with the paper's PDF
	cd app && $(PNPM) run build

preview: build ## Serve the built site
	cd app && $(PNPM) run preview

# --- tests --------------------------------------------------------------------------------------------------------

test: test-reference test-site ## Run every test, as CI does

test-reference: ## The Python reference tests
	cd reference && ../$(PY) -m pytest

test-site: check test-unit test-e2e ## Types, lint, unit and end-to-end tests of the site

check: ## Type check and lint the site
	cd app && $(PNPM) run check && $(PNPM) run lint

lint: ## Lint the site
	cd app && $(PNPM) run lint

format: ## Format the site's code with Prettier
	cd app && $(PNPM) run format

test-unit: ## The engine's physics against reference/fixtures
	cd app && $(PNPM) exec vitest --run

test-e2e: ## The pages and the shaders in a headless browser (set PW_CHROMIUM to use another Chromium)
	cd app && $(PNPM) exec playwright test --trace off

fixtures: ## Regenerate the fixtures the engine is tested against (CI checks they are up to date)
	cd reference && ../$(PY) -m gravcam.export_fixtures

# --- the paper and its figures ------------------------------------------------------------------------------------

paper: ## Build the PDF, paper/main.pdf
	cd paper && latexmk -pdf -interaction=nonstopmode -halt-on-error main.tex

site-pdf: paper ## Copy the PDF where the site serves it
	cp paper/main.pdf app/static/gravitational-camera.pdf

figures: ## Redraw the paper's charts and renders from the reference implementation
	$(PY) paper/figures/make_figures.py
	$(PY) paper/figures/charts.py
	@for f in paper/figures/fig_*.py; do echo "$(PY) $$f"; $(PY) $$f || exit 1; done

figures-3d: ## Render the figures modelled in 3D (after make figures and make setup-3d)
	cd figures3d && node render.mjs --final tidal sky-integral quadrupole line-integral earth-glow

# --- cleaning -----------------------------------------------------------------------------------------------------

clean: ## Remove build output and caches (keeps .venv and node_modules)
	cd paper && (latexmk -c >/dev/null 2>&1 || true) && rm -f main.bbl
	rm -rf app/build app/.svelte-kit app/test-results
	find . -name __pycache__ -type d -prune -not -path './app/node_modules/*' -exec rm -rf {} +
	rm -rf reference/.pytest_cache

distclean: clean ## Also remove .venv, node_modules and the PDF
	rm -rf $(VENV) app/node_modules figures3d/node_modules paper/main.pdf app/static/gravitational-camera.pdf
