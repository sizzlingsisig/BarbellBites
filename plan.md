# BarbellBites MVP Plan (Gym-Focused Recipe App)

## 1) MVP Product Scope

### Target user
- Gym goers who want high-protein recipes and simple weekly meal planning.

### MVP decisions (locked)
- Ownership model: **Hybrid** (public recipes + user favorites).
- Core features: **Recipe CRUD, Browse/Filter, Favorites, Meal Planner, Auth Profiles/Goals**.
- Nutrition approach: **Both** manual macro entry and auto-calc support.
- Frontend complexity: **Moderate** (React Router + lightweight API layer).

### Success criteria
- Users can register/login, set goals, create recipes, browse/filter recipes, favorite recipes, and add meals to a weekly planner.
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

5. **Meal Planner (Weekly)**
   - Users can add a recipe to day + meal slot (breakfast/lunch/dinner/snack).
   - View weekly plan with macro totals per day.

6. **Nutrition Calculation Mode**
   - Manual mode: creator enters macros directly.
   - Auto-calc mode: ingredient quantities + nutrition source compute totals.
   - For MVP auto-calc, start with a simple ingredient reference table and fallback to manual edit.

## Nice-to-have (post-MVP)
- Grocery list generation.
- Community ratings/comments.
- Progress tracking against goals.
- Barcode or external food API integrations.

---

## 3) Architecture Plan (Based on Current Repo)

### Backend (`backend/`)
Leverage existing patterns (router → controller → service → model, zod validation, auth middleware):

- Add models:
  - `Recipe`
  - `Favorite`
  - `MealPlanEntry`
  - `IngredientNutrition` (for auto-calc)
  - Extend `User` with `calorieGoal` and ensure `proteinGoal` persistence is aligned.

- Add routes/controllers/services:
  - `recipeRoutes` / `recipeController` / `recipeService`
  - `favoriteRoutes` / `favoriteController` / `favoriteService`
  - `mealPlanRoutes` / `mealPlanController` / `mealPlanService`
  - optional `nutritionService` utility for auto-calc

- Add request validators:
  - Recipe create/update/filter schema
  - Favorite toggle schema
  - Meal-plan create/update schema

- Update `server.ts` route mounting:
  - `/api/v1/recipes`
  - `/api/v1/favorites`
  - `/api/v1/meal-plan`

### Frontend (`frontend/`)
- Add React Router pages:
  - `Login/Register`
  - `Recipes` (browse + filters)
  - `RecipeDetail`
  - `MyRecipes`
  - `Favorites`
  - `MealPlanner`
  - `Profile` (goals)

- Add lightweight API layer:
  - `api/client.ts` (base fetch wrapper, credentials, auth handling)
  - Feature API modules (`recipesApi.ts`, `favoritesApi.ts`, `mealPlanApi.ts`, `authApi.ts`)

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

### MealPlanEntry
- `userId`, `recipeId`
- `date` (or week+day)
- `mealSlot` (`breakfast` | `lunch` | `dinner` | `snack`)
- `servingsPlanned`

### IngredientNutrition
- `ingredientName`, `unit`, macro values per unit (for auto-calc)

---

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

### Meal Plan
- `GET /api/v1/meal-plan?week=YYYY-WW` (auth)
- `POST /api/v1/meal-plan` (auth)
- `PATCH /api/v1/meal-plan/:id` (auth)
- `DELETE /api/v1/meal-plan/:id` (auth)

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

### Phase 2 — Favorites + Meal Planner (2–3 days)
- Implement favorites endpoints + frontend favorites page.
- Implement weekly meal-plan endpoints + planner UI and daily macro totals.

### Phase 3 — Nutrition auto-calc baseline (1–2 days)
- Add `IngredientNutrition` reference data.
- Implement service to calculate macros from ingredient lines.
- Keep manual override enabled when ingredient mapping is incomplete.

### Phase 4 — Hardening + MVP release (1 day)
- Validation + error handling pass across all endpoints.
- Smoke tests for auth, recipe, favorites, planner flows.
- UX cleanup and README deployment/run instructions.

---

## 7) Acceptance Checklist

- [ ] Auth works with profile goals persisted.
- [ ] Users can create/edit/delete own recipes.
- [ ] Public browse supports search + gym-focused filters.
- [ ] Favorite/unfavorite works and shows in dedicated page.
- [ ] Weekly planner supports add/edit/remove meal entries.
- [ ] Planner displays per-day macro totals.
- [ ] Manual and auto nutrition paths both functional.
- [ ] Core flows tested from frontend through backend.

---

## 8) Key Risks + Mitigations

1. **Nutrition auto-calc complexity**
   - Mitigation: seed a limited ingredient table and allow manual override.

2. **Cookie auth + CORS issues in local dev**
   - Mitigation: explicit CORS origin, credentials enabled in frontend requests, consistent env config.

3. **Scope creep (planner + nutrition + social features)**
   - Mitigation: lock MVP to listed endpoints/pages only.

4. **Data quality for ingredients**
   - Mitigation: normalize units and support fallback manual nutrition entry.

---

## 9) Suggested Next Build Order (Immediate)

1. Foundation alignment (User goals + CORS credentials + `/me` + goals update).
2. Recipe model + CRUD + browse filters.
3. Frontend recipe pages and API integration.
4. Favorites.
5. Meal planner.
6. Nutrition auto-calc baseline.

This order gets usable value quickly while keeping nutrition complexity contained.