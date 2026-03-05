# Sync Playbook (No Mongosync)

This runbook covers dual-cluster sync operations using built-in scripts only.

All commands run from `backend/`.

## 1) Prerequisites

1. Atlas network access allows your current IP.
2. `backend/.env` includes:

```env
MONGO_URI=<primary-cluster-uri>
MONGO_URI_SECONDARY=<secondary-cluster-uri>
MONGO_DB_NAME=BarbellBites
```

3. Install dependencies:

```bash
npm install
```

## 2) Manual Sync Commands

### One-off sync (custom)

```bash
npm run db:sync -- --from=primary --to=secondary --mode=upsert
```

### Full replace helpers

```bash
npm run db:sync:p2s
npm run db:sync:s2p
```

### Modes

- `upsert`: non-destructive merge by `_id`
- `replace`: wipes target DB and copies source

## 3) Background Sync Worker

Use this for periodic reconciliation.

### 3.1 Worker env vars

```env
SYNC_ENABLED=true
SYNC_INTERVAL_MINUTES=5
SYNC_FROM=primary
SYNC_TO=secondary
SYNC_MODE=upsert
```

### 3.2 Run worker

```bash
npm run job:sync
```

Worker behavior:

- Runs one sync immediately on startup
- Repeats every `SYNC_INTERVAL_MINUTES`
- Skips overlapping cycles if previous run is still active

### 3.3 One-off worker-style run

```bash
npm run job:sync:once
```

## 4) Demo Sequence

1. `npm run db:seed`
2. `npm run test:smoke`
3. Simulate primary outage
4. Validate reads still work via app/Bruno
5. Restore primary
6. Reconcile:
	- `npm run db:sync:s2p` if secondary has latest writes
	- or `npm run db:sync:p2s` if primary is source of truth
7. Re-run `npm run test:smoke`

## 5) Troubleshooting

### `npm run db:seed` fails

- Verify URI credentials in `.env`
- Verify Atlas allowlist
- Ensure at least one cluster is online

### Sync auth failure

- Ensure DB users have read/write rights on target DB
- Re-test with:

```bash
npm run job:sync:once
```

### Validate both clusters are aligned

- `npm run db:sync -- --from=primary --to=secondary --mode=upsert`
- `npm run db:sync -- --from=secondary --to=primary --mode=upsert`
