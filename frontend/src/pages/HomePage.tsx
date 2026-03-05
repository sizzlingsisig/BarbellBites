import { Badge, Button, Card, Group, Stack, Text } from '@mantine/core'
import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Stack gap="lg">
        <Group justify="space-between" align="center" className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
          <Text className="text-paper font-black uppercase tracking-[0.15em] text-xl">
            Barbell <span className="text-brand-500">Bites</span>
          </Text>
          <Badge className="bg-brand-500/10 text-brand-400 border-brand-500/20" variant="light">
            Router Ready
          </Badge>
        </Group>

        <Card shadow="sm" radius="md" withBorder className="bg-white/5 border-white/10 backdrop-blur-xl text-paper">
          <Stack gap="sm">
            <Text fw={700} className="text-paper">Frontend starter is configured</Text>
            <Text className="text-paper/70 text-sm">
              Routes are set up using React Router. Next step is plugging login/register screens into the auth store.
            </Text>

            <Group mt="sm">
              <Button
                component={Link}
                to="/login"
                className="font-bold tracking-wide uppercase text-xs"
                styles={{
                  root: {
                    backgroundImage: 'linear-gradient(135deg, var(--color-near-black) 0%, var(--color-deep-teal) 45%, var(--color-glow-teal) 100%)',
                    border: '1px solid rgba(0, 200, 150, 0.45)',
                    color: 'var(--color-white-ui)',
                  },
                }}
              >
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