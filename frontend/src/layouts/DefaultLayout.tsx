import { Button, Checkbox, Divider, Stack, Text, TextInput, Title } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { useState, type PropsWithChildren } from 'react'
import { NavLink } from 'react-router-dom'
import { ROUTE_PATHS } from '../router/routes'
import { useAuthStore } from '../store/authStore'

function DefaultLayout({ children }: PropsWithChildren) {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="min-h-screen bg-(--color-near-black)">
      <div className="grid min-h-screen grid-cols-[290px_1fr]">
        <aside className="border-r border-(--color-border-slate) bg-(--color-card-slate) p-4">
          <Stack gap="lg" h="100%" justify="space-between">
            <Stack gap="sm">

              <Title order={4} className="text-(--color-white-ui)">BarbellBites</Title>
              <Text size="sm" className="text-(--color-white-ui)">
                {user?.email ?? 'Guest'}
              </Text>


              <Button component={NavLink} to={ROUTE_PATHS.RECIPES} fullWidth styles={{root:{background: 'var(--color-primary-teal)', color: 'var(--color-white-ui)', fontWeight: 700, letterSpacing: '0.03em'}}}>
                Recipes
              </Button>
              <Button component={NavLink} to={ROUTE_PATHS.FAVORITES} fullWidth styles={{root:{background: 'var(--color-deep-teal)', color: 'var(--color-white-ui)', fontWeight: 700, letterSpacing: '0.03em'}}}>
                Favorite Recipes
              </Button>

              <Divider my="xs" color="var(--color-border-slate)" />


              <TextInput
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.currentTarget.value)}
                placeholder="Search recipes"
                leftSection={<IconSearch size={16} color="#FAFBFB" />}
                size="sm"
                styles={{
                  input: {
                    background: 'var(--color-deep-surface)',
                    color: 'var(--color-white-ui)',
                    border: '1px solid var(--color-border-slate)',
                  },
                }}
                classNames={{input: 'bb-search-input'}}
              />


              <Stack gap={6} mt="xs">
                <Text fw={700} size="sm" className="text-(--color-white-ui)">
                  Meal Type
                </Text>
                <Checkbox label="Breakfast" size="sm" color="teal" styles={{label:{color:'var(--color-white-ui)', fontWeight: 500}}}/>
                <Checkbox label="Lunch" size="sm" color="teal" styles={{label:{color:'var(--color-white-ui)', fontWeight: 500}}}/>
                <Checkbox label="Dinner" size="sm" color="teal" styles={{label:{color:'var(--color-white-ui)', fontWeight: 500}}}/>
                <Checkbox label="Snack" size="sm" color="teal" styles={{label:{color:'var(--color-white-ui)', fontWeight: 500}}}/>
              </Stack>


              <Stack gap={6} mt="xs">
                <Text fw={700} size="sm" className="text-(--color-white-ui)">
                  Dietary Preference
                </Text>
                <Checkbox label="High Protein" size="sm" color="teal" styles={{label:{color:'var(--color-white-ui)', fontWeight: 500}}}/>
                <Checkbox label="Low Carb" size="sm" color="teal" styles={{label:{color:'var(--color-white-ui)', fontWeight: 500}}}/>
                <Checkbox label="Keto" size="sm" color="teal" styles={{label:{color:'var(--color-white-ui)', fontWeight: 500}}}/>
                <Checkbox label="Vegetarian" size="sm" color="teal" styles={{label:{color:'var(--color-white-ui)', fontWeight: 500}}}/>
              </Stack>


              <Stack gap={6} mt="xs">
                <Text fw={700} size="sm" className="text-(--color-white-ui)">
                  Health Goals
                </Text>
                <Checkbox label="Weight Loss" size="sm" color="teal" styles={{label:{color:'var(--color-white-ui)', fontWeight: 500}}}/>
                <Checkbox label="Muscle Gain" size="sm" color="teal" styles={{label:{color:'var(--color-white-ui)', fontWeight: 500}}}/>
                <Checkbox label="Maintain Weight" size="sm" color="teal" styles={{label:{color:'var(--color-white-ui)', fontWeight: 500}}}/>
                <Checkbox label="Heart Health" size="sm" color="teal" styles={{label:{color:'var(--color-white-ui)', fontWeight: 500}}}/>
              </Stack>
            </Stack>

            <Button variant="default" onClick={() => void logout()} fullWidth styles={{root:{background:'var(--color-primary-teal)',color:'var(--color-white-ui)',fontWeight:700}}}>
              Logout
            </Button>
          </Stack>
        </aside>

        <section className="p-6 bg-(--color-near-black)">{children}</section>
      </div>
    </div>
  )
}

export default DefaultLayout
