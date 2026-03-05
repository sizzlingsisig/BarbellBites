import { BackupRecipe, IRecipe, Recipe } from '../../models/v2/Recipe.js'
import { RECIPE_DIETS } from '../../constants/recipeTaxonomy.js'
import { mirrorWriteToBackup, withReadFailover } from '../../utils/failover.js'

type RecipePayload = Partial<IRecipe> & {
  tags?: string[]
  instructions?: string[]
  nutrition?: {
    calories: number
    protein: number
    carbs: number
    fats: number
  }
}

type RecipeListQuery = {
  page?: number
  limit?: number
  search?: string
  diet?: string
  mealType?: string
  cuisine?: string
  maxPrepTime?: number
  maxTotalTime?: number
}

type PaginatedRecipesResult = {
  items: IRecipe[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

type MongoFilter = Record<string, unknown>

const ESCAPE_REGEX = /[.*+?^${}()|[\]\\]/g

function escapeRegex(value: string): string {
  return value.replace(ESCAPE_REGEX, '\\$&')
}

function normalizeRecipePayload(data: RecipePayload): Partial<IRecipe> {
  const next: RecipePayload = { ...data }
  const dietSet = new Set(RECIPE_DIETS)

  if (!next.diets && Array.isArray(next.tags)) {
    next.diets = next.tags.filter((value): value is (typeof RECIPE_DIETS)[number] =>
      dietSet.has(value as (typeof RECIPE_DIETS)[number]),
    )
  }

  if (!next.steps && Array.isArray(next.instructions)) {
    next.steps = next.instructions
  }

  if (!next.nutritionPerServing && next.nutrition) {
    next.nutritionPerServing = next.nutrition
  }

  if (!next.photo && next.image) {
    next.photo = next.image
  }

  if (next.totalTime == null && (next.prepTime != null || next.cookTime != null)) {
    next.totalTime = (next.prepTime ?? 0) + (next.cookTime ?? 0)
  }

  delete next.tags
  delete next.instructions
  delete next.nutrition

  return next
}

function splitCSV(value?: string) {
  if (!value) return []
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
}

function buildRecipeFilters(query: RecipeListQuery): MongoFilter {
  const filter: MongoFilter = {}

  // Search (title/description)
  if (query.search) {
    const search = escapeRegex(query.search.trim())
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }
  }

  // Multi-select support via CSV: diet=low-carb,keto etc.
  const diets = splitCSV(query.diet)
  if (diets.length > 0) filter.diets = { $in: diets }

  const mealTypes = splitCSV(query.mealType)
  if (mealTypes.length > 0) filter.mealTypes = { $in: mealTypes }

  const cuisines = splitCSV(query.cuisine)
  if (cuisines.length > 0) filter.cuisines = { $in: cuisines }

  if (typeof query.maxPrepTime === 'number') {
    filter.prepTime = { $lte: query.maxPrepTime }
  }
  if (typeof query.maxTotalTime === 'number') {
    filter.totalTime = { $lte: query.maxTotalTime }
  }

  return filter
}

export async function createRecipe(userId: string, data: Partial<IRecipe>) {
  const normalizedData = normalizeRecipePayload(data as RecipePayload)
  const recipe = await Recipe.create({ ...normalizedData, owner: userId })

  await mirrorWriteToBackup('recipe create', async () => {
    const backupPayload = recipe.toObject()
    await BackupRecipe.updateOne(
      { _id: recipe._id },
      { $set: backupPayload },
      { upsert: true, setDefaultsOnInsert: true },
    )
  })

  return recipe
}

export async function getRecipeById(slug: string, userId?: string) {
  const query: MongoFilter = { slug, deletedAt: null }
  if (userId) {
    query.$or = [{ visibility: 'public' }, { owner: userId }]
  } else {
    query.visibility = 'public'
  }

  return withReadFailover(
    'recipe lookup',
    () => Recipe.findOne(query),
    () => BackupRecipe.findOne(query),
  )
}

export async function updateRecipe(userId: string, slug: string, data: Partial<IRecipe>) {
  const recipe = await Recipe.findOne({ slug, owner: userId, deletedAt: null })
  if (!recipe) return null
  const normalizedData = normalizeRecipePayload(data as RecipePayload)
  Object.assign(recipe, normalizedData)
  await recipe.save()

  await mirrorWriteToBackup('recipe update', async () => {
    await BackupRecipe.updateOne({ _id: recipe._id }, { $set: normalizedData })
  })

  return recipe
}

export async function softDeleteRecipe(userId: string, slug: string) {
  const recipe = await Recipe.findOne({ slug, owner: userId, deletedAt: null })
  if (!recipe) return null
  recipe.deletedAt = new Date()
  await recipe.save()

  await mirrorWriteToBackup('recipe soft delete', async () => {
    await BackupRecipe.updateOne({ _id: recipe._id }, { $set: { deletedAt: recipe.deletedAt } })
  })

  return recipe
}

export async function undoDeleteRecipe(userId: string, slug: string) {
  const recipe = await Recipe.findOne({ slug, owner: userId, deletedAt: { $ne: null } })
  if (!recipe) return null
  recipe.deletedAt = null
  await recipe.save()

  await mirrorWriteToBackup('recipe undo delete', async () => {
    await BackupRecipe.updateOne({ _id: recipe._id }, { $set: { deletedAt: null } })
  })

  return recipe
}

export async function listPublicRecipes(query: RecipeListQuery, userId?: string) {
  const page = Math.max(1, query.page ?? 1)
  const limit = Math.min(50, Math.max(1, query.limit ?? 10))
  const skip = (page - 1) * limit

  const baseFilters: MongoFilter = buildRecipeFilters(query)

  // Access control filter
  const accessFilter: MongoFilter = userId
    ? { $or: [{ visibility: 'public' }, { owner: userId }] }
    : { visibility: 'public' }

  // Combine WITHOUT overwriting $or from search
  const andParts: MongoFilter[] = [{ deletedAt: null }, accessFilter]

  if (Object.keys(baseFilters).length > 0) {
    andParts.push(baseFilters)
  }

  const finalFilter: MongoFilter = andParts.length === 1 ? andParts[0] : { $and: andParts }

  const [items, total] = await withReadFailover(
    'public recipe list',
    () =>
      Promise.all([
        Recipe.find(finalFilter).skip(skip).limit(limit).sort({ createdAt: -1 }),
        Recipe.countDocuments(finalFilter),
      ]),
    () =>
      Promise.all([
        BackupRecipe.find(finalFilter).skip(skip).limit(limit).sort({ createdAt: -1 }),
        BackupRecipe.countDocuments(finalFilter),
      ]),
  )

  return {
    items: items as IRecipe[],
    pagination: {
      page,
      limit,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / limit),
    },
  } as PaginatedRecipesResult
}

export async function listUserRecipes(userId: string, query: RecipeListQuery) {
  const page = Math.max(1, query.page ?? 1)
  const limit = Math.min(50, Math.max(1, query.limit ?? 10))
  const skip = (page - 1) * limit


  const filter: MongoFilter = {
    ...buildRecipeFilters(query),
    owner: userId,
    deletedAt: null,
  }

  const [items, total] = await withReadFailover(
    'user recipe list',
    () =>
      Promise.all([
        Recipe.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
        Recipe.countDocuments(filter),
      ]),
    () =>
      Promise.all([
        BackupRecipe.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
        BackupRecipe.countDocuments(filter),
      ]),
  )

  return {
    items: items as IRecipe[],
    pagination: {
      page,
      limit,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / limit),
    },
  } as PaginatedRecipesResult
}