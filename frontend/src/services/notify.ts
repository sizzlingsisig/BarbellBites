import { notifications } from '@mantine/notifications'

type NotifyOptions = {
  title: string
  message: string
  timeout?: number
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
