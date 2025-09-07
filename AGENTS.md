# Repository Guidelines

## Project Structure & Module Organization
- `src/`: application/library code (e.g., `src/genqr/`).
- `tests/`: automated tests mirroring `src/` layout.
- `assets/`: sample input/output (e.g., QR examples).
- `scripts/`: helper scripts for dev tasks.
- `docs/` (optional): architecture notes and usage examples.

Example:
```
src/
  genqr/
    __init__.py
    cli.py
tests/
  test_cli.py
assets/
  examples/
```

## Build, Test, and Development Commands
Use Make targets if present; otherwise use language-native tools.
- Build: `make build` (wrapper) or `python -m build` / `npm run build`.
- Test: `make test` or `pytest -q` / `npm test`.
- Lint/Format: `make lint format` or `ruff . && black .` / `eslint . && prettier -w .`.
- Run locally: `python -m genqr` or `python src/genqr/cli.py` (for a CLI).

## Coding Style & Naming Conventions
- Indentation: 4 spaces; UTF-8; LF line endings.
- Python: format with Black, import-order via isort, lint with Ruff.
- JavaScript/TypeScript (if present): format with Prettier, lint with ESLint.
- Naming: modules `snake_case`, classes `PascalCase`, functions/vars `snake_case`, constants `UPPER_SNAKE_CASE`.
- File layout: one public class/module per file; keep functions under 50–75 LOC when practical.

## Testing Guidelines
- Framework: `pytest` (Python) or `jest/vitest` (JS/TS).
- Structure: mirror `src/` in `tests/`; name tests `test_*.py` or `*.test.ts`.
- Coverage: target ≥90% on new/changed code; add regression tests for bugs.
- Run: `pytest -q --maxfail=1 --durations=10`.

## Commit & Pull Request Guidelines
- Commits: follow Conventional Commits, e.g., `feat: add PNG export` or `fix(cli): handle empty input`.
- PRs: include clear description, linked issue, reproduction steps, and before/after notes; attach screenshots for CLI output or generated images when helpful.
- Checks: PRs should pass build, lint, tests, and include unit tests for new logic.

## Security & Configuration
- Configuration via environment variables; provide `.env.example` (no secrets).
- Do not commit API keys or generated artifacts. Add to `.gitignore` (e.g., `dist/`, `.venv/`, `*.png` test outputs).
