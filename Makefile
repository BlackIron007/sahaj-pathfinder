.PHONY: install frontend backend dev lint format

install:
	cd backend && python -m venv .venv
	backend\.venv\Scripts\pip install -r backend/requirements.txt
	cd backend && ..\backend\.venv\Scripts\pip install -e .
	cd frontend && npm install --legacy-peer-deps

frontend:
	cd frontend && npm run dev

backend:
	backend\.venv\Scripts\python -m uvicorn backend.main:app --port 8000 --reload

dev:
	@echo "To run the application, start both services in separate terminals:"
	@echo "  Terminal 1: make backend"
	@echo "  Terminal 2: make frontend"

lint:
	backend\.venv\Scripts\python -m ruff check backend
	cd frontend && npm run lint

format:
	backend\.venv\Scripts\python -m black backend
	backend\.venv\Scripts\python -m ruff check --fix backend
	cd frontend && npx prettier --write "app/**/*.tsx" "components/**/*.tsx" "providers/**/*.tsx"
