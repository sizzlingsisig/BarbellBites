import type { ComponentType } from 'react'
import AuthPage from '../pages/AuthPage'
import HomePage from '../pages/HomePage'
import NotFoundPage from '../pages/NotFoundPage'
// 1. IMPORT YOUR NEW PAGE
import RecipePage from '../pages/RecipePage'

export const ROUTE_PATHS = {
  HOME: '/',
  AUTH: '/auth',
  // 2. ADD THE PREVIEW PATH
  RECIPE_PREVIEW: '/recipe/preview',
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
    path: ROUTE_PATHS.HOME,
    component: HomePage,
    meta: {
      title: 'BarbellBites | Home',
      requiresAuth: true,
      layout: ROUTE_LAYOUTS.DEFAULT,
    },
  },
  {
    path: ROUTE_PATHS.AUTH,
    component: AuthPage,
    meta: {
      title: 'BarbellBites | Auth',
      guestOnly: true,
      layout: ROUTE_LAYOUTS.BLANK,
    },
  },
  // 3. ADD THE RECIPE PREVIEW ROUTE
  {
    path: ROUTE_PATHS.RECIPE_PREVIEW,
    component: RecipePage,
    meta: {
      title: 'BarbellBites | Recipe Preview',
      // By leaving out requiresAuth and guestOnly, TypeScript infers this as a PublicRouteMeta.
      // Anyone can view it without logging in!
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