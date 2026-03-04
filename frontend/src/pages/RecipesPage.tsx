import { useEffect, useState } from 'react'
import { Button, Grid, Text, Title } from '@mantine/core'
import { RecipeCard } from '../components/RecipeCard'
import { createRecipe, getRecipes, type RecipeMutationPayload } from '../api/recipesApi'
import CreateRecipeModal from '../components/CreateRecipeModal'
import { notifyError, notifySuccess } from '../services/notify'

type RecipeApiItem = {
  _id: string
  slug: string
  title: string
  visibility: 'public' | 'private'
  diets?: string[]
  mealTypes?: string[]
  cuisines?: string[]
}

function RecipesPage() {
  const [recipes, setRecipes] = useState<RecipeApiItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [createOpen, setCreateOpen] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState('')

  const loadRecipes = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getRecipes()
      setRecipes(Array.isArray(data) ? data : [])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load recipes'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadRecipes()
  }, [])

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
      await loadRecipes()
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

  const cardRecipes = recipes.map((recipe) => ({
    id: recipe.slug,
    name: recipe.title,
    mealType: recipe.mealTypes?.[0] ?? recipe.visibility,
    goal: recipe.diets?.[0] ?? recipe.cuisines?.[0] ?? 'General',
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
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{
                background: 'rgba(0,200,150,0.08)',
                border: '1px solid rgba(0,200,150,0.2)',
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#00c896', boxShadow: '0 0 6px #00c896' }}
              />
              <Text
                size="xs"
                style={{ color: '#1DDFBD', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}
              >
                {cardRecipes.length} Recipes
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

        {cardRecipes.map((recipe) => (
          <Grid.Col key={recipe.id} span={{ base: 12, sm: 6, md: 4 }}>
            <RecipeCard {...recipe} />
          </Grid.Col>
        ))}
      </Grid>

    </div>
  )
}

export default RecipesPage