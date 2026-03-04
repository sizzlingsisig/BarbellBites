import { notifications } from '@mantine/notifications'
import { createElement } from 'react'

type NotifyOptions = {
  title: string
  message: string
  timeout?: number
}

type NotifyUndoOptions = NotifyOptions & {
  onUndo: () => void | Promise<void>
  undoLabel?: string
  id?: string
}

const DEFAULT_SNACKBAR_TIMEOUT = 3500

export const notifySuccess = ({ title, message, timeout = DEFAULT_SNACKBAR_TIMEOUT }: NotifyOptions) => {
  notifications.show({
    title,
    message,
    color: 'teal',
    autoClose: timeout,
  })
}

export const notifyError = ({ title, message, timeout = DEFAULT_SNACKBAR_TIMEOUT }: NotifyOptions) => {
  notifications.show({
    title,
    message,
    color: 'red',
    autoClose: timeout,
  })
}

export const notifyInfo = ({ title, message, timeout = DEFAULT_SNACKBAR_TIMEOUT }: NotifyOptions) => {
  notifications.show({
    title,
    message,
    color: 'blue',
    autoClose: timeout,
  })
}

export const notifyUndo = ({
  title,
  message,
  timeout = 6000,
  onUndo,
  undoLabel = 'Undo',
  id,
}: NotifyUndoOptions) => {
  const notificationId = id ?? `undo-${Date.now()}`

  notifications.show({
    id: notificationId,
    title,
    color: 'gray',
    autoClose: timeout,
    message: createElement(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        },
      },
      createElement('span', { style: { fontSize: '0.875rem' } }, message),
      createElement(
        'button',
        {
          type: 'button',
          onClick: () => {
            notifications.hide(notificationId)
            void onUndo()
          },
          style: {
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '6px',
            padding: '2px 8px',
            fontSize: '0.75rem',
            cursor: 'pointer',
          },
        },
        undoLabel,
      ),
    ),
  })

  return notificationId
}
