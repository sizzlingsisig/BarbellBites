# TestingGuide

How to run tests, add new tests, and evaluate coverage confidence for BarbellBites.

## RelatedDocuments

- [ApiDocumentation](./ApiDocumentation.md)
- [CodeStyleGuide](./CodeStyleGuide.md)
- [SecurityGuide](./SecurityGuide.md)
- [TroubleshootingFaq](./TroubleshootingFaq.md)

## CurrentTestStack

- Backend API validation: Bruno suites (`backend/BarbellBites/V1`, `backend/BarbellBites/V2`)
- Backend suite runner: `backend/src/scripts/runBrunoSuite.ts`
- Frontend testing libraries installed: `vitest`, `@testing-library/react`, `@testing-library/user-event`

## RunExistingTests

Run from `backend/`:

```bash
npm run test:v1:smoke
npm run test:v1:edge
npm run test:v2:smoke
npm run test:v2:edge
npm run test:smoke
npm run test:edge
npm run test:all
```

Build checks:

```bash
# backend
npm run build

# frontend
npm run lint
npm run build
```

## WritingNewTests

### Backend

- Add/extend Bruno requests under `backend/BarbellBites/V1/*` or `backend/BarbellBites/V2/*`.
- Keep smoke tests for happy path and edge tests for failures/authorization/validation.
- Prefer version-specific suites when API contract differs.

### Frontend

- Place component/page tests next to feature files or in dedicated test directories.
- Use Testing Library patterns:
- render via user-visible behavior
- avoid implementation-detail assertions
- mock network boundaries at API module level

## CoverageExpectations

- Cover both v1 and v2 critical auth, recipes, and favorites flows.
- Include unauthorized, forbidden, invalid input, and not-found cases.
- Validate failover-sensitive paths at least in smoke + edge workflows.
- For frontend, minimum expectation is route-level and high-risk interaction coverage.
