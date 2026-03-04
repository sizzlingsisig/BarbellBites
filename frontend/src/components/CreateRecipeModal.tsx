import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Divider,
  Group,
  Modal,
  Select,
  SimpleGrid,
  Stack,
  Stepper,
  TagsInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import type { RecipeMutationPayload } from '../api/recipesApi'
import { useRecipeTaxonomy } from '../hooks/useRecipeTaxonomy'

type IngredientRow = {
  id: string
  name: string
  amount: string
  unit: string
}

type InstructionRow = {
  id: string
  text: string
}

type CreateFormState = {
  title: string
  description: string
  visibility: 'public' | 'private'
  diets: string[]
  mealTypes: string[]
  cuisines: string[]
  prepTime: string
  cookTime: string
  servings: string
  servingSize: string
  ingredients: IngredientRow[]
  instructions: InstructionRow[]
  calories: string
  protein: string
  carbs: string
  fats: string
}

type CreateRecipeModalProps = {
  opened: boolean
  loading: boolean
  error: string
  onClose: () => void
  onSubmit: (payload: RecipeMutationPayload) => Promise<void>
}

const initialFormState: CreateFormState = {
  title: '',
  description: '',
  visibility: 'public',
  diets: [],
  mealTypes: [],
  cuisines: [],
  prepTime: '0',
  cookTime: '0',
  servings: '1',
  servingSize: '',
  ingredients: [{ id: 'ing-1', name: '', amount: '', unit: '' }],
  instructions: [{ id: 'step-1', text: '' }],
  calories: '0',
  protein: '0',
  carbs: '0',
  fats: '0',
}

const stepLabels = ['Recipe Basics', 'Classification', 'Timing & Servings', 'Ingredients & Instructions', 'Nutrition'] as const
const stepDescriptions = ['Name and overview', 'Diets, meals, cuisines', 'Prep, cook, and portions', 'Build recipe steps', 'Macro breakdown'] as const
const lastStepIndex = stepLabels.length - 1
const nextRowId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

function CreateRecipeModal({ opened, loading, error, onClose, onSubmit }: CreateRecipeModalProps) {
  const [form, setForm] = useState<CreateFormState>(initialFormState)
  const taxonomy = useRecipeTaxonomy(opened)
  const [step, setStep] = useState(0)
  const [attempted, setAttempted] = useState(false)
  const nextStep = () => setStep((current) => (current < lastStepIndex ? current + 1 : current))
  const prevStep = () => setStep((current) => (current > 0 ? current - 1 : current))

  useEffect(() => {
    if (!opened) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [opened, loading, onClose])

  useEffect(() => {
    if (!opened) {
      setForm(initialFormState)
      setStep(0)
      setAttempted(false)
    }
  }, [opened])

  useEffect(() => {
    setAttempted(false)
  }, [step])

  const updateFormField =
    (field: Exclude<keyof CreateFormState, 'visibility' | 'ingredients' | 'instructions' | 'diets' | 'mealTypes' | 'cuisines'>) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.currentTarget
      setForm((prev) => ({ ...prev, [field]: value }))
    }

  const updateTagField = (field: 'diets' | 'mealTypes' | 'cuisines', values: string[]) => {
    setForm((prev) => ({ ...prev, [field]: values }))
  }

  const updateIngredientField = (index: number, field: keyof Omit<IngredientRow, 'id'>, value: string) => {
    setForm((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    }))
  }

  const addIngredientRow = () => {
    setForm((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { id: `ing-${nextRowId()}`, name: '', amount: '', unit: '' }],
    }))
  }

  const removeIngredientRow = (index: number) => {
    setForm((prev) => ({
      ...prev,
      ingredients: prev.ingredients.length === 1 ? prev.ingredients : prev.ingredients.filter((_, i) => i !== index),
    }))
  }

  const updateInstructionField = (index: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      instructions: prev.instructions.map((row, i) => (i === index ? { ...row, text: value } : row)),
    }))
  }

  const addInstructionRow = () => {
    setForm((prev) => ({
      ...prev,
      instructions: [...prev.instructions, { id: `step-${nextRowId()}`, text: '' }],
    }))
  }

  const removeInstructionRow = (index: number) => {
    setForm((prev) => ({
      ...prev,
      instructions: prev.instructions.length === 1 ? prev.instructions : prev.instructions.filter((_, i) => i !== index),
    }))
  }

  const moveInstruction = (index: number, direction: -1 | 1) => {
    setForm((prev) => {
      const target = index + direction
      if (target < 0 || target >= prev.instructions.length) {
        return prev
      }
      const next = [...prev.instructions]
      const [item] = next.splice(index, 1)
      next.splice(target, 0, item)
      return { ...prev, instructions: next }
    })
  }

  const nutrition = useMemo(
    () => ({
      calories: Number(form.calories),
      protein: Number(form.protein),
      carbs: Number(form.carbs),
      fats: Number(form.fats),
    }),
    [form.calories, form.protein, form.carbs, form.fats],
  )

  const totalTime = useMemo(() => {
    const prep = Number(form.prepTime)
    const cook = Number(form.cookTime)
    return Number.isFinite(prep) && Number.isFinite(cook) ? prep + cook : NaN
  }, [form.prepTime, form.cookTime])

  const normalizedIngredients = useMemo(
    () =>
      form.ingredients.map(({ id, ...rest }) => ({
        ...rest,
        name: rest.name.trim(),
        amount: rest.amount.trim(),
        unit: rest.unit.trim(),
      })),
    [form.ingredients],
  )

  const normalizedInstructions = useMemo(
    () => form.instructions.map((row) => row.text.trim()).filter(Boolean),
    [form.instructions],
  )

  const fieldErrors = useMemo(() => {
    const nonNegative = (value: number) => Number.isFinite(value) && value >= 0
    const servingsNumber = Number(form.servings)

    return {
      title: form.title.trim().length >= 3 ? '' : 'Title must be at least 3 characters long.',
      description: form.description.trim().length >= 10 ? '' : 'Description must be at least 10 characters long.',
      prepTime: nonNegative(Number(form.prepTime)) ? '' : 'Prep time must be non-negative.',
      cookTime: nonNegative(Number(form.cookTime)) ? '' : 'Cook time must be non-negative.',
      totalTime: nonNegative(totalTime) ? '' : 'Total time is invalid.',
      servings: Number.isInteger(servingsNumber) && servingsNumber > 0 ? '' : 'Servings must be a positive whole number.',
      servingSize: form.servingSize.trim() ? '' : 'Serving size is required.',
      ingredients:
        normalizedIngredients.length > 0 && normalizedIngredients.every((row) => row.name && row.amount && row.unit)
          ? ''
          : 'Each ingredient needs name, amount, and unit.',
      instructions:
        normalizedInstructions.length > 0 && form.instructions.every((row) => row.text.trim())
          ? ''
          : 'Each instruction row must have text.',
      calories: nonNegative(nutrition.calories) ? '' : 'Calories must be non-negative.',
      protein: nonNegative(nutrition.protein) ? '' : 'Protein must be non-negative.',
      carbs: nonNegative(nutrition.carbs) ? '' : 'Carbs must be non-negative.',
      fats: nonNegative(nutrition.fats) ? '' : 'Fats must be non-negative.',
    }
  }, [form, nutrition, normalizedIngredients, normalizedInstructions, totalTime])

  const isStepValid = useMemo(() => {
    switch (step) {
      case 0:
        return !fieldErrors.title && !fieldErrors.description
      case 1:
        return true
      case 2:
        return !fieldErrors.prepTime && !fieldErrors.cookTime && !fieldErrors.totalTime && !fieldErrors.servings && !fieldErrors.servingSize
      case 3:
        return !fieldErrors.ingredients && !fieldErrors.instructions
      case 4:
        return !fieldErrors.calories && !fieldErrors.protein && !fieldErrors.carbs && !fieldErrors.fats
      default:
        return false
    }
  }, [step, fieldErrors])

  const isSubmitDisabled = useMemo(
    () =>
      loading ||
      !isStepValid ||
      Boolean(
        fieldErrors.title ||
          fieldErrors.description ||
          fieldErrors.prepTime ||
          fieldErrors.cookTime ||
          fieldErrors.totalTime ||
          fieldErrors.servings ||
          fieldErrors.servingSize ||
          fieldErrors.ingredients ||
          fieldErrors.instructions ||
          fieldErrors.calories ||
          fieldErrors.protein ||
          fieldErrors.carbs ||
          fieldErrors.fats,
      ),
    [loading, isStepValid, fieldErrors],
  )

  const stepHasError = (stepIndex: number) => {
    if (stepIndex === 0) return Boolean(fieldErrors.title || fieldErrors.description)
    if (stepIndex === 1) return false
    if (stepIndex === 2) return Boolean(fieldErrors.prepTime || fieldErrors.cookTime || fieldErrors.totalTime || fieldErrors.servings || fieldErrors.servingSize)
    if (stepIndex === 3) return Boolean(fieldErrors.ingredients || fieldErrors.instructions)
    return Boolean(fieldErrors.calories || fieldErrors.protein || fieldErrors.carbs || fieldErrors.fats)
  }

  const handleSubmit = async () => {
    setAttempted(true)

    if (isSubmitDisabled) {
      return
    }

    await onSubmit({
      title: form.title,
      description: form.description,
      visibility: form.visibility,
      prepTime: Number(form.prepTime),
      cookTime: Number(form.cookTime),
      totalTime,
      servings: Number(form.servings),
      servingSize: form.servingSize,
      diets: form.diets,
      mealTypes: form.mealTypes,
      cuisines: form.cuisines,
      ingredients: normalizedIngredients,
      instructions: normalizedInstructions,
      nutrition,
    })
  }

  if (!opened) {
    return null
  }

  return (
    <Modal
      opened={opened}
      onClose={() => {
        if (!loading) onClose()
      }}
      centered
      closeOnClickOutside={!loading}
      closeOnEscape={!loading}
      withCloseButton={false}
      padding={0}
      radius="xl"
      size="lg"
      styles={{
        overlay: { background: 'rgba(0,0,0,0.72)' },
        content: { background: 'transparent', boxShadow: 'none' },
        body: { padding: 0 },
      }}
    >
      <Box
        p="md"
        style={{
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(10,15,13,1)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        <Group justify="space-between" align="flex-start" gap="sm" mb="md">
          <div>
            <Text size="xs" style={{ color: '#00c896', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
              New Recipe
            </Text>
            <Title order={4} style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 800 }}>
              Create Recipe
            </Title>
          </div>
          <ActionIcon variant="subtle" color="gray" onClick={onClose} disabled={loading} aria-label="Close create recipe modal">
            ✕
          </ActionIcon>
        </Group>

        <Divider mb="md" style={{ borderColor: 'rgba(255,255,255,0.12)' }} />

        <Stack gap="sm">
          {error && (
            <Text c="red.5" size="sm">
              {error}
            </Text>
          )}

          <Stepper
            active={step}
            onStepClick={(nextStepValue) => {
              if (!loading) setStep(nextStepValue)
            }}
            allowNextStepsSelect={false}
            color="teal"
            size="xs"
            iconSize={18}
            styles={{
              step: { gap: 4 },
              stepBody: { marginTop: 2 },
              stepLabel: {
                color: 'rgba(255,255,255,0.75)',
                fontSize: '0.67rem',
                lineHeight: 1.05,
                whiteSpace: 'nowrap',
              },
              stepDescription: {
                color: 'rgba(255,255,255,0.45)',
                fontSize: '0.6rem',
                lineHeight: 1.05,
                whiteSpace: 'nowrap',
              },
              separator: { backgroundColor: 'rgba(255,255,255,0.14)' },
            }}
          >
            <Stepper.Step label={stepLabels[0]} description={stepDescriptions[0]} color={stepHasError(0) && attempted ? 'red' : 'teal'}>
              <Stack gap="sm" mt="sm">
                <TextInput label="Recipe Title" value={form.title} onChange={updateFormField('title')} error={attempted ? fieldErrors.title : undefined} required autoFocus />
                <TextInput label="Recipe Description" value={form.description} onChange={updateFormField('description')} error={attempted ? fieldErrors.description : undefined} required />
                <Select
                  label="Visibility"
                  data={[
                    { value: 'public', label: 'Public' },
                    { value: 'private', label: 'Private' },
                  ]}
                  value={form.visibility}
                  onChange={(value) => setForm((prev) => ({ ...prev, visibility: (value as 'public' | 'private') ?? 'public' }))}
                />
              </Stack>
            </Stepper.Step>

            <Stepper.Step label={stepLabels[1]} description={stepDescriptions[1]} color={stepHasError(1) && attempted ? 'red' : 'teal'}>
              <Stack gap="sm" mt="sm">
                <TagsInput
                  label="Diets"
                  description="Search and press Enter to add"
                  placeholder="Add diets"
                  data={taxonomy.diets}
                  value={form.diets}
                  onChange={(values) => updateTagField('diets', values)}
                  clearable
                />
                <TagsInput
                  label="Meal Types"
                  description="Search and press Enter to add"
                  placeholder="Add meal types"
                  data={taxonomy.mealTypes}
                  value={form.mealTypes}
                  onChange={(values) => updateTagField('mealTypes', values)}
                  clearable
                />
                <TagsInput
                  label="Cuisines"
                  description="Search and press Enter to add"
                  placeholder="Add cuisines"
                  data={taxonomy.cuisines}
                  value={form.cuisines}
                  onChange={(values) => updateTagField('cuisines', values)}
                  clearable
                />
              </Stack>
            </Stepper.Step>

            <Stepper.Step label={stepLabels[2]} description={stepDescriptions[2]} color={stepHasError(2) && attempted ? 'red' : 'teal'}>
              <SimpleGrid cols={2} spacing="sm" mt="sm">
                <TextInput label="Prep Time (minutes)" value={form.prepTime} onChange={updateFormField('prepTime')} error={attempted ? fieldErrors.prepTime : undefined} required autoFocus />
                <TextInput label="Cook Time (minutes)" value={form.cookTime} onChange={updateFormField('cookTime')} error={attempted ? fieldErrors.cookTime : undefined} required />
                <TextInput label="Total Time (minutes)" value={Number.isFinite(totalTime) ? String(totalTime) : ''} readOnly error={attempted ? fieldErrors.totalTime : undefined} />
                <TextInput label="Number of Servings" value={form.servings} onChange={updateFormField('servings')} error={attempted ? fieldErrors.servings : undefined} required />
                <TextInput label="Serving Size (e.g. 1 bowl)" value={form.servingSize} onChange={updateFormField('servingSize')} error={attempted ? fieldErrors.servingSize : undefined} required />
              </SimpleGrid>
            </Stepper.Step>

            <Stepper.Step label={stepLabels[3]} description={stepDescriptions[3]} color={stepHasError(3) && attempted ? 'red' : 'teal'}>
              <Stack gap="sm" mt="sm">
                <Group justify="space-between">
                  <Text size="sm" fw={600}>
                    Ingredients
                  </Text>
                  <Button size="xs" variant="light" color="teal" onClick={addIngredientRow}>
                    Add Ingredient Row
                  </Button>
                </Group>
                {form.ingredients.map((row, index) => (
                  <Group key={row.id} align="end" gap="xs" wrap="nowrap">
                    <TextInput style={{ flex: 2 }} label="Ingredient Name" value={row.name} onChange={(e) => updateIngredientField(index, 'name', e.currentTarget.value)} error={attempted && !row.name.trim() ? 'Required' : undefined} />
                    <TextInput style={{ flex: 1 }} label="Quantity" value={row.amount} onChange={(e) => updateIngredientField(index, 'amount', e.currentTarget.value)} error={attempted && !row.amount.trim() ? 'Required' : undefined} />
                    <TextInput style={{ flex: 1 }} label="Unit (g, ml, tbsp)" value={row.unit} onChange={(e) => updateIngredientField(index, 'unit', e.currentTarget.value)} error={attempted && !row.unit.trim() ? 'Required' : undefined} />
                    <ActionIcon variant="subtle" color="red" onClick={() => removeIngredientRow(index)} disabled={form.ingredients.length === 1} aria-label="Remove ingredient">
                      −
                    </ActionIcon>
                  </Group>
                ))}

                <Divider style={{ borderColor: 'rgba(255,255,255,0.10)' }} />

                <Group justify="space-between">
                  <Text size="sm" fw={600}>
                    Instructions
                  </Text>
                  <Button size="xs" variant="light" color="teal" onClick={addInstructionRow}>
                    Add Instruction Step
                  </Button>
                </Group>
                {form.instructions.map((row, index) => (
                  <Group key={row.id} align="end" gap="xs" wrap="nowrap">
                    <TextInput style={{ flex: 1 }} label={`Instruction Step ${index + 1}`} value={row.text} onChange={(e) => updateInstructionField(index, e.currentTarget.value)} error={attempted && !row.text.trim() ? 'Required' : undefined} />
                    <ActionIcon variant="subtle" color="gray" onClick={() => moveInstruction(index, -1)} disabled={index === 0} aria-label="Move up">
                      ↑
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="gray" onClick={() => moveInstruction(index, 1)} disabled={index === form.instructions.length - 1} aria-label="Move down">
                      ↓
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red" onClick={() => removeInstructionRow(index)} disabled={form.instructions.length === 1} aria-label="Remove step">
                      −
                    </ActionIcon>
                  </Group>
                ))}

                {attempted && (fieldErrors.ingredients || fieldErrors.instructions) && (
                  <Alert color="red" variant="light" radius="md">
                    {fieldErrors.ingredients || fieldErrors.instructions}
                  </Alert>
                )}
              </Stack>
            </Stepper.Step>

            <Stepper.Step label={stepLabels[4]} description={stepDescriptions[4]} color={stepHasError(4) && attempted ? 'red' : 'teal'}>
              <SimpleGrid cols={2} spacing="sm" mt="sm">
                <TextInput label="Calories (kcal)" value={form.calories} onChange={updateFormField('calories')} error={attempted ? fieldErrors.calories : undefined} required autoFocus />
                <TextInput label="Protein (g)" value={form.protein} onChange={updateFormField('protein')} error={attempted ? fieldErrors.protein : undefined} required />
                <TextInput label="Carbohydrates (g)" value={form.carbs} onChange={updateFormField('carbs')} error={attempted ? fieldErrors.carbs : undefined} required />
                <TextInput label="Fat (g)" value={form.fats} onChange={updateFormField('fats')} error={attempted ? fieldErrors.fats : undefined} required />
              </SimpleGrid>
            </Stepper.Step>
          </Stepper>

          {attempted && !isStepValid && (
            <Alert color="red" variant="light" radius="md">
              Complete required fields for this step before continuing.
            </Alert>
          )}

          <SimpleGrid cols={3} spacing="sm" mt="sm">
            <Button type="button" variant="default" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="button" variant="default" onClick={prevStep} disabled={loading || step === 0}>
              Back
            </Button>
            {step < lastStepIndex ? (
              <Button
                type="button"
                onClick={() => {
                  if (!isStepValid) {
                    setAttempted(true)
                    return
                  }
                  nextStep()
                }}
                disabled={loading}
              >
                Next step
              </Button>
            ) : (
              <Button type="button" onClick={() => void handleSubmit()} loading={loading} disabled={isSubmitDisabled || !isStepValid}>
                Submit
              </Button>
            )}
          </SimpleGrid>
        </Stack>
      </Box>
    </Modal>
  )
}

export default CreateRecipeModal
