# EnvironmentConfigurationGuide

Environment variables, runtime options, and configuration handling for backend and frontend.

## RelatedDocuments

- [ArchitectureDoc](./ArchitectureDoc.md)
- [DatabaseSchema](./DatabaseSchema.md)
- [SecurityGuide](./SecurityGuide.md)
- [TroubleshootingFaq](./TroubleshootingFaq.md)

## BackendEnvironmentVariables

### Required

- `MONGO_URI`: primary MongoDB connection URI
- `MONGO_URI_SECONDARY`: secondary MongoDB connection URI
- `JWT_ACCESS_SECRET`: secret for access token signing/verification
- `JWT_REFRESH_SECRET`: secret for refresh token signing/verification

### CommonOptional

- `MONGO_DB_NAME` (default `barbellbites`)
- `PORT` (default `3000`)
- `FRONTEND_ORIGIN` (default `http://localhost:5173`, comma-separated allowed)
- `NODE_ENV` (`development` or `production`)
- `JWT_ACCESS_EXPIRES_IN` (default `15m`)
- `JWT_REFRESH_EXPIRES_IN` (default `30d`)
- `TEST_HEALTH_URL` (used by Bruno runner)

### SyncWorkerVariables

- `SYNC_ENABLED` (default true in worker parser)
- `SYNC_INTERVAL_MINUTES`
- `SYNC_FROM` (`primary` or `secondary`)
- `SYNC_TO` (`primary` or `secondary`)
- `SYNC_MODE` (`upsert` or `replace`)

## FrontendEnvironmentVariables

- `VITE_API_BASE_URL` (default `http://localhost:3000/api/v2`)

## ExampleBackendEnv

```env
PORT=3000
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:5173

MONGO_URI=<primary-cluster-uri>
MONGO_URI_SECONDARY=<secondary-cluster-uri>
MONGO_DB_NAME=BarbellBites

JWT_ACCESS_SECRET=<long-random-secret>
JWT_REFRESH_SECRET=<long-random-secret>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

SYNC_ENABLED=true
SYNC_INTERVAL_MINUTES=5
SYNC_FROM=primary
SYNC_TO=secondary
SYNC_MODE=upsert
```

## ConfigOptionsAndBehavior

- CORS origins are parsed from `FRONTEND_ORIGIN` in `backend/src/server.ts`.
- Refresh token cookie is HTTP-only and `secure` in production (`backend/src/utils/refreshCookie.ts`).
- Backend exits early when DB URIs are missing (`backend/src/config/db.ts`).

## SecretsManagement

- Never commit `.env` values to source control.
- Use unique secrets per environment (dev/staging/prod).
- Rotate `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` when compromise is suspected.
- Prefer secret stores in hosted environments (for example: cloud secret manager, CI secrets).
- Restrict database users to least privilege required.
