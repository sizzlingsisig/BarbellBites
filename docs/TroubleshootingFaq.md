# TroubleshootingFaq

Common operational and development issues in BarbellBites, with quick diagnosis and fixes.

## RelatedDocuments

- [EnvironmentConfigurationGuide](./EnvironmentConfigurationGuide.md)
- [TestingGuide](./TestingGuide.md)
- [SecurityGuide](./SecurityGuide.md)
- [ArchitectureDoc](./ArchitectureDoc.md)

## Faq

### BackendFailsToStartWithMongoEnvError

Symptom:
- Startup exits with message requiring both `MONGO_URI` and `MONGO_URI_SECONDARY`.

Fix:
- Set both variables in `backend/.env`.
- Confirm Atlas network allowlist includes your current IP.

### DbSeedFails

Symptom:
- `npm run db:seed` fails.

Fix:
- Verify DB credentials and URI format.
- Verify target database access rights.
- Ensure at least one cluster is reachable.

### SyncWorkerFatalStartupError

Symptom:
- Worker throws startup error.

Fix:
- Check `SYNC_FROM` and `SYNC_TO` are different.
- Check `SYNC_MODE` is valid.
- Start with one-off run: `npm run job:sync:once`.

### UnauthorizedAfterLogin

Symptom:
- Protected endpoints return `401`.

Fix:
- Ensure `Authorization` header includes bearer token.
- Verify `JWT_ACCESS_SECRET` matches token issuer environment.
- Confirm refresh endpoint and cookie flow are functional.

### DuplicateFavoriteConflict

Symptom:
- Re-favoriting same recipe fails.

Fix:
- Expected behavior due to unique favorite index (`userId`, `recipeId`).
- Treat duplicate add as idempotent in client UX.

### FrontendCallsWrongApiBase

Symptom:
- Frontend requests target wrong server or version.

Fix:
- Set `VITE_API_BASE_URL` correctly.
- Default is `http://localhost:3000/api/v2` when unset.

### BrunoTestsFailImmediately

Symptom:
- API tests fail before requests complete.

Fix:
- Ensure backend is reachable on configured `PORT`.
- If needed, set `TEST_HEALTH_URL` for runner readiness probe.
- Re-run smoke suites first to isolate environment issues.
