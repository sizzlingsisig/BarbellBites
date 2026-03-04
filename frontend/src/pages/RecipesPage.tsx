import { useEffect, useState } from 'react'
import { Button, Grid, Modal, Select, Stack, Text, TextInput, Textarea, Title } from '@mantine/core'
import { RecipeCard } from '../components/RecipeCard'
import { createRecipe, getRecipes } from '../api/recipesApi'

type RecipeApiItem = {
  _id: string
  slug: string
  title: string
  visibility: 'public' | 'private'
  tags?: string[]
}

type CreateFormState = {
  title: string
  description: string
  visibility: 'public' | 'private'
  tags: string
  ingredientName: string
  ingredientAmount: string
  ingredientUnit: string
  instructions: string
  calories: string
  protein: string
  carbs: string
  fats: string
}

const initialFormState: CreateFormState = {
  title: '',
  description: '',
  visibility: 'public',
  tags: '',
  ingredientName: '',
  ingredientAmount: '',
  ingredientUnit: '',
  instructions: '',
  calories: '0',
  protein: '0',
  carbs: '0',
  fats: '0',
}

function RecipesPage() {
  const [recipes, setRecipes] = useState<RecipeApiItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [createOpen, setCreateOpen] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState('')
  const [form, setForm] = useState<CreateFormState>(initialFormState)

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

  const handleCreateRecipe = async () => {
    try {
      setCreateError('')
      setCreateLoading(true)

      await createRecipe({
        title: form.title,
        description: form.description,
        visibility: form.visibility,
        tags: form.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        ingredients: [
          {
            name: form.ingredientName,
            amount: form.ingredientAmount,
            unit: form.ingredientUnit,
          },
        ],
        instructions: form.instructions
          .split('|')
          .map((step) => step.trim())
          .filter(Boolean),
        nutrition: {
          calories: Number(form.calories),
          protein: Number(form.protein),
          carbs: Number(form.carbs),
          fats: Number(form.fats),
        },
      })

      setCreateOpen(false)
      setForm(initialFormState)
      await loadRecipes()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create recipe'
      setCreateError(message)
    } finally {
      setCreateLoading(false)
    }
  }

  const cardRecipes = recipes.map((recipe) => ({
    id: recipe.slug,
    name: recipe.title,
    mealType: recipe.tags?.[0] ?? recipe.visibility,
    goal: recipe.tags?.[1] ?? 'General',
  }))

  return (
    <div className="h-full flex flex-col gap-6">
      <Modal
        opened={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Recipe"
        centered
      >
        <Stack gap="sm">
          {createError && <Text c="red.5" size="sm">{createError}</Text>}

          <TextInput
            label="Title"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.currentTarget.value }))}
            required
          />
          <Textarea
            label="Description"
            minRows={2}
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.currentTarget.value }))}
            required
          />
          <Select
            label="Visibility"
            data={[
              { value: 'public', label: 'Public' },
              { value: 'private', label: 'Private' },
            ]}
            value={form.visibility}
            onChange={(value) => setForm((prev) => ({ ...prev, visibility: (value as 'public' | 'private') ?? 'public' }))}
          />
          <TextInput
            label="Tags"
            description="Comma-separated"
            value={form.tags}
            onChange={(event) => setForm((prev) => ({ ...prev, tags: event.currentTarget.value }))}
          />

          <TextInput
            label="Ingredient Name"
            value={form.ingredientName}
            onChange={(event) => setForm((prev) => ({ ...prev, ingredientName: event.currentTarget.value }))}
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <TextInput
              label="Ingredient Amount"
              value={form.ingredientAmount}
              onChange={(event) => setForm((prev) => ({ ...prev, ingredientAmount: event.currentTarget.value }))}
              required
            />
            <TextInput
              label="Ingredient Unit"
              value={form.ingredientUnit}
              onChange={(event) => setForm((prev) => ({ ...prev, ingredientUnit: event.currentTarget.value }))}
              required
            />
          </div>

          <Textarea
            label="Instructions"
            description="Separate steps with |"
            minRows={2}
            value={form.instructions}
            onChange={(event) => setForm((prev) => ({ ...prev, instructions: event.currentTarget.value }))}
            required
          />

          <div className="grid grid-cols-2 gap-2">
            <TextInput
              label="Calories"
              value={form.calories}
              onChange={(event) => setForm((prev) => ({ ...prev, calories: event.currentTarget.value }))}
              required
            />
            <TextInput
              label="Protein"
              value={form.protein}
              onChange={(event) => setForm((prev) => ({ ...prev, protein: event.currentTarget.value }))}
              required
            />
            <TextInput
              label="Carbs"
              value={form.carbs}
              onChange={(event) => setForm((prev) => ({ ...prev, carbs: event.currentTarget.value }))}
              required
            />
            <TextInput
              label="Fats"
              value={form.fats}
              onChange={(event) => setForm((prev) => ({ ...prev, fats: event.currentTarget.value }))}
              required
            />
          </div>

          <Button loading={createLoading} onClick={handleCreateRecipe}>
            Create Recipe
          </Button>
        </Stack>
      </Modal>

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
              onClick={() => setCreateOpen(true)}
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