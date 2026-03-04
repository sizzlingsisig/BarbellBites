import { useEffect, useMemo, useState } from 'react'
import { ActionIcon, Button, Card, Grid, Group, Menu, Text, Title } from '@mantine/core'
import { Link } from 'react-router-dom'
import { IconDotsVertical, IconEye, IconPencil, IconTrash } from '@tabler/icons-react'
import CreateRecipeModal from '../components/CreateRecipeModal'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'
import { RecipeCard } from '../components/RecipeCard'
import {
	createRecipe,
	getRecipeById,
	getUserRecipes,
	type RecipeListItem,
	type RecipeMutationPayload,
	updateRecipe,
} from '../api/recipesApi'
import { notifyError, notifySuccess } from '../services/notify'
import { useRecipeDeleteWithUndo } from '../hooks/useRecipeDeleteWithUndo'

function MyRecipesPage() {
	const [recipes, setRecipes] = useState<RecipeListItem[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const [page, setPage] = useState(1)
	const [limit] = useState(6)
	const [totalPages, setTotalPages] = useState(0)
	const [totalRecipes, setTotalRecipes] = useState(0)

	const [createOpen, setCreateOpen] = useState(false)
	const [createLoading, setCreateLoading] = useState(false)
	const [createError, setCreateError] = useState('')

	const [editOpen, setEditOpen] = useState(false)
	const [editLoading, setEditLoading] = useState(false)
	const [editError, setEditError] = useState('')
	const [editingRecipeSlug, setEditingRecipeSlug] = useState<string | null>(null)
	const [editInitialValues, setEditInitialValues] = useState<RecipeMutationPayload | null>(null)

	const { openDeleteModal: openUndoDeleteModal, modalProps, deletingSlug } = useRecipeDeleteWithUndo()

	const loadRecipes = async (nextPage = page) => {
		try {
			setLoading(true)
			setError('')
			const data = await getUserRecipes({ page: nextPage, limit })
			setRecipes(Array.isArray(data.items) ? data.items : [])
			setTotalPages(data.pagination?.totalPages ?? 0)
			setTotalRecipes(data.pagination?.total ?? 0)
			setPage(data.pagination?.page ?? nextPage)
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Failed to load your recipes'
			setError(message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		void loadRecipes(page)
	}, [page])

	const cardRecipes = useMemo(
		() =>
			recipes.map((recipe) => ({
				id: recipe.slug,
				name: recipe.title,
				description: recipe.description,
				mealType: recipe.mealTypes?.[0] ?? recipe.visibility,
				goal: recipe.diets?.[0] ?? recipe.cuisines?.[0] ?? 'General',
				visibility: recipe.visibility,
				totalTime: recipe.totalTime,
				servings: recipe.servings,
				calories: recipe.nutritionPerServing?.calories,
			})),
		[recipes],
	)

	const handleCreateRecipe = async (payload: RecipeMutationPayload) => {
		try {
			setCreateError('')
			setCreateLoading(true)

			await createRecipe(payload)
			notifySuccess({
				title: 'Recipe Created',
				message: 'Your recipe was saved successfully.',
			})

			setCreateOpen(false)
			await loadRecipes(1)
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Failed to create recipe'
			setCreateError(message)
			notifyError({
				title: 'Create Recipe Failed',
				message,
			})
		} finally {
			setCreateLoading(false)
		}
	}

	const openEditModal = async (recipe: RecipeListItem) => {
		try {
			setEditLoading(true)
			setEditError('')
			setEditingRecipeSlug(recipe.slug)

			const detail = await getRecipeById(recipe.slug)
			const instructions = Array.isArray(detail?.steps)
				? detail.steps
				: Array.isArray(detail?.instructions)
					? detail.instructions
					: []

			const nutritionSource = detail?.nutritionPerServing ?? detail?.nutrition ?? {
				calories: 0,
				protein: 0,
				carbs: 0,
				fats: 0,
			}

			setEditInitialValues({
				title: detail?.title ?? recipe.title,
				description: detail?.description ?? recipe.description ?? '',
				visibility: detail?.visibility === 'private' ? 'private' : 'public',
				prepTime: detail?.prepTime ?? 0,
				cookTime: detail?.cookTime ?? 0,
				totalTime: detail?.totalTime ?? (detail?.prepTime ?? 0) + (detail?.cookTime ?? 0),
				servings: detail?.servings ?? 1,
				servingSize: detail?.servingSize ?? '',
				diets: Array.isArray(detail?.diets) ? detail.diets : [],
				mealTypes: Array.isArray(detail?.mealTypes) ? detail.mealTypes : [],
				cuisines: Array.isArray(detail?.cuisines) ? detail.cuisines : [],
				ingredients: Array.isArray(detail?.ingredients) ? detail.ingredients : [],
				instructions,
				nutrition: {
					calories: nutritionSource.calories ?? 0,
					protein: nutritionSource.protein ?? 0,
					carbs: nutritionSource.carbs ?? 0,
					fats: nutritionSource.fats ?? 0,
				},
			})

			setEditOpen(true)
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Failed to load recipe for editing'
			setEditError(message)
			notifyError({
				title: 'Open Edit Failed',
				message,
			})
		} finally {
			setEditLoading(false)
		}
	}

	const handleUpdateRecipe = async (payload: RecipeMutationPayload) => {
		if (!editingRecipeSlug) {
			return
		}

		try {
			setEditLoading(true)
			setEditError('')

			await updateRecipe(editingRecipeSlug, payload)

			notifySuccess({
				title: 'Recipe Updated',
				message: 'Your recipe has been updated.',
			})

			setEditOpen(false)
			setEditInitialValues(null)
			await loadRecipes(page)
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Failed to update recipe'
			setEditError(message)
			notifyError({
				title: 'Update Failed',
				message,
			})
		} finally {
			setEditLoading(false)
		}
	}

	const handleOpenDeleteModal = (slug: string) => {
		const recipe = recipes.find((item) => item.slug === slug)
		if (!recipe) {
			return
		}

		openUndoDeleteModal({
			slug: recipe.slug,
			title: recipe.title,
			onDeleted: async () => {
				const shouldGoPrevPage = recipes.length === 1 && page > 1
				await loadRecipes(shouldGoPrevPage ? page - 1 : page)
			},
			onUndone: async () => {
				await loadRecipes(page)
			},
		})
	}

	return (
		<div className="h-full flex flex-col gap-6">
			<CreateRecipeModal
				opened={createOpen}
				loading={createLoading}
				error={createError}
				onClose={() => setCreateOpen(false)}
				onSubmit={handleCreateRecipe}
			/>

			<CreateRecipeModal
				opened={editOpen}
				loading={editLoading}
				error={editError}
				onClose={() => {
					if (!editLoading) {
						setEditOpen(false)
						setEditInitialValues(null)
					}
				}}
				onSubmit={handleUpdateRecipe}
				mode="edit"
				initialValues={editInitialValues}
			/>

			<ConfirmDeleteModal
				{...modalProps}
			/>

			<div
				className="relative rounded-2xl overflow-hidden p-6"
				style={{
					background: 'rgba(255,255,255,0.04)',
					backdropFilter: 'blur(32px) saturate(180%)',
					WebkitBackdropFilter: 'blur(32px) saturate(180%)',
					border: '1px solid rgba(255,255,255,0.09)',
					boxShadow: '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
				}}
			>
				<div className="relative z-10 flex items-end justify-between">
					<div>
						<Text
							size="xs"
							style={{
								color: '#00c896',
								fontWeight: 700,
								letterSpacing: '0.14em',
								textTransform: 'uppercase',
								marginBottom: '6px',
							}}
						>
							<span>Barbell Bites</span>
						</Text>
						<Title
							order={2}
							style={{
								color: 'rgba(255,255,255,0.95)',
								fontWeight: 800,
								fontSize: '1.75rem',
								letterSpacing: '-0.02em',
								lineHeight: 1.2,
								marginBottom: '6px',
							}}
						>
							My Recipes
						</Title>
						<Text size="sm" style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.01em' }}>
							Manage recipes you own: create, read, update, and delete.
						</Text>
					</div>

					<Button
						onClick={() => {
							setCreateError('')
							setCreateOpen(true)
						}}
						size="xs"
						radius="md"
						style={{
							background: 'rgba(0,200,150,0.14)',
							border: '1px solid rgba(0,200,150,0.28)',
							color: '#1DDFBD',
							fontWeight: 700,
						}}
					>
						Create Recipe
					</Button>
				</div>
			</div>

			<Grid gutter="md" className="flex-1">
				{error && (
					<Grid.Col span={12}>
						<Text c="red.5">{error}</Text>
					</Grid.Col>
				)}

				{!error && !loading && cardRecipes.length === 0 && (
					<Grid.Col span={12}>
						<Card withBorder radius="lg" className="border-white/10 bg-white/5 p-6 backdrop-blur-xl">
							<Text c="dimmed">You don’t have any recipes yet. Create one to get started.</Text>
						</Card>
					</Grid.Col>
				)}

				{cardRecipes.map((recipe) => (
					<Grid.Col key={recipe.id} span={{ base: 12, sm: 6, md: 4 }}>
						<RecipeCard
							{...recipe}
							actionMenu={
								<Menu withinPortal position="bottom-end" shadow="md">
									<Menu.Target>
										<ActionIcon variant="subtle" color="gray" aria-label="Recipe actions">
											<IconDotsVertical size={16} />
										</ActionIcon>
									</Menu.Target>
									<Menu.Dropdown>
										<Menu.Item
											leftSection={<IconEye size={14} />}
											component={Link}
											to={`/recipes/${recipe.id}`}
										>
											View Recipe
										</Menu.Item>
										<Menu.Item
											leftSection={<IconPencil size={14} />}
											onClick={() => {
												const current = recipes.find((item) => item.slug === recipe.id)
												if (current) {
													void openEditModal(current)
												}
											}}
										>
											Edit Recipe
										</Menu.Item>
										<Menu.Item
											color="red"
											leftSection={<IconTrash size={14} />}
											onClick={() => handleOpenDeleteModal(recipe.id)}
											disabled={deletingSlug === recipe.id}
										>
											Delete Recipe
										</Menu.Item>
									</Menu.Dropdown>
								</Menu>
							}
						/>
					</Grid.Col>
				))}
			</Grid>

			{!error && totalPages > 0 && (
				<Group justify="space-between" align="center">
					<Text size="sm" c="dimmed">
						Page {page} of {totalPages} • {totalRecipes} total recipes
					</Text>
					<Group gap="sm">
						<Button variant="default" size="xs" disabled={loading || page <= 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
							Previous
						</Button>
						<Button variant="default" size="xs" disabled={loading || page >= totalPages} onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}>
							Next
						</Button>
					</Group>
				</Group>
			)}
		</div>
	)
}

export default MyRecipesPage