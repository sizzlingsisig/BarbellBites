import { Button, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
      <Stack align="center" gap="xs">
        <Title order={2}>Page not found</Title>
        <Text c="dimmed">The route you requested does not exist.</Text>
        <Button component={Link} to="/" variant="light">
          Go Home
        </Button>
      </Stack>
    </main>
  )
}

export default NotFoundPage