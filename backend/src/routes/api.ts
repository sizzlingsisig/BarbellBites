import type { Application } from 'express'
import authRoutes from './v1/authRoutes.js'
import recipeRoutes from './v1/recipeRoutes.js'
import favoriteRoutes from './v1/favoriteRoutes.js'
import authRoutesV2 from './v2/authRoutes.js'
import recipeRoutesV2 from './v2/recipeRoutes.js'
import favoriteRoutesV2 from './v2/favoriteRoutes.js'

export const API_BASE_PATHS = {
  v1: {
    auth: '/api/v1/auth',
    recipes: '/api/v1/recipes',
    favorites: '/api/v1/favorites',
  },
  v2: {
    auth: '/api/v2/auth',
    recipes: '/api/v2/recipes',
    favorites: '/api/v2/favorites',
  },
} as const

export const API_ROUTES = {
  v1: {
    auth: {
      register: `${API_BASE_PATHS.v1.auth}/register`,
      login: `${API_BASE_PATHS.v1.auth}/login`,
      refresh: `${API_BASE_PATHS.v1.auth}/refresh`,
      logout: `${API_BASE_PATHS.v1.auth}/logout`,
      test: `${API_BASE_PATHS.v1.auth}/test`,
    },
    recipes: {
      listPublic: API_BASE_PATHS.v1.recipes,
      listMine: `${API_BASE_PATHS.v1.recipes}/mine`,
      bySlug: `${API_BASE_PATHS.v1.recipes}/:slug`,
    },
    favorites: {
      list: API_BASE_PATHS.v1.favorites,
      byRecipeId: `${API_BASE_PATHS.v1.favorites}/:recipeId`,
    },
  },
  v2: {
    auth: {
      register: `${API_BASE_PATHS.v2.auth}/register`,
      login: `${API_BASE_PATHS.v2.auth}/login`,
      refresh: `${API_BASE_PATHS.v2.auth}/refresh`,
      logout: `${API_BASE_PATHS.v2.auth}/logout`,
      test: `${API_BASE_PATHS.v2.auth}/test`,
    },
    recipes: {
      listPublic: API_BASE_PATHS.v2.recipes,
      listMine: `${API_BASE_PATHS.v2.recipes}/mine`,
      bySlug: `${API_BASE_PATHS.v2.recipes}/:slug`,
      taxonomy: `${API_BASE_PATHS.v2.recipes}/meta/taxonomy`,
    },
    favorites: {
      list: API_BASE_PATHS.v2.favorites,
      byRecipeId: `${API_BASE_PATHS.v2.favorites}/:recipeId`,
    },
  },
} as const

export function registerApiRoutes(app: Application) {
  app.use(API_BASE_PATHS.v1.auth, authRoutes)
  app.use(API_BASE_PATHS.v1.recipes, recipeRoutes)
  app.use(API_BASE_PATHS.v1.favorites, favoriteRoutes)

  app.use(API_BASE_PATHS.v2.auth, authRoutesV2)
  app.use(API_BASE_PATHS.v2.recipes, recipeRoutesV2)
  app.use(API_BASE_PATHS.v2.favorites, favoriteRoutesV2)
}
