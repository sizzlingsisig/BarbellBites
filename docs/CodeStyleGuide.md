# CodeStyleGuide

Coding standards for BarbellBites backend (TypeScript + NodeNext) and frontend (TypeScript + React).

## RelatedDocuments

- [TestingGuide](./TestingGuide.md)
- [SecurityGuide](./SecurityGuide.md)
- [ArchitectureDoc](./ArchitectureDoc.md)

## BaselineRules

- Use TypeScript everywhere.
- Favor strict typing and explicit interfaces/types.
- Keep modules small and responsibility-focused.
- Prefer named exports for reusable helpers and services.

## BackendStyle

- Backend module format: NodeNext ESM (`backend/tsconfig.json`).
- Compiler strictness: `strict: true`.
- Use shared `AppError` for operational failures.
- Keep controllers thin, move business logic to services.
- Validate request payloads with Zod schemas in `backend/src/requests`.

## FrontendStyle

- ESLint source: `frontend/eslint.config.js`.
- Lint presets include:
- `@eslint/js` recommended
- `typescript-eslint` recommended
- `react-hooks` recommended
- `react-refresh` Vite config
- Components and hooks use `PascalCase` and `camelCase` naming.
- Keep API calls isolated under `frontend/src/api`.

## NamingConventions

- Files:
- React components: `PascalCase.tsx`
- Hooks: `useSomething.ts`
- Services/helpers: `camelCase.ts`
- Variables/functions: `camelCase`
- Types/interfaces: `PascalCase`
- Constants: `UPPER_SNAKE_CASE` for process constants

## PatternsToFollow

- Shared middleware for cross-cutting concerns (auth, ownership, validation, errors).
- Version API contracts at route/request/controller boundary first.
- Keep failover handling in service/util layers, not in route handlers.
- Use centralized Axios instance and interceptors for auth refresh.
