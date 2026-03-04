import { Loader } from '@mantine/core'
import { type ComponentType, type PropsWithChildren, createElement, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import BlankLayout from '../layouts/BlankLayout'
import DefaultLayout from '../layouts/DefaultLayout'
import { useAuthStore } from '../store/authStore'
import { appRoutes, ROUTE_LAYOUTS, ROUTE_PATHS, type RouteLayout, type RouteMeta } from './routes'

type RouteElementProps = {
  meta?: RouteMeta
  component: ComponentType
}

const routeLayouts: Record<RouteLayout, ComponentType<PropsWithChildren>> = {
  [ROUTE_LAYOUTS.DEFAULT]: DefaultLayout,
  [ROUTE_LAYOUTS.BLANK]: BlankLayout,
}

function RouteElement({ meta, component }: RouteElementProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isInitialized = useAuthStore((state) => state.isInitialized)

  useEffect(() => {
    document.title = meta?.title ?? 'BarbellBites'
  }, [meta?.title])

  if (!isInitialized) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader color="green" size="md" />
      </main>
    )
  }

  if (meta?.requiresAuth && !isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.AUTH} replace />
  }

  if (meta?.guestOnly && isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.RECIPES} replace />
  }

  const layoutKey = meta?.layout ?? ROUTE_LAYOUTS.DEFAULT
  const Layout = routeLayouts[layoutKey]

  return <Layout>{createElement(component)}</Layout>
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {appRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<RouteElement meta={route.meta} component={route.component} />}
          />
        ))}
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
