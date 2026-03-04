import { Button, Group, Modal, Text } from '@mantine/core'

type ConfirmDeleteModalProps = {
  opened: boolean
  loading?: boolean
  title?: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  onClose: () => void
  onConfirm: () => void
}

function ConfirmDeleteModal({
  opened,
  loading = false,
  title = 'Are you sure you want to delete?',
  message = 'This action can be undone for a few seconds from the toast notification.',
  confirmLabel = 'Yes, delete',
  cancelLabel = 'Cancel',
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <Text size="sm" c="dimmed" mb="md">
        {message}
      </Text>

      <Group justify="flex-end">
        <Button variant="default" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button color="red" loading={loading} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </Group>
    </Modal>
  )
}

export default ConfirmDeleteModal