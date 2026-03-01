import { Badge, Container, Group, Stack, Text, Title, Grid, ThemeIcon, Card, ActionIcon } from '@mantine/core'
import { Link } from 'react-router-dom'

import PLACEHOLDER_IMAGE from '../components/PlaceholderImage'
// Mock Data - You will eventually fetch this from your backend API
const recipe = {
  title: "Anabolic Garlic Butter Steak Bites",
  description: "Tender, juicy steak bites seared in garlic butter. A high-protein powerhouse that feels like a cheat meal but fits perfectly into your daily macros.",
  prepTime: "10 mins",
  cookTime: "15 mins",
  servings: 2,
  image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=2000", // Temporary placeholder
  macros: {
    calories: 420,
    protein: 48,
    carbs: 4,
    fats: 22,
  },
  ingredients: [
    { item: "Sirloin Steak, diced", amount: "16 oz" },
    { item: "Light Butter", amount: "1.5 tbsp" },
    { item: "Minced Garlic", amount: "1 tbsp" },
    { item: "Olive Oil", amount: "1 tsp" },
    { item: "Fresh Parsley, chopped", amount: "1 tbsp" },
    { item: "Salt & Black Pepper", amount: "To taste" },
  ],
  steps: [
    "Pat the diced sirloin steak completely dry with paper towels. Season generously with salt and coarse black pepper.",
    "Heat a large cast-iron skillet over medium-high heat. Add the olive oil and let it get smoking hot.",
    "Add the steak bites in a single layer. Sear without moving them for 2-3 minutes to develop a dark crust.",
    "Flip the steak bites. Reduce the heat to medium and immediately add the light butter and minced garlic to the pan.",
    "Toss the steak in the foaming garlic butter for 1-2 more minutes until cooked to your desired doneness.",
    "Remove from heat immediately, garnish with fresh chopped parsley, and serve hot."
  ]
}

function RecipePage() {
  return (
    <main className="min-h-screen bg-ink font-sans selection:bg-brand-500 selection:text-ink pb-20">
      
      {/* 1. HERO SECTION (Image & Title) */}
      <section className="relative w-full h-[40vh] min-h-100">
        {/* Full width background image */}
        <img 
          src={recipe.image || PLACEHOLDER_IMAGE}
          alt={recipe.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={e => { e.currentTarget.src = PLACEHOLDER_IMAGE; }}
        />
        {/* Dark gradient overlay so the text pops */}
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/60 to-transparent"></div>

        {/* Floating Navigation & Title overlay */}
        <Container size="lg" className="relative z-10 h-full flex flex-col justify-between pt-8 pb-12">
          {/* Top Nav */}
          <Group justify="space-between">
            <ActionIcon component={Link} to="/" variant="subtle" color="gray" radius="xl" size="xl" className="bg-ink/40 backdrop-blur-md hover:bg-ink/80 text-paper">
              ←
            </ActionIcon>
            <Badge color="brand.5" variant="outline" size="lg" className="backdrop-blur-md bg-ink/40 border-brand-500">
              Dinner • High Protein
            </Badge>
          </Group>

          {/* Title & Meta Info */}
          <div>
            <Title order={1} className="text-paper font-black text-4xl sm:text-5xl md:text-6xl mb-4 leading-tight">
              {recipe.title}
            </Title>
            <Text className="text-paper/80 text-lg max-w-2xl mb-6 leading-relaxed">
              {recipe.description}
            </Text>
            <Group gap="xl" className="text-paper/60 font-medium">
              <Group gap="xs"><span>⏱️</span> Prep: {recipe.prepTime}</Group>
              <Group gap="xs"><span>🔥</span> Cook: {recipe.cookTime}</Group>
              <Group gap="xs"><span>🍽️</span> Serves: {recipe.servings}</Group>
            </Group>
          </div>
        </Container>
      </section>

      <Container size="lg" className="-mt-8 relative z-20">
        
        {/* 2. EXACT MACROS (The Barbell Bites special feature) */}
        <Grid gutter="md" className="mb-12">
          {[
            { label: 'Calories', value: recipe.macros.calories, unit: 'kcal', color: 'text-white' },
            { label: 'Protein', value: recipe.macros.protein, unit: 'g', color: 'text-brand-500' },
            { label: 'Carbs', value: recipe.macros.carbs, unit: 'g', color: 'text-paper/70' },
            { label: 'Fats', value: recipe.macros.fats, unit: 'g', color: 'text-paper/70' },
          ].map((macro, idx) => (
            <Grid.Col span={{ base: 6, sm: 3 }} key={idx}>
              <Card radius="lg" className="bg-white/5 backdrop-blur-xl border border-white/10 text-center py-6">
                <Text className="text-paper/50 font-bold uppercase tracking-widest text-xs mb-1">
                  {macro.label}
                </Text>
                <Title order={2} className={`${macro.color} font-black text-3xl sm:text-4xl`}>
                  {macro.value}<span className="text-lg text-paper/40 ml-1">{macro.unit}</span>
                </Title>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {/* 3. CONTENT SPLIT (Ingredients Left, Steps Right) */}
        <Grid gutter={40}>
          
          {/* LEFT COLUMN: EXACT MEASUREMENTS */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 sticky top-8">
              <Title order={3} className="text-paper font-bold text-2xl mb-6 flex items-center gap-3">
                <span className="text-brand-500">🛒</span> Ingredients
              </Title>
              
              <Stack gap="md">
                {recipe.ingredients.map((ing, idx) => (
                  <Group key={idx} justify="space-between" wrap="nowrap" className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                    <Text className="text-paper/90 font-medium text-base">{ing.item}</Text>
                    <Badge color="brand.5" variant="light" size="lg" className="bg-brand-500/10 text-brand-400 font-bold border border-brand-500/20">
                      {ing.amount}
                    </Badge>
                  </Group>
                ))}
              </Stack>
            </div>
          </Grid.Col>

          {/* RIGHT COLUMN: STEPS */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <div className="p-4 md:p-8">
              <Title order={3} className="text-paper font-bold text-3xl mb-8 flex items-center gap-3">
                <span className="text-brand-500">🔪</span> Instructions
              </Title>

              <Stack gap="xl">
                {recipe.steps.map((step, idx) => (
                  <Group key={idx} align="flex-start" wrap="nowrap" gap="lg" className="group">
                    {/* Step Number Circle */}
                    <ThemeIcon 
                      size={48} 
                      radius="xl" 
                      className="bg-brand-500/10 text-brand-500 font-black text-xl border border-brand-500/30 group-hover:bg-brand-500 group-hover:text-ink transition-colors duration-300"
                    >
                      {idx + 1}
                    </ThemeIcon>
                    
                    {/* Step Text */}
                    <div className="flex-1 mt-1">
                      <Text className="text-paper font-bold text-lg mb-2">Step {idx + 1}</Text>
                      <Text className="text-paper/70 text-lg leading-relaxed">
                        {step}
                      </Text>
                    </div>
                  </Group>
                ))}
              </Stack>
            </div>
          </Grid.Col>

        </Grid>
      </Container>
    </main>
  )
}

export default RecipePage