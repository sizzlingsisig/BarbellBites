# BarbellBites API Doc (MVP)

## Base URL
- Development: `http://localhost:5000/api/v1`

## Auth Model
- Access token returned in JSON response.
- Refresh token managed via httpOnly cookie.
- Protected endpoints require valid access token.

## Response Shape (recommended)
### Success
```json
{
  "status": "success",
  "data": {}
}
```

### Error
```json
{
  "status": "error",
  "message": "Human readable message"
}
```

## Endpoints

## Auth & Profile
### POST /auth/register
Create account.
- Body:
```json
{
  "name": "CJ",
  "email": "cj@example.com",
  "password": "strongpassword"
}
```
- Returns access token + user payload.

### POST /auth/login
Login user.
- Body:
```json
{
  "email": "cj@example.com",
  "password": "strongpassword"
}
```

### POST /auth/refresh
Issue new access token using refresh cookie.

### POST /auth/logout
Revoke refresh token and clear refresh cookie.

### GET /auth/me
Get current authenticated user profile.

### PATCH /auth/goals
Update user goals.
- Body:
```json
{
  "proteinGoal": 180,
  "calorieGoal": 2600
}
```

## Recipes
### GET /recipes
List public recipes with optional filters.
- Query params (MVP):
  - `q` (search text)
  - `tags` (comma-separated)
  - `maxPrepMinutes`
  - `minProtein`
  - `page`
  - `limit`

### GET /recipes/:id
Get single recipe by id.

### GET /recipes/me
List authenticated user's recipes.

### POST /recipes
Create recipe (auth).
- Body (example):
```json
{
  "title": "High Protein Oats",
  "description": "Quick breakfast",
  "ingredients": [
    { "name": "Oats", "quantity": 80, "unit": "g" },
    { "name": "Whey", "quantity": 30, "unit": "g" }
  ],
  "instructions": ["Mix", "Cook"],
  "prepMinutes": 5,
  "cookMinutes": 5,
  "servings": 1,
  "tags": ["high-protein", "meal-prep"],
  "visibility": "public",
  "nutrition": {
    "inputMode": "manual",
    "calories": 520,
    "protein": 42,
    "carbs": 58,
    "fat": 12
  }
}
```

### PATCH /recipes/:id
Update recipe (owner only).

### DELETE /recipes/:id
Delete recipe (owner only).

## Favorites
### GET /favorites
List current user favorites.

### POST /favorites/:recipeId
Favorite a recipe.

### DELETE /favorites/:recipeId
Remove a favorite.

## HTTP Status Guide
- `200` OK
- `201` Created
- `400` Validation / bad request
- `401` Unauthorized
- `403` Forbidden
- `404` Not found
- `409` Conflict
- `500` Internal server error

## Notes
- Keep request validation with Zod.
- Keep controllers responsible for status mapping.
- Keep services focused on business rules and data operations.
