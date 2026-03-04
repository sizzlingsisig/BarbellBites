# BarbellBites MVP Plan (Gym-Focused Recipe App)

## 1) MVP Product Scope

### Target user
- Gym goers who want high-protein recipes with favorites and profile-based macro goals.

### MVP decisions (locked)
- Ownership model: **Hybrid** (public recipes + user favorites).
- Core features: **Recipe CRUD, Browse/Filter, Favorites, Auth Profiles/Goals**.
- Nutrition approach: **Manual macro entry in recipe payloads**.
- Frontend complexity: **Moderate** (React Router + lightweight API layer).

### Success criteria
- Users can register/login, set goals, create recipes, browse/filter recipes, and favorite recipes.
- App returns useful gym-specific data: calories + protein/carbs/fat per serving.
- End-to-end flow works from frontend to backend with auth-protected actions.

---

## 2) MVP Feature Set

## Must-have (v1)
1. **Authentication**
   - Register, login, refresh, logout (already in backend).
   - Add and persist profile goals: protein + calorie goal.

2. **Recipes**
   - Create, read, update, delete recipe.
   - Fields: title, description, ingredients, instructions, prep/cook time, servings, tags.
   - Nutrition: calories/protein/carbs/fat per serving.
   - Visibility: public/private recipe flag.

3. **Browse + Search + Filters**
   - Browse public recipes.
   - Filter by tags (e.g., high-protein, bulking, cutting, meal-prep), max prep time, and macro thresholds.
   - Text search on recipe title.

4. **Favorites**
   - Authenticated users can favorite/unfavorite any public recipe.
   - “My Favorites” list.

5. **Profile Goals**
   - Users can set/update calorie and protein goals.
   - Goals are available for profile and future recommendation features.

## Nice-to-have (post-MVP)
- Grocery list generation.
- Community ratings/comments.
- Progress tracking against goals.
- Weekly meal planner.
- Barcode or external food API integrations.

---

## 3) Architecture Plan (Based on Current Repo)

### Backend (`backend/`)
Leverage existing patterns (router → controller → service → model, zod validation, auth middleware):

- Add models:
  - `Recipe`
  - `Favorite`
  - Extend `User` with `calorieGoal` and ensure `proteinGoal` persistence is aligned.

- Add routes/controllers/services:
  - `recipeRoutes` / `recipeController` / `recipeService`
  - `favoriteRoutes` / `favoriteController` / `favoriteService`

- Add request validators:
  - Recipe create/update/filter schema
  - Favorite toggle schema

- Update `server.ts` route mounting:
  - `/api/v1/recipes`
   - `/api/v1/favorites`

### Frontend (`frontend/`)
- Add React Router pages:
  - `Login/Register`
  - `Recipes` (browse + filters)
  - `RecipeDetail`
  - `MyRecipes`
  - `Favorites`
  - `Profile` (goals)

- Add lightweight API layer:
  - `api/client.ts` (base fetch wrapper, credentials, auth handling)
   - Feature API modules (`recipesApi.ts`, `favoritesApi.ts`, `authApi.ts`)

- Add app state:
  - Auth context/token state + user profile.
  - Local UI state for filters/planner interactions.

---

## 4) Data Model Draft (MVP)

### User
- `email`, `password`, `refreshTokenHash`
- `proteinGoal` (grams/day)
- `calorieGoal` (kcal/day)

### Recipe
- `authorId`
- `title`, `description`
- `ingredients[]` (name, quantity, unit)
- `instructions[]`
- `prepMinutes`, `cookMinutes`, `servings`
- `tags[]` (high-protein, bulking, cutting, meal-prep, vegetarian, etc.)
- `visibility` (`public` | `private`)
- `nutrition`:
  - `inputMode` (`manual` | `auto`)
  - per-serving `calories`, `protein`, `carbs`, `fat`

### Favorite
- `userId`, `recipeId`
- unique index on (`userId`, `recipeId`)

## 5) API Contract (MVP)

### Auth/Profile
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `PATCH /api/v1/auth/goals`

### Recipes
- `GET /api/v1/recipes` (public browse + query filters)
- `GET /api/v1/recipes/:id`
- `POST /api/v1/recipes` (auth)
- `PATCH /api/v1/recipes/:id` (owner only)
- `DELETE /api/v1/recipes/:id` (owner only)
- `GET /api/v1/recipes/me` (my recipes)

### Favorites
- `GET /api/v1/favorites` (auth)
- `POST /api/v1/favorites/:recipeId` (auth)
- `DELETE /api/v1/favorites/:recipeId` (auth)

---

## 6) Implementation Phases (Execution Plan)

### Phase 0 — Foundation alignment (0.5–1 day)
- Fix `User` schema mismatch with `proteinGoal` from request validation.
- Add `calorieGoal` support and profile endpoints.
- Configure CORS + credentials for cookie-based refresh with frontend origin.
- Update API docs / Bruno collection for corrected auth responses.

### Phase 1 — Recipe core (2–3 days)
- Implement `Recipe` model + CRUD endpoints + ownership checks.
- Add browse endpoint with filtering/search and basic pagination.
- Frontend pages for recipe list/detail/create-edit.

### Phase 2 — Favorites (1–2 days)
- Implement favorites endpoints + frontend favorites page.

### Phase 3 — Hardening + MVP release (1 day)
- Validation + error handling pass across all endpoints.
- Smoke tests for auth, recipe, and favorites flows.
- UX cleanup and README deployment/run instructions.

---

## 7) Acceptance Checklist

- [ ] Auth works with profile goals persisted.
- [ ] Users can create/edit/delete own recipes.
- [ ] Public browse supports search + gym-focused filters.
- [ ] Favorite/unfavorite works and shows in dedicated page.
- [ ] Profile goals are persisted and editable.
- [ ] Core flows tested from frontend through backend.

---

## 8) Key Risks + Mitigations

1. **Cookie auth + CORS issues in local dev**
   - Mitigation: explicit CORS origin, credentials enabled in frontend requests, consistent env config.

2. **Scope creep (post-MVP features + social features)**
   - Mitigation: lock MVP to listed endpoints/pages only.

3. **Data quality for nutrition input**
   - Mitigation: enforce validation rules and clear field requirements in create/edit forms.

---

## 9) Suggested Next Build Order (Immediate)

1. Foundation alignment (User goals + CORS credentials + `/me` + goals update).
2. Recipe model + CRUD + browse filters.
3. Frontend recipe pages and API integration.
4. Favorites.

This order gets usable value quickly while keeping MVP scope focused and shippable.