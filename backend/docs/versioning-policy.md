# API Versioning Policy

This document defines how versioning should be applied in this backend.

## Goals

- Keep API changes safe for existing clients.
- Avoid unnecessary code duplication.
- Make it obvious where v1 and v2 logic lives.

## Current Structure

- Routing entrypoint: `src/routes/api.ts`
- Versioned routes:
  - `src/routes/v1/*`
  - `src/routes/v2/*`
- Versioned request validation:
  - `src/requests/*Requests.ts` (v1)
  - `src/requests/*RequestsV2.ts` (v2, when needed)
- Controllers:
  - Shared controller by default
  - `*ControllerV2.ts` only when endpoint behavior differs by version
- Services and models:
  - Shared by default unless domain behavior or persistence schema diverges

## Versioning Rules

### 1) Always version at the API boundary first
Create new route files under `src/routes/vN/`.

Create new request validators when contracts differ:
- path/query/body fields
- required vs optional fields
- enum constraints

### 2) Only version controllers when behavior changes
Use separate `*ControllerV2.ts` if the response shape or orchestration logic differs.

If behavior is the same, reuse the existing controller.

### 3) Keep services shared unless business logic diverges
Create `*ServiceV2.ts` only if v2 requires different business rules.

Examples:
- v1 calculates nutrition one way, v2 another way
- v2 introduces new ownership/permission logic

### 4) Keep models shared unless persistence diverges
Create a new model only if v2 needs a different collection/schema lifecycle.

If schema changes are additive or compatible, keep one model and migrate data.

### 5) Use migrations for schema/data transitions
When changing stored data rules:
- add migration in `src/migrations/`
- run with `npm run db:migrate`
- use `npm run db:seed` only for fresh reset seed workflows

## Folder Conventions

- Routes:
  - `src/routes/v1/authRoutes.ts`
  - `src/routes/v2/authRoutes.ts`
- Requests:
  - `src/requests/authRequests.ts`
  - `src/requests/authRequestsV2.ts`
- Controllers:
  - `src/controllers/authController.ts`
  - `src/controllers/authControllerV2.ts` (only if needed)
- Services:
  - `src/services/authService.ts`
  - `src/services/authServiceV2.ts` (only if needed)

## Checklist for New API Version

1. Add base path and route registration in `src/routes/api.ts`.
2. Add `src/routes/vN/*` route files.
3. Add `*RequestsVn.ts` validators when contract changes.
4. Add `*ControllerVn.ts` only if behavior changes.
5. Reuse services/models unless divergence is real.
6. Add Bruno suites under `BarbellBites/VN/Smoke` and `BarbellBites/VN/Edge`.
7. Add npm scripts for new suites in `backend/package.json`.
8. Add migration(s) if schema/data changed.

## Deprecation Guidance

- Keep old versions running until clients migrate.
- Mark legacy endpoints in docs and Bruno collections.
- Remove old versions in a dedicated cleanup release, not mixed with feature changes.
