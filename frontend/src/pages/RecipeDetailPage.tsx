import { Badge, Container, Group, Stack, Text, Title, Grid, ThemeIcon, ActionIcon } from '@mantine/core'
import PLACEHOLDER_IMAGE from '../components/PlaceholderImage'
import { IconShoppingCart, IconChefHat, IconClock, IconFlame, IconUsers } from '../components/RecipeIcons'
import { Link, useParams } from 'react-router-dom'

const recipes = {
  'anabolic-oats': {
    title: "Anabolic Oats",
    description: "High-protein oatmeal for muscle gain.",
    prepTime: "5 mins",
    cookTime: "10 mins",
    servings: 1,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2000",
    macros: { calories: 350, protein: 32, carbs: 40, fats: 8 },
    ingredients: [
      { item: "Rolled Oats", amount: "1/2 cup" },
      { item: "Whey Protein", amount: "1 scoop" },
      { item: "Almond Milk", amount: "1 cup" },
      { item: "Chia Seeds", amount: "1 tbsp" },
      { item: "Blueberries", amount: "1/4 cup" },
    ],
    steps: [
      "Combine oats and almond milk in a pot. Cook until thickened.",
      "Stir in protein powder and chia seeds.",
      "Top with blueberries and enjoy.",
    ],
  },
  'high-protein-wrap': {
    title: "High-Protein Chicken Wrap",
    description: "Lean chicken breast wrapped with veggies for weight loss.",
    prepTime: "10 mins",
    cookTime: "10 mins",
    servings: 1,
    image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&q=80&w=2000",
    macros: { calories: 400, protein: 38, carbs: 30, fats: 10 },
    ingredients: [
      { item: "Chicken Breast", amount: "4 oz" },
      { item: "Whole Wheat Wrap", amount: "1" },
      { item: "Lettuce", amount: "1/2 cup" },
      { item: "Tomato", amount: "2 slices" },
      { item: "Greek Yogurt", amount: "2 tbsp" },
    ],
    steps: [
      "Grill chicken breast and slice.",
      "Layer wrap with lettuce, tomato, chicken, and yogurt.",
      "Roll up and serve.",
    ],
  },
  'salmon-bowl': {
    title: "Salmon Macro Bowl",
    description: "Heart-healthy salmon with macro-balanced sides.",
    prepTime: "8 mins",
    cookTime: "12 mins",
    servings: 1,
    image: "https://images.unsplash.com/photo-1464306076886-debede6bbf94?auto=format&fit=crop&q=80&w=2000",
    macros: { calories: 480, protein: 40, carbs: 35, fats: 18 },
    ingredients: [
      { item: "Salmon Fillet", amount: "5 oz" },
      { item: "Brown Rice", amount: "1/2 cup" },
      { item: "Broccoli", amount: "1/2 cup" },
      { item: "Olive Oil", amount: "1 tsp" },
      { item: "Lemon", amount: "1 wedge" },
    ],
    steps: [
      "Bake salmon fillet with olive oil and lemon.",
      "Steam broccoli and cook rice.",
      "Assemble bowl and serve.",
    ],
  },
}

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

function RecipeDetailPage() {
  const { recipeId } = useParams()
  const recipe = recipes[recipeId as keyof typeof recipes]

  if (!recipe) {
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
          <Text style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 24 }} size="sm">
            No recipe found for ID: {recipeId}
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
    { label: 'Calories', value: recipe.macros.calories, unit: 'kcal', accent: true },
    { label: 'Protein',  value: recipe.macros.protein,  unit: 'g',    accent: true },
    { label: 'Carbs',    value: recipe.macros.carbs,    unit: 'g',    accent: false },
    { label: 'Fats',     value: recipe.macros.fats,     unit: 'g',    accent: false },
  ]

  return (
    <div className="h-full flex flex-col gap-5 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>

      {/* ── Hero ── */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ ...glassPanel, minHeight: 220 }}
      >
        <ShimmerLine />

        {/* Background image */}
        <img
          src={recipe.image || PLACEHOLDER_IMAGE}
          alt={recipe.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.18 }}
          onError={e => { e.currentTarget.src = PLACEHOLDER_IMAGE }}
        />
        {/* Gradient vignette */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(10,15,13,0.85) 0%, rgba(10,15,13,0.5) 100%)' }}
        />
        {/* Teal floor glow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(0,200,150,0.05), transparent)' }}
        />

        <div className="relative z-10 p-6 flex flex-col gap-4">
          {/* Back + badge row */}
          <div className="flex items-center gap-3">
            <ActionIcon
              component={Link}
              to="/"
              size="md"
              radius="xl"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.10)',
                color: 'rgba(255,255,255,0.7)',
                flexShrink: 0,
              }}
            >
              ←
            </ActionIcon>
            <Badge
              size="sm"
              style={{
                background: 'rgba(0,200,150,0.10)',
                border: '1px solid rgba(0,200,150,0.25)',
                color: '#1DDFBD',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontSize: '0.6rem',
              }}
            >
              Recipe
            </Badge>
          </div>

          {/* Title + description */}
          <div>
            <Title
              order={1}
              style={{
                color: 'rgba(255,255,255,0.95)',
                fontWeight: 800,
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                marginBottom: 8,
              }}
            >
              {recipe.title}
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {recipe.description}
            </Text>
          </div>

          {/* Meta pills row */}
          <div className="flex flex-wrap gap-2">
            {[
              { icon: <IconClock size={13} />,  label: `Prep ${recipe.prepTime}` },
              { icon: <IconFlame size={13} />,  label: `Cook ${recipe.cookTime}` },
              { icon: <IconUsers size={13} />,  label: `Serves ${recipe.servings}` },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.03em',
                }}
              >
                <span style={{ color: '#00c896' }}>{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

     <Grid gutter="sm">
  {macros.map((macro) => (
    <Grid.Col span={{ base: 6, sm: 3 }} key={macro.label}>
      <div
        className="relative rounded-xl p-4 text-center overflow-hidden transition-all duration-150 active:scale-[0.97] active:translate-y-px cursor-default"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        <ShimmerLine />
        <Text
          size="xs"
          style={{
            color: 'rgba(0,200,150,0.75)' ,
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
              color: 'rgba(255,255,255,0.88)',
              fontWeight: 800,
              fontSize: '1.75rem',
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            {macro.value}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: 600 }}>
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
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 800,
                  fontSize: '1rem',
                  letterSpacing: '-0.01em',
                }}
              >
                Ingredients
              </Text>
              <div
                className="ml-auto px-2 py-0.5 rounded-md"
                style={{
                  background: 'rgba(0,200,150,0.08)',
                  border: '1px solid rgba(0,200,150,0.2)',
                  color: '#FAFBFB',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                }}
              >
                {recipe.ingredients.length} items
              </div>
            </div>

            <Stack gap={0}>
              {recipe.ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3"
                  style={{
                    borderBottom: idx < recipe.ingredients.length - 1
                      ? '1px solid rgba(255,255,255,0.05)'
                      : 'none',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-1 h-4 rounded-full"
                      style={{ background: 'rgba(0,200,150,0.4)' }}
                    />
                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 500 }}>
                      {ing.item}
                    </Text>
                  </div>
                  <Badge
                    size="sm"
                    style={{
                      background: 'rgba(0,200,150,0.08)',
                      border: '1px solid rgba(0,200,150,0.2)',
                      color: '#FAFBFB',
                      fontWeight: 700,
                      fontSize: '0.65rem',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {ing.amount}
                  </Badge>
                </div>
              ))}
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
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 800,
                  fontSize: '1rem',
                  letterSpacing: '-0.01em',
                }}
              >
                Instructions
              </Text>
            </div>

            <Stack gap="lg">
              {recipe.steps.map((step, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <ThemeIcon
                    size={36}
                    radius="xl"
                    style={{
                      background: 'rgba(0,200,150,0.10)',
                      border: '1px solid rgba(0,200,150,0.25)',
                      color: '#1DDFBD',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      flexShrink: 0,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {idx + 1}
                  </ThemeIcon>
                  <div className="flex-1 pt-1">
                    <Text
                      size="xs"
                      style={{
                        color: 'rgba(0,200,150,0.6)',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: 4,
                      }}
                    >
                      Step {idx + 1}
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                      {step}
                    </Text>
                    {/* Step divider */}
                    {idx < recipe.steps.length - 1 && (
                      <div
                        className="mt-4 ml-0 h-px"
                        style={{ background: 'rgba(255,255,255,0.05)' }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </Stack>
          </div>
        </Grid.Col>
      </Grid>

    </div>
  )
}

export default RecipeDetailPage