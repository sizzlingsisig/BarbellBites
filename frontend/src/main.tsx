import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'
import './index.css'
import App from './App.tsx'
import { configureAuthBindings } from './api/axios'
import { useAuthStore } from './store/authStore'
import { theme } from './theme'

configureAuthBindings({
  getAccessToken: () => useAuthStore.getState().accessToken,
  setAccessToken: (token) => useAuthStore.getState().setAccessToken(token),
  clearAuthState: () => useAuthStore.getState().clearAuth(),
})

void useAuthStore.getState().initializeAuth()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications position="top-right" autoClose={3500} limit={5} />
      <App />
    </MantineProvider>
  </StrictMode>,
)
