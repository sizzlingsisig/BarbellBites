import { useEffect, useState } from 'react'
import { ActionIcon, Button, Grid, Group, Text, Title } from '@mantine/core'
import { IconHeart, IconHeartFilled } from '@tabler/icons-react'
import { RecipeCard } from '../components/RecipeCard'
import { createRecipe, getRecipes, type RecipeListItem, type RecipeMutationPayload } from '../api/recipesApi'
import CreateRecipeModal from '../components/CreateRecipeModal'
import { notifyError, notifySuccess } from '../services/notify'
import { RECIPES_REFRESH_EVENT } from '../hooks/useRecipeDeleteWithUndo'
import { addFavorite, getFavorites, removeFavorite } from '../api/favoritesApi'

function RecipesPage() {
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
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [favoriteLoadingId, setFavoriteLoadingId] = useState<string | null>(null)

  const loadRecipes = async (nextPage = page) => {
    try {
      setLoading(true)
      setError('')
      const data = await getRecipes({ page: nextPage, limit })
      setRecipes(Array.isArray(data.items) ? data.items : [])
      setTotalPages(data.pagination?.totalPages ?? 0)
      setTotalRecipes(data.pagination?.total ?? 0)
      setPage(data.pagination?.page ?? nextPage)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load recipes'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadRecipes(page)
  }, [page])

  const loadFavorites = async () => {
    try {
      const data = await getFavorites()
      const ids = data
        .map((favorite) => favorite.recipeId?._id)
        .filter((recipeId): recipeId is string => Boolean(recipeId))

      setFavoriteIds(new Set(ids))
    } catch {
      setFavoriteIds(new Set())
    }
  }

  useEffect(() => {
    void loadFavorites()
  }, [])

  useEffect(() => {
    const onRefresh = () => {
      void loadRecipes(1)
      void loadFavorites()
    }

    window.addEventListener(RECIPES_REFRESH_EVENT, onRefresh)
    return () => {
      window.removeEventListener(RECIPES_REFRESH_EVENT, onRefresh)
    }
  }, [page])

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
        title: 'Create Recipe Failed: This recipe already exists.',
        message,
      })
    } finally {
      setCreateLoading(false)
    }
  }

  const handleToggleFavorite = async (recipe: RecipeListItem) => {
    const recipeId = recipe._id
    if (!recipeId) {
      return
    }

    try {
      setFavoriteLoadingId(recipeId)
      const isFavorite = favoriteIds.has(recipeId)

      if (isFavorite) {
        await removeFavorite(recipeId)
        notifySuccess({
          title: 'Removed from Favorites',
          message: `${recipe.title} was removed from favorites.`,
        })
      } else {
        await addFavorite(recipeId)
        notifySuccess({
          title: 'Added to Favorites',
          message: `${recipe.title} was added to favorites.`,
        })
      }

      await loadFavorites()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update favorite'
      notifyError({
        title: 'Favorites Failed',
        message,
      })
    } finally {
      setFavoriteLoadingId(null)
    }
  }

  const cardRecipes = recipes.map((recipe) => ({
    id: recipe.slug,
    name: recipe.title,
    description: recipe.description,
    mealType: recipe.mealTypes?.[0] ?? recipe.visibility,
    goal: recipe.diets?.[0] ?? recipe.cuisines?.[0] ?? 'General',
    visibility: recipe.visibility,
    totalTime: recipe.totalTime,
    servings: recipe.servings,
    calories: recipe.nutritionPerServing?.calories,
  }))

  return (
    <div className="h-full flex flex-col gap-6">
      <CreateRecipeModal
        opened={createOpen}
        loading={createLoading}
        error={createError}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateRecipe}
      />

      {/* Page header */}
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
        {/* Top shimmer line */}
        <div
          className="absolute top-0 left-8 right-8 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,200,150,0.5), transparent)' }}
        />

        {/* Ambient glow */}
        <div
          className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,200,150,0.12) 0%, transparent 70%)', filter: 'blur(30px)' }}
        />

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
              Recipes
            </Title>
            <Text
              size="sm"
              style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.01em' }}
            >
              Browse recipes and open any card to view details.
            </Text>
          </div>

          <div className="flex flex-col items-end gap-2">
            {/* Recipe count pill */}
        

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
      </div>

      {/* Grid */}
      <Grid gutter="md" className="flex-1">
        {error && (
          <Grid.Col span={12}>
            <Text c="red.5">{error}</Text>
          </Grid.Col>
        )}

        {!error && !loading && cardRecipes.length === 0 && (
          <Grid.Col span={12}>
            <Text c="dimmed">No recipes found.</Text>
          </Grid.Col>
        )}

        {recipes.map((recipe) => {
          const isFavorite = favoriteIds.has(recipe._id)
          return (
          <Grid.Col key={recipe.slug} span={{ base: 12, sm: 6, md: 4 }}>
            <RecipeCard
              id={recipe.slug}
              name={recipe.title}
              description={recipe.description}
              image={recipe.image}
              mealType={recipe.mealTypes?.[0] ?? recipe.visibility}
              goal={recipe.diets?.[0] ?? recipe.cuisines?.[0] ?? 'General'}
              visibility={recipe.visibility}
              totalTime={recipe.totalTime}
              servings={recipe.servings}
              calories={recipe.nutritionPerServing?.calories}
              actionMenu={
                <ActionIcon
                  variant="subtle"
                  color={isFavorite ? 'red' : 'gray'}
                  aria-label="Toggle favorite"
                  loading={favoriteLoadingId === recipe._id}
                  onClick={() => {
                    void handleToggleFavorite(recipe)
                  }}
                >
                  {isFavorite ? (
                    <IconHeartFilled size={16} />
                  ) : (
                    <IconHeart size={16} />
                  )}
                </ActionIcon>
              }
            />
          </Grid.Col>
          )
        })}
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

export default RecipesPage