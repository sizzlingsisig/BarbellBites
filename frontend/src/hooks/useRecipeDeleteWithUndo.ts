import { useMemo, useState } from 'react'
import { deleteRecipe, undoDeleteRecipe } from '../api/recipesApi'
import { notifyError, notifyInfo, notifyUndo } from '../services/notify'

export const RECIPES_REFRESH_EVENT = 'recipes:refresh'

type RecipeDeleteRequest = {
  slug: string
  title: string
  onDeleted?: () => void | Promise<void>
  onUndone?: () => void | Promise<void>
}

const UNDO_WINDOW_MS = 6000

export function useRecipeDeleteWithUndo() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<RecipeDeleteRequest | null>(null)

  const openDeleteModal = (request: RecipeDeleteRequest) => {
    setPendingDelete(request)
    setDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    if (deletingSlug) {
      return
    }

    setDeleteModalOpen(false)
    setPendingDelete(null)
  }

  const confirmDelete = async () => {
    if (!pendingDelete) {
      return
    }

    try {
      setDeletingSlug(pendingDelete.slug)

      await deleteRecipe(pendingDelete.slug)

      let undoWindowOpen = true
      const undoWindowTimer = window.setTimeout(() => {
        undoWindowOpen = false
      }, UNDO_WINDOW_MS)

      notifyUndo({
        title: 'Recipe Deleted',
        message: `You can restore "${pendingDelete.title}" for ${UNDO_WINDOW_MS / 1000}s.`,
        timeout: UNDO_WINDOW_MS,
        onUndo: async () => {
          if (!undoWindowOpen) {
            return
          }

          undoWindowOpen = false
          window.clearTimeout(undoWindowTimer)

          try {
            await undoDeleteRecipe(pendingDelete.slug)
            notifyInfo({
              title: 'Deletion undone',
              message: `"${pendingDelete.title}" was restored.`,
            })
            window.dispatchEvent(new CustomEvent(RECIPES_REFRESH_EVENT))
            if (pendingDelete.onUndone) {
              await pendingDelete.onUndone()
            }
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to restore recipe'
            notifyError({
              title: 'Undo Failed',
              message,
            })
          }
        },
      })

      if (pendingDelete.onDeleted) {
        await pendingDelete.onDeleted()
      }

      setDeleteModalOpen(false)
      setPendingDelete(null)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete recipe'
      notifyError({
        title: 'Delete Failed',
        message,
      })
    } finally {
      setDeletingSlug(null)
    }
  }

  const modalProps = useMemo(
    () => ({
      opened: deleteModalOpen,
      loading: Boolean(deletingSlug),
      message: 'Recipe will be deleted immediately. You can undo from the global toast for 6 seconds.',
      onClose: closeDeleteModal,
      onConfirm: () => {
        void confirmDelete()
      },
    }),
    [deleteModalOpen, deletingSlug],
  )

  return {
    openDeleteModal,
    modalProps,
    deletingSlug,
  }
}
