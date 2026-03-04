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
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
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
      image: 'https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg',
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
    {
      owner: owner._id,
      title: 'Overnight Oats Protein Jar',
      description: 'Easy make-ahead breakfast with oats, whey, and berries.',
      image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
      visibility: 'public',
      diets: ['vegetarian', 'high-protein'],
      mealTypes: ['breakfast'],
      cuisines: ['american'],
      prepTime: 8,
      cookTime: 0,
      totalTime: 8,
      servings: 1,
      servingSize: '1 jar',
      ingredients: [
        { name: 'Rolled Oats', amount: '60', unit: 'g' },
        { name: 'Greek Yogurt', amount: '150', unit: 'g' },
        { name: 'Blueberries', amount: '80', unit: 'g' },
      ],
      steps: ['Mix oats and yogurt', 'Fold in berries', 'Chill overnight'],
      nutritionPerServing: { calories: 410, protein: 28, carbs: 46, fats: 11 },
    },
    {
      owner: athlete._id,
      title: 'Keto Egg Muffin Bites',
      description: 'Portable low-carb egg muffins for post-workout snacks.',
      image: 'https://images.pexels.com/photos/824635/pexels-photo-824635.jpeg',
      visibility: 'public',
      diets: ['keto', 'low-carb'],
      mealTypes: ['snack'],
      cuisines: ['american'],
      prepTime: 10,
      cookTime: 20,
      totalTime: 30,
      servings: 3,
      servingSize: '2 muffins',
      ingredients: [
        { name: 'Eggs', amount: '6', unit: 'pcs' },
        { name: 'Spinach', amount: '1', unit: 'cup' },
        { name: 'Cheddar', amount: '80', unit: 'g' },
      ],
      steps: ['Whisk eggs', 'Stir in spinach and cheddar', 'Bake in muffin tray'],
      nutritionPerServing: { calories: 250, protein: 18, carbs: 4, fats: 18 },
    },
    {
      owner: owner._id,
      title: 'Vegan Chickpea Buddha Bowl',
      description: 'Fiber-rich vegan bowl with roasted chickpeas and greens.',
      image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
      visibility: 'public',
      diets: ['vegan'],
      mealTypes: ['lunch'],
      cuisines: ['mediterranean'],
      prepTime: 15,
      cookTime: 20,
      totalTime: 35,
      servings: 2,
      servingSize: '1 bowl',
      ingredients: [
        { name: 'Chickpeas', amount: '250', unit: 'g' },
        { name: 'Quinoa', amount: '1', unit: 'cup' },
        { name: 'Kale', amount: '2', unit: 'cups' },
      ],
      steps: ['Roast chickpeas', 'Cook quinoa', 'Assemble with kale and dressing'],
      nutritionPerServing: { calories: 480, protein: 20, carbs: 62, fats: 16 },
    },
    {
      owner: athlete._id,
      title: 'Paleo Turkey Lettuce Wraps',
      description: 'Lean ground turkey wraps with crunchy veggies.',
      image: 'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg',
      visibility: 'public',
      diets: ['paleo', 'high-protein'],
      mealTypes: ['dinner'],
      cuisines: ['asian'],
      prepTime: 12,
      cookTime: 14,
      totalTime: 26,
      servings: 2,
      servingSize: '3 wraps',
      ingredients: [
        { name: 'Ground Turkey', amount: '300', unit: 'g' },
        { name: 'Romaine Leaves', amount: '6', unit: 'pcs' },
        { name: 'Carrot', amount: '1', unit: 'cup' },
      ],
      steps: ['Cook turkey with spices', 'Prep lettuce and veggies', 'Fill and serve wraps'],
      nutritionPerServing: { calories: 360, protein: 34, carbs: 12, fats: 18 },
    },
    {
      owner: owner._id,
      title: 'Mexican Chicken Rice Skillet',
      description: 'One-pan high-protein Mexican-style rice skillet.',
      image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg',
      visibility: 'public',
      diets: ['high-protein'],
      mealTypes: ['dinner'],
      cuisines: ['mexican'],
      prepTime: 10,
      cookTime: 25,
      totalTime: 35,
      servings: 3,
      servingSize: '1 bowl',
      ingredients: [
        { name: 'Chicken Thigh', amount: '400', unit: 'g' },
        { name: 'Rice', amount: '1.5', unit: 'cups' },
        { name: 'Black Beans', amount: '1', unit: 'cup' },
      ],
      steps: ['Brown chicken', 'Add rice and broth', 'Finish with beans and spices'],
      nutritionPerServing: { calories: 560, protein: 39, carbs: 52, fats: 20 },
    },
    {
      owner: athlete._id,
      title: 'Indian Lentil Curry Meal Prep',
      description: 'Comforting lentil curry for easy weekly meal prep.',
      image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg',
      visibility: 'public',
      diets: ['vegetarian'],
      mealTypes: ['lunch'],
      cuisines: ['indian'],
      prepTime: 15,
      cookTime: 30,
      totalTime: 45,
      servings: 4,
      servingSize: '1 container',
      ingredients: [
        { name: 'Red Lentils', amount: '2', unit: 'cups' },
        { name: 'Coconut Milk', amount: '250', unit: 'ml' },
        { name: 'Tomato', amount: '2', unit: 'pcs' },
      ],
      steps: ['Saute aromatics', 'Simmer lentils', 'Finish with coconut milk'],
      nutritionPerServing: { calories: 430, protein: 19, carbs: 54, fats: 14 },
    },
    {
      owner: owner._id,
      title: 'Italian Tuna Pasta Salad',
      description: 'Cold pasta salad packed with protein and herbs.',
      image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
      visibility: 'public',
      diets: ['high-protein'],
      mealTypes: ['lunch'],
      cuisines: ['italian'],
      prepTime: 12,
      cookTime: 10,
      totalTime: 22,
      servings: 2,
      servingSize: '1 bowl',
      ingredients: [
        { name: 'Whole Wheat Pasta', amount: '180', unit: 'g' },
        { name: 'Tuna', amount: '160', unit: 'g' },
        { name: 'Cherry Tomatoes', amount: '1', unit: 'cup' },
      ],
      steps: ['Cook pasta', 'Mix tuna and veggies', 'Chill with dressing'],
      nutritionPerServing: { calories: 510, protein: 36, carbs: 50, fats: 18 },
    },
    {
      owner: athlete._id,
      title: 'Low-Carb Greek Yogurt Parfait',
      description: 'Quick snack parfait with seeds and berries.',
      image: 'https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg',
      visibility: 'public',
      diets: ['low-carb', 'vegetarian'],
      mealTypes: ['snack'],
      cuisines: ['mediterranean'],
      prepTime: 5,
      cookTime: 0,
      totalTime: 5,
      servings: 1,
      servingSize: '1 glass',
      ingredients: [
        { name: 'Greek Yogurt', amount: '200', unit: 'g' },
        { name: 'Chia Seeds', amount: '1', unit: 'tbsp' },
        { name: 'Raspberries', amount: '60', unit: 'g' },
      ],
      steps: ['Layer yogurt and berries', 'Top with chia seeds', 'Serve chilled'],
      nutritionPerServing: { calories: 280, protein: 24, carbs: 14, fats: 12 },
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
