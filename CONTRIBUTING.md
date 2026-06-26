# Contributing to Sahaj PathFinder

Thank you for contributing to Sahaj PathFinder. Please follow the guidelines below to maintain high enterprise software quality.

## Project Setup

The project is split into a Next.js frontend and a FastAPI backend.

To install dependencies for both components, run:
```bash
make install
```

## Running the Application

To run the platform locally, start the dev servers in separate terminals:

1. **Backend**:
   ```bash
   make backend
   ```
   The backend API will run on `http://localhost:8000`. API docs are available at `http://localhost:8000/docs`.

2. **Frontend**:
   ```bash
   make frontend
   ```
   The frontend will run on `http://localhost:3000`.

## Coding Conventions

- **Python (Backend)**:
  - All public functions and routes must have type hints.
  - Follow PEP-8 styling standards. Code styling is enforced with `black` and linted with `ruff`.
  
- **TypeScript (Frontend)**:
  - Strict mode enabled.
  - Do not use `any`. Define proper type interfaces.
  - Code linting is enforced with ESLint.

Lint and format your changes before committing:
```bash
make lint
make format
```

## Branch Naming

Use the following branch prefix conventions:
- `feature/` for new capabilities or design extensions.
- `bugfix/` for resolving defects.
- `refactor/` for non-functional code restructures.
- `chore/` for dependencies or tooling updates.
