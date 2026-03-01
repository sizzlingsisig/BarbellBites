import { Button, Checkbox, Divider, Stack, Text, TextInput, Title, useMantineTheme } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { useState, type PropsWithChildren } from 'react'
import { NavLink } from 'react-router-dom'
import { ROUTE_PATHS } from '../router/routes'
import { useAuthStore } from '../store/authStore'

function DefaultLayout({ children }: PropsWithChildren) {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [searchTerm, setSearchTerm] = useState('')
  const theme = useMantineTheme()

  return (
    <div style={{ minHeight: '100vh', background: theme.colors.brand[9] }}>
      <div style={{ display: 'grid', minHeight: '100vh', gridTemplateColumns: '290px 1fr' }}>
        <aside style={{ borderRight: `1px solid ${theme.colors.brand[7]}`, background: theme.colors.brand[6], padding: '1rem' }}>
          <Stack gap="lg" h="100%" justify="space-between">
            <Stack gap="sm">

              <Title order={4} style={{ color: theme.colors.brand[5], fontFamily: theme.headings.fontFamily }}>BarbellBites</Title>
              <Text size="sm" style={{ color: theme.colors.brand[5] }}>
                {user?.email ?? 'Guest'}
              </Text>


              <Button component={NavLink} to={ROUTE_PATHS.RECIPES} fullWidth styles={{root:{background: theme.colors.brand[0], color: theme.colors.brand[5], fontWeight: theme.headings.fontWeight, letterSpacing: '0.03em', boxShadow: theme.shadows.sm}}}>
                Recipes
              </Button>
              <Button component={NavLink} to={ROUTE_PATHS.FAVORITES} fullWidth styles={{root:{background: theme.colors.brand[2], color: theme.colors.brand[5], fontWeight: theme.headings.fontWeight, letterSpacing: '0.03em', boxShadow: theme.shadows.sm}}}>
                Favorite Recipes
              </Button>

              <Divider my="xs" color={theme.colors.brand[7]} />


              <TextInput
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.currentTarget.value)}
                placeholder="Search recipes"
                leftSection={<IconSearch size={16} color={theme.colors.brand[5]} />}
                size="sm"
                styles={{
                  input: {
                    background: theme.colors.brand[8],
                    color: theme.colors.brand[5],
                    border: `1px solid ${theme.colors.brand[7]}`,
                  },
                }}
                classNames={{input: 'bb-search-input'}}
              />


              <Stack gap={6} mt="xs">
                <Text fw={theme.headings.fontWeight} size="sm" style={{ color: theme.colors.brand[5] }}>
                  Meal Type
                </Text>
                <Checkbox label="Breakfast" size="sm" color="brand" styles={{label:{color:theme.colors.brand[5], fontWeight: theme.headings.fontWeight}}}/>
                <Checkbox label="Lunch" size="sm" color="brand" styles={{label:{color:theme.colors.brand[5], fontWeight: theme.headings.fontWeight}}}/>
                <Checkbox label="Dinner" size="sm" color="brand" styles={{label:{color:theme.colors.brand[5], fontWeight: theme.headings.fontWeight}}}/>
                <Checkbox label="Snack" size="sm" color="brand" styles={{label:{color:theme.colors.brand[5], fontWeight: theme.headings.fontWeight}}}/>
              </Stack>


              <Stack gap={6} mt="xs">
                <Text fw={700} size="sm" className="text-(--color-white-ui)">
                  Dietary Preference
                </Text>
                <Checkbox label="High Protein" size="sm" color="brand" styles={{label:{color:theme.colors.brand[5], fontWeight: theme.headings.fontWeight}}}/>
                <Checkbox label="Low Carb" size="sm" color="brand" styles={{label:{color:theme.colors.brand[5], fontWeight: theme.headings.fontWeight}}}/>
                <Checkbox label="Keto" size="sm" color="brand" styles={{label:{color:theme.colors.brand[5], fontWeight: theme.headings.fontWeight}}}/>
                <Checkbox label="Vegetarian" size="sm" color="brand" styles={{label:{color:theme.colors.brand[5], fontWeight: theme.headings.fontWeight}}}/>
              </Stack>


              <Stack gap={6} mt="xs">
                <Text fw={700} size="sm" className="text-(--color-white-ui)">
                  Health Goals
                </Text>
                <Checkbox label="Weight Loss" size="sm" color="brand" styles={{label:{color:theme.colors.brand[5], fontWeight: theme.headings.fontWeight}}}/>
                <Checkbox label="Muscle Gain" size="sm" color="brand" styles={{label:{color:theme.colors.brand[5], fontWeight: theme.headings.fontWeight}}}/>
                <Checkbox label="Maintain Weight" size="sm" color="brand" styles={{label:{color:theme.colors.brand[5], fontWeight: theme.headings.fontWeight}}}/>
                <Checkbox label="Heart Health" size="sm" color="brand" styles={{label:{color:theme.colors.brand[5], fontWeight: theme.headings.fontWeight}}}/>
              </Stack>
            </Stack>

            <Button variant="default" onClick={() => void logout()} fullWidth styles={{root:{background:theme.colors.brand[0],color:theme.colors.brand[5],fontWeight:theme.headings.fontWeight}}}>
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
