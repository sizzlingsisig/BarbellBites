import { useEffect, useState } from 'react'
import { getRecipeTaxonomy, type RecipeTaxonomy } from '../api/recipesApi'

const fallbackTaxonomy: RecipeTaxonomy = {
  diets: ['high-protein', 'low-carb', 'keto', 'vegetarian', 'vegan', 'paleo'],
  mealTypes: ['breakfast', 'lunch', 'dinner', 'snack'],
  cuisines: ['american', 'mediterranean', 'mexican', 'indian', 'italian', 'asian'],
}

export function useRecipeTaxonomy(opened: boolean) {
  const [taxonomy, setTaxonomy] = useState<RecipeTaxonomy>(fallbackTaxonomy)

  useEffect(() => {
    if (!opened) {
      return
    }

    let cancelled = false

    const loadTaxonomy = async () => {
      try {
        const data = await getRecipeTaxonomy()

        if (!cancelled) {
          setTaxonomy({
            diets: Array.isArray(data.diets) ? data.diets : fallbackTaxonomy.diets,
            mealTypes: Array.isArray(data.mealTypes) ? data.mealTypes : fallbackTaxonomy.mealTypes,
            cuisines: Array.isArray(data.cuisines) ? data.cuisines : fallbackTaxonomy.cuisines,
          })
        }
      } catch {
        if (!cancelled) {
          setTaxonomy(fallbackTaxonomy)
        }
      }
    }

    void loadTaxonomy()

    return () => {
      cancelled = true
    }
  }, [opened])

  return taxonomy
}
