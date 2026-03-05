# SecurityGuide

Authentication model, security controls, known risks, and vulnerability reporting process.

## RelatedDocuments

- [ApiDocumentation](./ApiDocumentation.md)
- [EnvironmentConfigurationGuide](./EnvironmentConfigurationGuide.md)
- [TestingGuide](./TestingGuide.md)
- [TroubleshootingFaq](./TroubleshootingFaq.md)

## AuthModel

- Access token: JWT signed with `JWT_ACCESS_SECRET`.
- Refresh token: JWT signed with `JWT_REFRESH_SECRET`.
- Access token is sent in `Authorization: Bearer <token>`.
- Refresh token is managed via HTTP-only cookie `jwt_refresh`.
- Frontend Axios interceptor attempts refresh on `401`, then retries once.

## AccessControl

- `protect` middleware enforces authentication.
- `attachUserIfPresent` enables optional auth context for mixed public/private reads.
- `checkRecipeOwner` enforces owner-only mutation on recipe update/delete.

## ValidationAndErrorControls

- Input validation via Zod in `backend/src/requests/*` and `validate` middleware.
- Consistent operational errors via `AppError` and centralized error middleware.
- Duplicate key errors return conflict responses.

## KnownRisks

- If secrets are weak/reused across environments, token compromise risk increases.
- Overly broad CORS origins in `FRONTEND_ORIGIN` can expose credentialed requests.
- Sync misconfiguration (`SYNC_FROM` equals `SYNC_TO`) causes worker startup failure.
- Stale or unsynchronized clusters can create temporary read/write inconsistency.

## HardeningRecommendations

- Use long, random, environment-specific JWT secrets.
- Restrict CORS origin list to trusted app domains only.
- Use least-privileged DB credentials.
- Add dependency and container vulnerability scanning in CI.
- Add rate limiting and request throttling for auth endpoints.

## VulnerabilityReporting

- Do not open public issue tickets with exploit details.
- Report privately to maintainers with:
- affected endpoint/flow
- reproduction steps
- impact assessment
- mitigation suggestion
