# Sync Playbook (Demo Day)

This playbook gives exact command sequences for:
- Normal startup
- Simulating primary outage
- Recovery + resync
- Optional continuous sync with `mongosync`

All commands below run from `backend/`.

## 1) Prerequisites

1. Atlas network access allows your current IP (or temporary `0.0.0.0/0` for testing).
2. `.env` includes both clusters:

```env
MONGO_URI=<primary cluster URI>
MONGO_URI_SECONDARY=<secondary cluster URI>
MONGO_DB_NAME=BarbellBites
```

3. Install dependencies:

```bash
npm install
```

4. Confirm scripts exist:

```bash
npm run db:sync -- --from=primary --to=secondary --mode=upsert
```

If this prints sync logs, your sync script is wired correctly.

## 2) Normal Mode (Primary + Secondary Online)

1. Seed and replicate baseline data:

```bash
npm run db:seed
```

2. Start API:

```bash
npm run dev
```

3. Run your Bruno smoke tests (optional):

```bash
npm run test:v1:smoke
npm run test:v2:smoke
```

Expected result: reads come from primary; writes go to primary and mirror to secondary.

## 3) Simulate Primary Outage

Use one method:
- Atlas method: pause/stop or temporarily block primary cluster network access.
- Local method: set an invalid `MONGO_URI` while keeping `MONGO_URI_SECONDARY` valid, then restart API.

1. Start API (or restart):

```bash
npm run dev
```

2. Validate app behavior with API calls or Bruno smoke tests:

```bash
npm run test:v1:smoke
npm run test:v2:smoke
```

Expected result: reads fail over to secondary. Some write paths may log backup/primary sync warnings depending on which cluster is online.

## 4) Recover Primary + Resync Data

After primary is back online, choose direction based on where latest truth lives.

### If secondary has newer data

```bash
npm run db:sync:s2p
```

### If primary should overwrite secondary

```bash
npm run db:sync:p2s
```

### Safer merge-style sync (non-destructive)

```bash
npm run db:sync -- --from=secondary --to=primary --mode=upsert
npm run db:sync -- --from=primary --to=secondary --mode=upsert
```

Then re-run smoke tests.

## 5) Mongosync (Continuous Sync Option)

Use this when you want ongoing migration/sync behavior between clusters, not just one-time copy.

### 5.1 Install and run `mongosync`

Follow MongoDB install docs for your OS and ensure `mongosync` is on PATH.

### 5.2 Start `mongosync` process

Example (single line command):

```bash
mongosync --cluster0 "mongodb+srv://<user>:<pass>@<primary-host>/?readPreference=primary" --cluster1 "mongodb+srv://<user>:<pass>@<secondary-host>/?readPreference=primary"
```

Notes:
- `cluster0` is source, `cluster1` is destination at start.
- `mongosync` starts in `IDLE`; you must issue the start command via mongosync control API (see MongoDB quickstart).
- Use users with required roles (`backup`, `clusterMonitor`, `readWriteAnyDatabase`, `restore`, etc. per MongoDB docs and sync mode).

### 5.3 Direction and reversal

Do not run two independent `mongosync` pipelines in opposite directions at the same time.
Use mongosync reverse flow when you need to flip source/destination.

## 6) Recommended Demo Sequence

1. `npm run db:seed`
2. `npm run dev`
3. Show normal read/write behavior.
4. Simulate primary outage.
5. Show failover reads still work.
6. Restore primary.
7. Run `npm run db:sync:s2p` (or `p2s`, depending on where writes landed).
8. Re-run smoke tests to show both clusters are aligned.

## 7) Quick Troubleshooting

### `npm run db:seed` fails

- Check `.env` URI correctness.
- Verify Atlas IP allowlist.
- Confirm at least one cluster is reachable.
- Re-run:

```bash
npm run db:seed
```

### Sync fails with auth errors

- Verify user/password in URI.
- Ensure the sync user has required roles on both clusters.

### Sync direction mistake

- Re-run sync in the correct direction using `replace` mode if you want exact clone.
- Use `upsert` mode if you want a lower-risk reconciliation.

## 8) Background Job Sync (No Mongosync)

Use this when you want periodic automatic reconciliation between clusters.

### 8.1 Configure worker env vars

Add these values to `.env`:

```env
SYNC_ENABLED=true
SYNC_INTERVAL_MINUTES=5
SYNC_FROM=primary
SYNC_TO=secondary
SYNC_MODE=upsert
```

Notes:
- `SYNC_MODE=upsert` is safer for continuous jobs.
- `replace` will wipe the target each run.

### 8.2 Run worker

```bash
npm run job:sync
```

Behavior:
- Runs one sync immediately at startup.
- Repeats every `SYNC_INTERVAL_MINUTES`.
- Prevents overlapping runs in the same process.

### 8.3 One-off job run

```bash
npm run job:sync:once
```

Use this for manual reconciliation without starting the loop.
