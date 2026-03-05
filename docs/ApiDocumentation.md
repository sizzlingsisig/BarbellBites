# ApiDocumentation

Canonical API reference for BarbellBites backend versions `v1` and `v2`.

## RelatedDocuments

- [ArchitectureDoc](./ArchitectureDoc.md)
- [DatabaseSchema](./DatabaseSchema.md)
- [EnvironmentConfigurationGuide](./EnvironmentConfigurationGuide.md)
- [SecurityGuide](./SecurityGuide.md)
- [TestingGuide](./TestingGuide.md)

## BaseUrls

- `v1`: `http://localhost:3000/api/v1`
- `v2`: `http://localhost:3000/api/v2`

## AuthenticationEndpoints

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/test` (protected)
- `POST /auth/refresh`
- `POST /auth/logout`

## RecipeEndpoints

### V1

- `GET /recipes`
- `GET /recipes/mine` (protected)
- `GET /recipes/:slug`
- `POST /recipes` (protected)
- `PUT /recipes/:slug` (protected, owner)
- `DELETE /recipes/:slug` (protected, owner)

### V2

- `GET /recipes/meta/taxonomy`
- `GET /recipes`
- `GET /recipes/mine` (protected)
- `GET /recipes/:slug`
- `POST /recipes` (protected)
- `POST /recipes/:slug/undo-delete` (protected)
- `PUT /recipes/:slug` (protected, owner)
- `DELETE /recipes/:slug` (protected, owner)

## FavoritesEndpoints

- `GET /favorites` (protected)
- `POST /favorites/:recipeId` (protected)
- `DELETE /favorites/:recipeId` (protected)

## HealthEndpoints

- `GET /api/v1/health/db`
- `GET /api/v2/health/db`

## RequestExamples

### Register

```http
POST /api/v2/auth/register
Content-Type: application/json

{
  "name": "CJ",
  "email": "cj@example.com",
  "password": "StrongPass123"
}
```

### CreateRecipe

```http
POST /api/v2/recipes
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Protein Oat Bowl",
  "visibility": "public",
  "ingredients": [{ "name": "Oats", "amount": "80", "unit": "g" }],
  "steps": ["Mix", "Cook"],
  "nutritionPerServing": { "calories": 420, "protein": 32, "carbs": 48, "fats": 11 }
}
```

## ResponseShapes

- Auth and single-resource endpoints return JSON objects.
- `v1` recipe list endpoints return arrays.
- `v2` recipe list endpoints return paginated objects.

```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

## StatusCodes

- `200` OK
- `201` Created
- `204` No Content
- `400` Bad Request
- `401` Unauthorized
- `403` Forbidden
- `404` Not Found
- `409` Conflict
- `500` Internal Server Error

## VersioningNotes

- Routes are versioned under `backend/src/routes/v1` and `backend/src/routes/v2`.
- Request validators are versioned under `backend/src/requests/v1` and `backend/src/requests/v2`.
- Controllers are versioned under `backend/src/controllers/v1` and `backend/src/controllers/v2`.
- Add new versions at the API boundary first, then version service/model behavior only when required.
