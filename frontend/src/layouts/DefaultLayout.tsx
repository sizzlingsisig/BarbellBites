import { Button, Stack, Text, Title } from '@mantine/core'
import type { PropsWithChildren } from 'react'
import { NavLink } from 'react-router-dom'
import { ROUTE_PATHS } from '../router/routes'
import { useAuthStore } from '../store/authStore'

function DefaultLayout({ children }: PropsWithChildren) {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid min-h-screen grid-cols-[240px_1fr]">
        <aside className="border-r border-gray-200 bg-white p-4">
          <Stack gap="lg" h="100%" justify="space-between">
            <Stack gap="sm">
              <Title order={4}>BarbellBites</Title>
              <Text c="dimmed" size="sm">
                {user?.email ?? 'Guest'}
              </Text>

              <Button component={NavLink} to={ROUTE_PATHS.HOME} variant="light" fullWidth>
                Home
              </Button>
            </Stack>

            <Button variant="default" onClick={() => void logout()} fullWidth>
              Logout
            </Button>
          </Stack>
        </aside>

        <section className="p-6">{children}</section>
      </div>
    </div>
  )
}

export default DefaultLayout
