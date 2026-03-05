import { useEffect, useRef, useState } from 'react'
import { Badge, Stack, Text, Title, Grid, ThemeIcon, ActionIcon, Loader, Group, Button, Menu } from '@mantine/core'
import PLACEHOLDER_IMAGE from '../components/PlaceholderImage'
import { IconShoppingCart, IconChefHat, IconClock, IconFlame, IconUsers } from '../components/RecipeIcons'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CreateRecipeModal from '../components/CreateRecipeModal'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'
import { getRecipeById, updateRecipe, type RecipeMutationPayload } from '../api/recipesApi'
import { useAuthStore } from '../store/authStore'
import { notifyError, notifySuccess } from '../services/notify'
import { useRecipeDeleteWithUndo } from '../hooks/useRecipeDeleteWithUndo'
import { addFavorite, getFavorites, removeFavorite } from '../api/favoritesApi'

type RecipeResponse = {
  _id?: string
  slug?: string
  owner?: string | { _id?: string; id?: string }
  title: string
  description?: string
  visibility?: 'public' | 'private' | 'unlisted'
  diets?: string[]
  mealTypes?: string[]
  cuisines?: string[]
  prepTime?: number
  cookTime?: number
  totalTime?: number
  servings?: number
  servingSize?: string
  image?: string
  ingredients?: Array<{ name: string; amount: string; unit?: string }>
  steps?: string[]
  instructions?: string[]
  nutritionPerServing?: {
    calories: number
    protein: number
    carbs: number
    fats: number
  }
  nutrition?: {
    calories: number
    protein: number
    carbs: number
    fats: number
  }
}

const extractId = (value: unknown): string | undefined => {
  if (!value) {
    return undefined
  }

  if (typeof value === 'string') {
    return value
  }

  if (typeof value !== 'object') {
    return undefined
  }

  const record = value as Record<string, unknown>
  const possibleId = record._id ?? record.id ?? record.$oid

  if (typeof possibleId === 'string') {
    return possibleId
  }

  if (possibleId && typeof possibleId === 'object') {
    const nested = possibleId as Record<string, unknown>
    if (typeof nested.$oid === 'string') {
      return nested.$oid
    }
  }

  return undefined
}

// You can move these into your global css later if you want
const glassPanel = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(32px) saturate(180%)',
  WebkitBackdropFilter: 'blur(32px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.09)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
} as const

const ShimmerLine = () => (
  <div
    className="absolute top-0 left-6 right-6 h-px"
    style={{ background: 'linear-gradient(90deg, transparent, rgba(0,200,150,0.5), transparent)' }}
  />
)

const DotsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
)

function RecipeDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const currentUser = useAuthStore((state) => state.user)
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editOpen, setEditOpen] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  
  // New state for interactive ingredients
  const [checkedIngredients, setCheckedIngredients] = useState<number[]>([])
  
  const initialTitleRef = useRef(document.title)
  const { openDeleteModal, modalProps } = useRecipeDeleteWithUndo()

  useEffect(() => {
    const loadRecipe = async () => {
      if (!slug) {
        setRecipe(null)
        return
      }

      try {
        setLoading(true)
        setError('')
        const data = await getRecipeById(slug)
        setRecipe(data as RecipeResponse)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load recipe'
        setError(message)
        setRecipe(null)
      } finally {
        setLoading(false)
      }
    }

    void loadRecipe()
  }, [slug])

  useEffect(() => {
    if (loading) {
      document.title = 'BarbellBites | Loading Recipe'
      return
    }

    if (error) {
      document.title = 'BarbellBites | Recipe Not Found'
      return
    }

    if (recipe?.title) {
      document.title = `BarbellBites | ${recipe.title}`
      return
    }

    document.title = 'BarbellBites | View Recipe'
  }, [loading, error, recipe?.title])

  useEffect(() => {
    const loadFavoriteState = async () => {
      if (!recipe?._id) {
        setIsFavorite(false)
        return
      }

      try {
        const favorites = await getFavorites()
        const exists = favorites.some((favorite) => favorite.recipeId?._id === recipe._id)
        setIsFavorite(exists)
      } catch {
        setIsFavorite(false)
      }
    }

    void loadFavoriteState()
  }, [recipe?._id])

  useEffect(() => {
    return () => {
      document.title = initialTitleRef.current
    }
  }, [])

  const nutrition = recipe?.nutritionPerServing ?? recipe?.nutrition
  const ingredients = recipe?.ingredients ?? []
  const steps = recipe?.steps ?? recipe?.instructions ?? []
  const ownerId = extractId(recipe?.owner)
  const currentUserId = extractId(currentUser)
  const canManageRecipe = Boolean(currentUserId) && (!ownerId || ownerId === currentUserId)

  const editInitialValues: RecipeMutationPayload | null = recipe
    ? {
        title: recipe.title,
        description: recipe.description ?? '',
        visibility: recipe.visibility === 'private' ? 'private' : 'public',
        prepTime: recipe.prepTime ?? 0,
        cookTime: recipe.cookTime ?? 0,
        totalTime: recipe.totalTime ?? (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0),
        servings: recipe.servings ?? 1,
        servingSize: recipe.servingSize ?? '',
        diets: recipe.diets ?? [],
        mealTypes: recipe.mealTypes ?? [],
        cuisines: recipe.cuisines ?? [],
        ingredients: recipe.ingredients ?? [],
        instructions: steps,
        nutrition: {
          calories: nutrition?.calories ?? 0,
          protein: nutrition?.protein ?? 0,
          carbs: nutrition?.carbs ?? 0,
          fats: nutrition?.fats ?? 0,
        },
      }
    : null

  const handleUpdateRecipe = async (payload: RecipeMutationPayload) => {
    if (!slug) {
      return
    }

    try {
      setEditLoading(true)
      setEditError('')
      await updateRecipe(slug, payload)
      notifySuccess({
        title: 'Recipe Updated',
        message: 'Recipe details were updated successfully.',
      })
      setEditOpen(false)

      const updated = await getRecipeById(slug)
      setRecipe(updated as RecipeResponse)
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

  const handleToggleFavorite = async () => {
    if (!recipe?._id) {
      return
    }

    try {
      setFavoriteLoading(true)

      if (isFavorite) {
        await removeFavorite(recipe._id)
        notifySuccess({
          title: 'Removed from Favorites',
          message: `${recipe.title} was removed from favorites.`,
        })
        setIsFavorite(false)
      } else {
        await addFavorite(recipe._id)
        notifySuccess({
          title: 'Added to Favorites',
          message: `${recipe.title} was added to favorites.`,
        })
        setIsFavorite(true)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update favorite'
      notifyError({
        title: 'Favorites Failed',
        message,
      })
    } finally {
      setFavoriteLoading(false)
    }
  }

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    )
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader size="md" />
      </div>
    )
  }

  if (!recipe || error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div
          className="relative rounded-2xl p-12 text-center overflow-hidden"
          style={glassPanel}
        >
          <ShimmerLine />
          <Text
            size="xs"
            style={{ color: '#00c896', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}
          >
            404 — Not Found
          </Text>
          <Title order={3} style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 8 }}>
            Recipe doesn't exist
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 24 }} size="sm">
            {error || `No recipe found for slug: ${slug}`}
          </Text>
          <ActionIcon
            component={Link}
            to="/"
            size="xl"
            radius="xl"
            style={{
              background: 'rgba(0,200,150,0.10)',
              border: '1px solid rgba(0,200,150,0.3)',
              color: '#1DDFBD',
            }}
          >
            ←
          </ActionIcon>
        </div>
      </div>
    )
  }

  const macros = [
    { label: 'Calories', value: nutrition?.calories ?? 0, unit: 'kcal', accent: true },
    { label: 'Protein',  value: nutrition?.protein ?? 0,  unit: 'g',    accent: true },
    { label: 'Carbs',    value: nutrition?.carbs ?? 0,    unit: 'g',    accent: false },
    { label: 'Fats',     value: nutrition?.fats ?? 0,     unit: 'g',    accent: false },
  ]

  return (
    <div className="h-full flex flex-col gap-5 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
      <CreateRecipeModal
        opened={editOpen}
        loading={editLoading}
        error={editError}
        onClose={() => {
          if (!editLoading) {
            setEditOpen(false)
            setEditError('')
          }
        }}
        onSubmit={handleUpdateRecipe}
        mode="edit"
        initialValues={editInitialValues}
      />

      <ConfirmDeleteModal
        {...modalProps}
      />

      {/* ── Hero ── */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ ...glassPanel, minHeight: 220 }}
      >
        <ShimmerLine />

        {/* Adjusted Background image opacity for better contrast */}
        <img
          src={recipe.image || PLACEHOLDER_IMAGE}
          alt={recipe.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.35 }}
          onError={e => { e.currentTarget.src = PLACEHOLDER_IMAGE }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(10,15,13,0.9) 0%, rgba(10,15,13,0.6) 100%)' }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(0,200,150,0.05), transparent)' }}
        />

        {/* Admin Menu positioned top right */}
        {canManageRecipe && (
          <div className="absolute top-6 right-6 z-20">
            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <ActionIcon variant="subtle" radius="xl" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  <DotsIcon />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown style={{ background: '#111b18', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Menu.Item style={{ color: 'white' }} onClick={() => setEditOpen(true)}>
                  Edit Recipe
                </Menu.Item>
                <Menu.Item 
                  color="red" 
                  onClick={() => {
                    if (!recipe || !recipe.slug) return
                    openDeleteModal({
                      slug: recipe.slug,
                      title: recipe.title,
                      onDeleted: async () => navigate('/'),
                      onUndone: async () => navigate('/'),
                    })
                  }}
                >
                  Delete Recipe
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        )}

        <div className="relative z-10 p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <ActionIcon
              component={Link}
              to="/"
              size="md"
              radius="xl"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.10)',
                color: 'rgba(255,255,255,0.9)',
                flexShrink: 0,
              }}
            >
              ←
            </ActionIcon>
            <Badge
              size="md"
              style={{
                background: 'rgba(0,200,150,0.15)',
                border: '1px solid rgba(0,200,150,0.3)',
                color: '#1DDFBD',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
              }}
            >
              Recipe
            </Badge>
          </div>

          <div>
            <Title
              order={1}
              style={{
                color: 'rgba(255,255,255,0.98)',
                fontWeight: 800,
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                marginBottom: 8,
              }}
            >
              {recipe.title}
            </Title>
            {/* Bumped text opacity for readability */}
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '800px' }}>
              {recipe.description}
            </Text>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {[
              { icon: <IconUsers size={14} />,  label: `Visibility: ${recipe.visibility ?? 'public'}` },
              { icon: <IconClock size={14} />,  label: `Prep ${recipe.prepTime ?? 0} min` },
              { icon: <IconFlame size={14} />,  label: `Cook ${recipe.cookTime ?? 0} min` },
              { icon: <IconUsers size={14} />,  label: `Serves ${recipe.servings ?? 1}${recipe.servingSize ? ` (${recipe.servingSize})` : ''}` },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '0.03em',
                }}
              >
                <span style={{ color: '#00c896' }}>{icon}</span>
                {label}
              </div>
            ))}

            {(recipe.diets ?? []).map((diet) => (
              <Badge key={`diet-${diet}`} size="md" style={{ background: 'rgba(0,200,150,0.10)', border: '1px solid rgba(0,200,150,0.2)', color: '#1DDFBD', fontSize: '0.75rem' }}>
                Diet: {diet}
              </Badge>
            ))}
            {(recipe.mealTypes ?? []).map((mealType) => (
              <Badge key={`meal-${mealType}`} size="md" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', fontSize: '0.75rem' }}>
                Meal: {mealType}
              </Badge>
            ))}
            {(recipe.cuisines ?? []).map((cuisine) => (
              <Badge key={`cuisine-${cuisine}`} size="md" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', fontSize: '0.75rem' }}>
                Cuisine: {cuisine}
              </Badge>
            ))}
          </div>

          <Group mt="xs">
            <Button
              size="sm"
              variant="light"
              color={isFavorite ? 'red' : 'gray'}
              loading={favoriteLoading}
              onClick={() => { void handleToggleFavorite() }}
            >
              {isFavorite ? 'Unfavorite' : 'Add to Favorites'}
            </Button>
          </Group>
        </div>
      </div>

     <Grid gutter="sm">
  {macros.map((macro) => (
    <Grid.Col span={{ base: 6, sm: 3 }} key={macro.label}>
      <div
        className="relative rounded-xl p-4 text-center overflow-hidden transition-all duration-150 cursor-default"
        style={{
          background: macro.label === 'Calories' ? 'rgba(0,200,150,0.08)' : 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: macro.label === 'Calories' ? '1px solid rgba(0,200,150,0.3)' : '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        <ShimmerLine />
        <Text
          size="xs"
          style={{
            color: macro.label === 'Calories' ? '#1DDFBD' : 'rgba(0,200,150,0.75)',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
            marginBottom: 6,
            marginTop: 4,
          }}
        >
          {macro.label}
        </Text>
        <div className="flex items-baseline justify-center gap-1">
          <Text
            style={{
              color: 'rgba(255,255,255,0.95)',
              fontWeight: 800,
              fontSize: '1.75rem',
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            {macro.value}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 600 }}>
            {macro.unit}
          </Text>
        </div>
      </div>
    </Grid.Col>
  ))}
</Grid>

      {/* ── Ingredients + Steps ── */}
      <Grid gutter="sm" className="flex-1">

        {/* Ingredients */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <div
            className="relative rounded-2xl p-6 overflow-hidden h-full"
            style={glassPanel}
          >
            <ShimmerLine />
            <div className="flex items-center gap-2 mb-5">
              <span style={{ color: '#00c896' }}><IconShoppingCart size={18} /></span>
              <Text
                style={{
                  color: 'rgba(255,255,255,0.95)',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  letterSpacing: '-0.01em',
                }}
              >
                Ingredients
              </Text>
              <div
                className="ml-auto px-2 py-0.5 rounded-md"
                style={{
                  background: 'rgba(0,200,150,0.15)',
                  border: '1px solid rgba(0,200,150,0.3)',
                  color: '#FAFBFB',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                }}
              >
                {ingredients.length} items
              </div>
            </div>

            <Stack gap={0}>
              {ingredients.map((ing, idx) => {
                const isChecked = checkedIngredients.includes(idx)
                return (
                  <div
                    key={idx}
                    onClick={() => toggleIngredient(idx)}
                    className="flex items-center justify-between py-3 cursor-pointer transition-colors px-2 -mx-2 rounded-md hover:bg-white/5"
                    style={{
                      borderBottom: idx < ingredients.length - 1
                        ? '1px solid rgba(255,255,255,0.08)'
                        : 'none',
                      opacity: isChecked ? 0.4 : 1,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3.5 h-3.5 rounded-full border transition-colors ${
                          isChecked ? 'bg-[#00c896] border-[#00c896]' : 'border-gray-500'
                        }`}
                      />
                      <Text style={{ 
                        color: 'rgba(255,255,255,0.85)', 
                        fontSize: '0.9rem', 
                        fontWeight: 500,
                        textDecoration: isChecked ? 'line-through' : 'none'
                      }}>
                        {ing.name}
                      </Text>
                    </div>
                    <Badge
                      size="sm"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#FAFBFB',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {`${ing.amount}${ing.unit ? ` ${ing.unit}` : ''}`}
                    </Badge>
                  </div>
                )
              })}

              {ingredients.length === 0 && (
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                  No ingredients listed.
                </Text>
              )}
            </Stack>
          </div>
        </Grid.Col>

        {/* Steps */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <div
            className="relative rounded-2xl p-6 overflow-hidden h-full"
            style={glassPanel}
          >
            <ShimmerLine />
            <div className="flex items-center gap-2 mb-6">
              <span style={{ color: '#00c896' }}><IconChefHat size={18} /></span>
              <Text
                style={{
                  color: 'rgba(255,255,255,0.95)',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  letterSpacing: '-0.01em',
                }}
              >
                Instructions
              </Text>
            </div>

            <Stack gap="lg">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <ThemeIcon
                    size={36}
                    radius="xl"
                    style={{
                      background: 'rgba(0,200,150,0.15)',
                      border: '1px solid rgba(0,200,150,0.3)',
                      color: '#1DDFBD',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </ThemeIcon>
                  <div className="flex-1 pt-1">
                    <Text
                      size="xs"
                      style={{
                        color: 'rgba(0,200,150,0.8)',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: 6,
                      }}
                    >
                      Step {idx + 1}
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                      {step}
                    </Text>
                    {idx < steps.length - 1 && (
                      <div
                        className="mt-5 ml-0 h-px"
                        style={{ background: 'rgba(255,255,255,0.08)' }}
                      />
                    )}
                  </div>
                </div>
              ))}

              {steps.length === 0 && (
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                  No instructions listed.
                </Text>
              )}
            </Stack>
          </div>
        </Grid.Col>
      </Grid>

    </div>
  )
}

export default RecipeDetailPage