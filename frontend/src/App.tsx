import { Badge, Button, Card, Group, Stack, Text, Title } from '@mantine/core'

function App() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Title order={1}>BarbellBites</Title>
          <Badge color="green" variant="light">
            Ready
          </Badge>
        </Group>

        <Card shadow="sm" radius="md" withBorder className="bg-white">
          <Stack gap="sm">
            <Text fw={600}>Frontend starter is configured</Text>
            <Text c="dimmed" className="text-sm">
              Mantine provides structure and components, while Tailwind handles quick layout and spacing utilities.
            </Text>

            <Group mt="sm">
              <Button>Primary action</Button>
              <Button variant="default">Secondary action</Button>
            </Group>
          </Stack>
        </Card>
      </Stack>
    </main>
  )
}

export default App
