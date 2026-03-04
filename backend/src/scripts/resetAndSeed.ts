import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import User from '../models/v2/User.js'
import { Recipe } from '../models/v2/Recipe.js'
import { Favorite } from '../models/v2/Favorite.js'

async function resetAndSeedDatabase() {
  await connectDB()

  const db = mongoose.connection.db
  if (!db) {
    throw new Error('MongoDB connection is not initialized')
  }

  console.log('Dropping database...')
  await db.dropDatabase()

  console.log('Seeding users...')
  const owner = await User.create({
    name: 'Owner User',
    email: 'owner@barbellbites.dev',
    password: 'Password123!',
  })

  const athlete = await User.create({
    name: 'Athlete User',
    email: 'athlete@barbellbites.dev',
    password: 'Password123!',
  })

  console.log('Seeding recipes...')
  const recipes = await Recipe.create([
    {
      owner: owner._id,
      title: 'High Protein Power Bowl',
      description: 'A balanced high-protein dinner bowl for muscle gain.',
      visibility: 'public',
      diets: ['high-protein'],
      mealTypes: ['dinner'],
      cuisines: ['american'],
      prepTime: 10,
      cookTime: 20,
      totalTime: 30,
      servings: 2,
      servingSize: '1 bowl',
      ingredients: [
        { name: 'Chicken Breast', amount: '300', unit: 'g' },
        { name: 'Brown Rice', amount: '1', unit: 'cup' },
        { name: 'Broccoli', amount: '1', unit: 'cup' },
      ],
      steps: ['Cook rice', 'Grill chicken', 'Steam broccoli', 'Assemble and serve'],
      nutritionPerServing: {
        calories: 520,
        protein: 46,
        carbs: 45,
        fats: 14,
      },
    },
    {
      owner: athlete._id,
      title: 'Mediterranean Lunch Plate',
      description: 'Lean and fresh lunch plate with Mediterranean flavors.',
      visibility: 'public',
      diets: ['low-carb'],
      mealTypes: ['lunch'],
      cuisines: ['mediterranean'],
      prepTime: 12,
      cookTime: 8,
      totalTime: 20,
      servings: 1,
      servingSize: '1 plate',
      ingredients: [
        { name: 'Salmon Fillet', amount: '180', unit: 'g' },
        { name: 'Cucumber', amount: '1', unit: 'cup' },
        { name: 'Greek Yogurt', amount: '80', unit: 'g' },
      ],
      steps: ['Cook salmon', 'Slice cucumber', 'Plate and top with yogurt sauce'],
      nutritionPerServing: {
        calories: 430,
        protein: 38,
        carbs: 10,
        fats: 24,
      },
    },
  ])

  console.log('Seeding favorites...')
  await Favorite.create({
    userId: athlete._id,
    recipeId: recipes[0]._id,
  })

  console.log('Seeding complete')
}

resetAndSeedDatabase()
  .then(async () => {
    await mongoose.connection.close()
    process.exit(0)
  })
  .catch(async (error) => {
    console.error('Reset/seed failed:', error)
    await mongoose.connection.close()
    process.exit(1)
  })
