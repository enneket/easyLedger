# Makefile for EasyLedger

.PHONY: help dev build check lint clean install

# Default target
help:
	@echo "EasyLedger Development Commands:"
	@echo "  make install    - Install dependencies"
	@echo "  make dev        - Start development server"
	@echo "  make build      - Build for production"
	@echo "  make check      - Run TypeScript type checking"
	@echo "  make lint       - Run ESLint"
	@echo "  make clean      - Clean build artifacts"
	@echo "  make preview    - Preview production build"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

check:
	npm run check

lint:
	npm run lint

clean:
	rm -rf dist
	rm -rf node_modules/.vite

preview:
	npm run preview
