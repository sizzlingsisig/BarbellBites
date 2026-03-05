# BarbellBites API Notes

## Base URLs (Development)

- v1: `http://localhost:3000/api/v1`
- v2: `http://localhost:3000/api/v2`

## Auth Endpoints (v1 and v2)

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/test` (protected)
- `POST /auth/refresh`
- `POST /auth/logout`

## Recipe Endpoints

### v1

- `GET /recipes`
- `GET /recipes/mine` (protected)
- `GET /recipes/:slug`
- `POST /recipes` (protected)
- `PUT /recipes/:slug` (protected, owner)
- `DELETE /recipes/:slug` (protected, owner)

### v2

- `GET /recipes/meta/taxonomy`
- `GET /recipes`
- `GET /recipes/mine` (protected)
- `GET /recipes/:slug`
- `POST /recipes` (protected)
- `POST /recipes/:slug/undo-delete` (protected)
- `PUT /recipes/:slug` (protected, owner)
- `DELETE /recipes/:slug` (protected, owner)

## Favorites Endpoints (v1 and v2)

- `GET /favorites` (protected)
- `POST /favorites/:recipeId` (protected)
- `DELETE /favorites/:recipeId` (protected)

## Health Endpoints

- `GET /api/v1/health/db`
- `GET /api/v2/health/db`

## Response Shape Notes

- Auth and single-resource endpoints return JSON objects.
- v1 recipe list endpoints currently return arrays.
- v2 recipe list endpoints return paginated objects:

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

## HTTP Status Guide

- `200` OK
- `201` Created
- `204` No Content
- `400` Bad Request
- `401` Unauthorized
- `403` Forbidden
- `404` Not Found
- `500` Internal Server Error

