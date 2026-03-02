import { Card, Stack, Text, Title } from '@mantine/core'

function MyRecipesPage() {
	return (
		<div className="mx-auto max-w-4xl px-4 py-8">
			<Card withBorder radius="lg" className="border-white/10 bg-white/5 p-6 backdrop-blur-xl">
				<Stack gap="sm">
					<Text className="text-paper font-black uppercase tracking-[0.15em] text-sm">
						Barbell <span className="text-brand-500">Bites</span>
					</Text>
					<Title order={2} className="text-paper font-bold">My Recipes</Title>
					<Text className="text-paper/70 text-sm">
						Owner-managed recipe editing and publishing will be available here.
					</Text>
				</Stack>
			</Card>
		</div>
	)
}

export default MyRecipesPage