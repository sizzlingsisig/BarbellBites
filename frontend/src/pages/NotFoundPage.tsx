import { Button, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-(--color-near-black) px-4 font-sans selection:bg-(--color-primary-teal) selection:text-(--color-near-black)">
      <div className="absolute left-6 top-6 z-20">
        <Text className="text-paper font-black uppercase tracking-[0.15em] text-xl">
          Barbell <span className="text-brand-500">Bites</span>
        </Text>
      </div>

      <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center">
        <Stack align="center" gap="xs" className="w-full rounded-2xl border border-white/10 bg-white/5 px-8 py-10 text-center backdrop-blur-xl">
          <Title order={2} className="text-paper font-bold">Page not found</Title>
          <Text className="text-paper/70">The route you requested does not exist.</Text>
          <Button
            component={Link}
            to="/"
            radius="md"
            className="mt-3 font-bold tracking-wide uppercase text-sm"
            styles={{
              root: {
                backgroundImage: 'linear-gradient(135deg, var(--color-near-black) 0%, var(--color-deep-teal) 45%, var(--color-glow-teal) 100%)',
                border: '1px solid rgba(0, 200, 150, 0.45)',
                color: 'var(--color-white-ui)',
              },
            }}
          >
            Go Home
          </Button>
        </Stack>
      </div>
    </main>

  )
}

export default NotFoundPage