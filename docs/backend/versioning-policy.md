# API Versioning Policy

This document defines how versioning is handled in `backend/`.

## Goals

- Preserve compatibility for existing clients.
- Keep v1 and v2 behavior explicit at the API boundary.
- Keep test coverage per version via Bruno smoke and edge suites.

## Current Versioned Layout

- Route registration: `src/routes/api.ts`
- Versioned route modules:
  - `src/routes/v1/*.ts`
  - `src/routes/v2/*.ts`
- Versioned requests:
  - `src/requests/v1/*.ts`
  - `src/requests/v2/*.ts`
- Versioned controllers:
  - `src/controllers/v1/*.ts`
  - `src/controllers/v2/*.ts`
- Versioned services/models are allowed when behavior diverges:
  - `src/services/v1|v2/*.ts`
  - `src/models/v1|v2/*.ts`

## Versioning Rules

### 1) Version at the API boundary first

Add or change endpoints under `src/routes/vN/` and wire them in `src/routes/api.ts`.

### 2) Version request schemas for contract differences

If query/body/path validation differs, use separate request schemas in `src/requests/vN/`.

### 3) Version controllers/services when response shape or behavior differs

Current example:
- v2 recipe list endpoints return paginated objects (`{ items, pagination }`)
- v1 recipe list endpoints currently return arrays

### 4) Keep persistence compatibility explicit

If storage behavior diverges, version service/model logic intentionally rather than hiding changes behind conditionals.

### 5) Use migrations for schema/data transitions

- Add migration in `src/migrations/`
- Execute with `npm run db:migrate`
- Use `npm run db:seed` only for reset + seed flows

## Checklist for a New Version (vN)

1. Register base paths in `src/routes/api.ts`.
2. Add route files in `src/routes/vN/`.
3. Add validators in `src/requests/vN/`.
4. Add controllers in `src/controllers/vN/`.
5. Add service/model variants only when needed.
6. Add Bruno suites in `BarbellBites/VN/Smoke` and `BarbellBites/VN/Edge`.
7. Add scripts in `backend/package.json`:
   - `bru:vN:smoke`, `bru:vN:edge`
   - `test:vN:smoke`, `test:vN:edge`
8. Run `npm run test:all`.

## Deprecation Guidance

- Keep old versions until clients are migrated.
- Mark deprecated endpoints in docs and Bruno collections.
- Remove versions in dedicated cleanup releases.
