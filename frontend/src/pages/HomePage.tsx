import { Badge, Button, Card, Group, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Title order={1}>BarbellBites</Title>
          <Badge color="green" variant="light">
            Router Ready
          </Badge>
        </Group>

        <Card shadow="sm" radius="md" withBorder className="bg-white">
          <Stack gap="sm">
            <Text fw={600}>Frontend starter is configured</Text>
            <Text c="dimmed" className="text-sm">
              Routes are now set up using React Router. Next step is plugging login/register screens into the auth store.
            </Text>

            <Group mt="sm">
              <Button component={Link} to="/auth">
                Go to Auth
              </Button>
            </Group>
          </Stack>
        </Card>
      </Stack>
    </main>
  )
}

export default HomePage