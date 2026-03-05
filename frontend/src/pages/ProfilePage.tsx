import { useEffect, useState } from 'react'
import { Card, Loader, Stack, Text, Title } from '@mantine/core'
import { getCurrentProfile } from '../api/profileApi'

type ProfileUser = {
  id?: string
  _id?: string
  name?: string
  email?: string
}

function ProfilePage() {
	const [user, setUser] = useState<ProfileUser | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	useEffect(() => {
		const loadProfile = async () => {
			try {
				setLoading(true)
				setError('')
				const response = await getCurrentProfile()
				setUser(response?.data?.user ?? null)
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : 'Failed to load profile'
				setError(message)
			} finally {
				setLoading(false)
			}
		}

		void loadProfile()
	}, [])

	return (
		<div className="mx-auto max-w-4xl px-4 py-8">
			<Card withBorder radius="lg" className="border-white/10 bg-white/5 p-6 backdrop-blur-xl">
				<Stack gap="sm">
					<Text className="text-paper font-black uppercase tracking-[0.15em] text-sm">
						Barbell <span className="text-brand-500">Bites</span>
					</Text>
					<Title order={2} className="text-paper font-bold">Profile & Goals</Title>

					{loading && (
						<div className="py-3">
							<Loader size="sm" />
						</div>
					)}

					{!loading && error && (
						<Text className="text-red-300 text-sm">{error}</Text>
					)}

					{!loading && !error && user && (
						<Stack gap={4}>
							<Text className="text-paper/80 text-sm">
								Name: <span className="text-paper font-semibold">{user.name ?? '—'}</span>
							</Text>
							<Text className="text-paper/80 text-sm">
								Email: <span className="text-paper font-semibold">{user.email ?? '—'}</span>
							</Text>
						</Stack>
					)}

					{!loading && !error && !user && (
						<Text className="text-paper/70 text-sm">No profile data available.</Text>
					)}
				</Stack>
			</Card>
		</div>
	)
}

export default ProfilePage