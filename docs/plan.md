# BarbellBites Current Plan

## Completed

- Versioned backend APIs (`v1` and `v2`) for auth, recipes, favorites, and DB health
- Dual MongoDB connection architecture (primary + secondary)
- Read failover and mirrored write behavior in services
- Manual sync commands (`db:sync`, `db:sync:p2s`, `db:sync:s2p`)
- Background sync worker (`job:sync`)
- Automated Bruno execution (`test:*` scripts)

## In Progress

- Keep frontend docs and API contracts aligned with backend behavior
- Improve operational clarity for failover demos and sync recovery

## Next Priorities

1. Frontend contract hardening
   - Ensure all API calls handle both v1 array lists and v2 paginated lists where needed.

2. Frontend UX polish
   - Validate edge states for auth expiration, empty recipe/favorite states, and delete/undo flows.

3. Operational quality
   - Add optional one-command sync verification script (`db:sync:verify`).

4. Deployment readiness
   - Add production environment docs and startup process notes.

## Release Checklist

- [x] `npm run build` passes in backend
- [x] `npm run test:smoke` passes
- [x] `npm run test:edge` passes
- [x] `db:sync` works in both directions
- [ ] Frontend production build and smoke pass
- [ ] Deployment/runbook finalized