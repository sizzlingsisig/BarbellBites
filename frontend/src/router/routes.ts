import type { ComponentType } from 'react'
import LoginPage from '../pages/LoginPage'
import RecipesPage from '../pages/RecipesPage'
import RecipeDetailPage from '../pages/RecipeDetailPage'
import FavoritesPage from '../pages/FavoritesPage'
import NotFoundPage from '../pages/NotFoundPage'
import SignupPage from '../pages/SignupPage'

export const ROUTE_PATHS = {
  RECIPES: '/',
  RECIPE_DETAIL: '/recipes/:recipeId',
  FAVORITES: '/favorites',
  AUTH: '/login',
  REGISTER: '/register',
  NOT_FOUND: '*',
} as const

export const ROUTE_LAYOUTS = {
  DEFAULT: 'default',
  BLANK: 'blank',
} as const

export type RouteLayout = (typeof ROUTE_LAYOUTS)[keyof typeof ROUTE_LAYOUTS]

type BaseRouteMeta = {
  title?: string
  layout?: RouteLayout
}

type PublicRouteMeta = BaseRouteMeta & {
  requiresAuth?: false
  guestOnly?: false
}

type ProtectedRouteMeta = BaseRouteMeta & {
  requiresAuth: true
  guestOnly?: false
}

type GuestOnlyRouteMeta = BaseRouteMeta & {
  guestOnly: true
  requiresAuth?: false
}

export type RouteMeta = PublicRouteMeta | ProtectedRouteMeta | GuestOnlyRouteMeta

export type AppRoute = {
  path: string
  component: ComponentType
  meta?: RouteMeta
}

export const appRoutes: AppRoute[] = [
  {
    path: ROUTE_PATHS.RECIPES,
    component: RecipesPage,
    meta: {
      title: 'BarbellBites | Recipes',
      requiresAuth: true,
      layout: ROUTE_LAYOUTS.DEFAULT,
    },
  },
  {
    path: ROUTE_PATHS.RECIPE_DETAIL,
    component: RecipeDetailPage,
    meta: {
      title: 'BarbellBites | View Recipe',
      requiresAuth: true,
      layout: ROUTE_LAYOUTS.DEFAULT,
    },
  },
  {
    path: ROUTE_PATHS.FAVORITES,
    component: FavoritesPage,
    meta: {
      title: 'BarbellBites | Favorite Recipes',
      requiresAuth: true,
      layout: ROUTE_LAYOUTS.DEFAULT,
    },
  },
  {
    path: ROUTE_PATHS.AUTH,
    component: LoginPage,
    meta: {
      title: 'BarbellBites | Login',
      guestOnly: true,
      layout: ROUTE_LAYOUTS.BLANK,
    },
  },
  {
    path: ROUTE_PATHS.REGISTER,
    component: SignupPage,
    meta: {
      title: 'BarbellBites | Sign Up',
      guestOnly: true,
      layout: ROUTE_LAYOUTS.BLANK,
    },
  },
  {
    path: ROUTE_PATHS.NOT_FOUND,
    component: NotFoundPage,
    meta: {
      title: 'BarbellBites | Not Found',
      layout: ROUTE_LAYOUTS.BLANK,
    },
  },
]