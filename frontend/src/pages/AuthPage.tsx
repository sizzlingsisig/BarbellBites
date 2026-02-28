import { Button, Card, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router-dom'

function AuthPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <Card shadow="sm" radius="md" withBorder className="bg-white">
        <Stack gap="sm">
          <Title order={2}>Auth</Title>
          <Text c="dimmed">Login/Register UI goes here.</Text>
          <Button component={Link} to="/" variant="default">
            Back Home
          </Button>
        </Stack>
      </Card>
    </main>
  )
}

export default AuthPage