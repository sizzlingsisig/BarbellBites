# Recipes Enhancement Implementation Plan

## Scope

- Optional forgot password flow
- Functional search bar
- Working recipe filters
- Sidebar split into `Navigation` and `Search + Filters`
- UI improvements for recipes list page
- UI improvements for recipe details page
- Better color contrast
- Optional animations using `motion`
- Prevent custom tags in create/edit modals
- Improve image UX in create/edit modal
- Add project licensing

## Assumptions

- Frontend uses API v2 by default (`/api/v2`) via `frontend/src/api/axios.ts`.
- "Right filters" means backend-driven filters for search, diet, meal type, cuisine, and optional prep/total time caps.
- Forgot password is optional and can be implemented as either:
  - Request-only (email capture + success message), or
  - Full request + reset token flow.

## Affected Files

### Frontend

- `frontend/src/layouts/DefaultLayout.tsx`
- `frontend/src/components/NavButton.tsx`
- `frontend/src/pages/RecipesPage.tsx`
- `frontend/src/pages/RecipeDetailPage.tsx`
- `frontend/src/pages/LoginPage.tsx`
- `frontend/src/components/CreateRecipeModal.tsx`
- `frontend/src/hooks/useRecipeTaxonomy.ts`
- `frontend/src/api/recipesApi.ts`
- `frontend/src/api/authApi.ts`
- `frontend/src/router/routes.ts`
- `frontend/src/router/index.tsx`
- `frontend/src/index.css`
- `frontend/src/theme.ts`
- `frontend/package.json` (for optional `motion`)

Optional new frontend files:

- `frontend/src/components/sidebar/SidebarNavSection.tsx`
- `frontend/src/components/sidebar/SidebarFilterSearchSection.tsx`
- `frontend/src/pages/ForgotPasswordPage.tsx`
- `frontend/src/pages/ResetPasswordPage.tsx`

### Backend (forgot password optional)

- `backend/src/routes/v2/authRoutes.ts`
- `backend/src/controllers/v2/authController.ts`
- `backend/src/services/v2/authService.ts`
- `backend/src/requests/v2/authRequests.ts`

### Docs and licensing

- `README.md`
- `LICENSE` (new)
- `docs/licensing.md` (new)

## Implementation Steps

### Phase 1: Search + Filters Foundation

1. Extend recipe API query typing and calls in `frontend/src/api/recipesApi.ts`.
2. Move sidebar search/filter state into a reliable source (URL query params or centralized state).
3. Connect search and filter values from `frontend/src/layouts/DefaultLayout.tsx` to `frontend/src/pages/RecipesPage.tsx`.
4. Ensure recipes reload on filter/search changes and reset to page 1.
5. Validate behavior against backend query schema (`diet`, `mealType`, `cuisine`, `maxPrepTime`, `maxTotalTime`, `search`).

Deliverable:
- Search field and filters actively control recipe results.

### Phase 2: Sidebar Separation

1. Extract nav section (recipes/my recipes/favorites) into dedicated component.
2. Extract search + filter section into dedicated component.
3. Keep logout as separate footer action.
4. Update `DefaultLayout` to compose these sections cleanly.

Deliverable:
- Sidebar has distinct sections for navigation and filtering.

### Phase 3: Recipe UI Improvements

1. Improve list page information hierarchy in `frontend/src/pages/RecipesPage.tsx`.
2. Improve card readability and visual consistency in `frontend/src/components/RecipeCard.tsx`.
3. Improve detail page sections in `frontend/src/pages/RecipeDetailPage.tsx`.
4. Improve empty/loading/error states for both pages.

Deliverable:
- Cleaner, more readable, and more consistent recipes UX.

### Phase 4: Contrast and Design Tokens

1. Audit low-contrast text/badge/background combinations.
2. Adjust color variables in `frontend/src/theme.ts` and styles in `frontend/src/index.css`.
3. Ensure accessible contrast in headers, labels, chips, and button states.

Deliverable:
- Improved color contrast and readability across recipe surfaces.

### Phase 5: Optional Motion Enhancements

1. Add `motion` dependency in `frontend/package.json`.
2. Add meaningful transitions:
   - Page enter animation
   - Card stagger on load
   - Section reveal on detail page
3. Respect reduced-motion preferences and keep mobile animations minimal.

Deliverable:
- Subtle, purposeful animations without harming performance.

### Phase 6: Tag Restrictions + Modal Image UX

1. Update `CreateRecipeModal` to disallow custom taxonomy entries.
2. Keep selections limited to backend taxonomy options from `useRecipeTaxonomy`.
3. Improve image handling in modal:
   - clear upload vs URL path
   - preview
   - file type/size validation
   - better error messaging
4. Ensure edit flow inherits same restrictions and image UX.

Deliverable:
- Users cannot add ad-hoc tags; image UX is clearer and safer.

### Phase 7: Optional Forgot Password

1. Add frontend route(s): `forgot-password` and optional `reset-password/:token`.
2. Add frontend API methods in `frontend/src/api/authApi.ts`.
3. Add backend endpoint(s) under v2 auth routes.
4. Add validation and service logic in auth request/service/controller files.
5. Return generic success messages to avoid account enumeration.

Deliverable:
- Optional forgot-password flow integrated end-to-end.

### Phase 8: Licensing

1. Add root `LICENSE` file (recommended: MIT unless you prefer a different license).
2. Add `docs/licensing.md` for third-party assets/libraries and image usage notes.
3. Update `README.md` with license section and links.

Deliverable:
- Clear licensing and attribution in repository docs.

## Validation Checklist

- [ ] Search updates results correctly.
- [ ] Filters map correctly to backend query params.
- [ ] Sidebar sections are split and stable on desktop/mobile.
- [ ] Recipes page UI is improved without regressions.
- [ ] Recipe detail UI is improved without regressions.
- [ ] Contrast is improved in key text/action components.
- [ ] Optional motion works and respects reduced-motion.
- [ ] Custom tags cannot be entered in create/edit flows.
- [ ] Image upload/preview UX works in create/edit modal.
- [ ] Optional forgot-password flow works (if enabled).
- [ ] License files/docs exist and are linked from README.

## Suggested Delivery Order

1. Phase 1
2. Phase 2
3. Phase 6
4. Phase 3
5. Phase 4
6. Phase 5
7. Phase 7 (optional)
8. Phase 8
