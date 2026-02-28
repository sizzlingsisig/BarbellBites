import { AxiosError } from 'axios'
import { create } from 'zustand'
import { configureAuthBindings } from '../api/axios'
import {
  fetchCurrentUserRequest,
  loginRequest,
  logoutRequest,
  refreshRequest,
  registerRequest,
  type AuthUser,
  type LoginInput,
  type RegisterInput,
} from '../services/authService'

type ApiErrorResponse = {
  message?: string
}

type AuthStore = {
  accessToken: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
  error: string | null
  setAccessToken: (token: string) => void
  setAuthSession: (token: string, user: AuthUser) => void
  clearAuth: () => void
  clearError: () => void
  register: (input: RegisterInput) => Promise<void>
  login: (input: LoginInput) => Promise<void>
  logout: () => Promise<void>
  initializeAuth: () => Promise<void>
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return (error.response?.data as ApiErrorResponse | undefined)?.message ?? 'Authentication request failed.'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Authentication request failed.'
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  setAccessToken: (token) =>
    set({
      accessToken: token,
      isAuthenticated: true,
    }),

  setAuthSession: (token, user) =>
    set({
      accessToken: token,
      user,
      isAuthenticated: true,
      error: null,
    }),

  clearAuth: () =>
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    }),

  clearError: () => set({ error: null }),

  register: async (input) => {
    set({ isLoading: true, error: null })

    try {
      const { accessToken, user } = await registerRequest(input)
      get().setAuthSession(accessToken, user)
      set({ isLoading: false })
    } catch (error) {
      get().clearAuth()
      set({
        isLoading: false,
        error: getErrorMessage(error),
      })
      throw error
    }
  },

  login: async (input) => {
    set({ isLoading: true, error: null })

    try {
      const { accessToken, user } = await loginRequest(input)
      get().setAuthSession(accessToken, user)
      set({ isLoading: false })
    } catch (error) {
      get().clearAuth()
      set({
        isLoading: false,
        error: getErrorMessage(error),
      })
      throw error
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null })

    try {
      await logoutRequest()
    } finally {
      get().clearAuth()
      set({
        isLoading: false,
      })
    }
  },

  initializeAuth: async () => {
    if (get().isInitialized) {
      return
    }

    set({ isLoading: true, error: null })

    try {
      const accessToken = await refreshRequest()
      get().setAccessToken(accessToken)
      const user = await fetchCurrentUserRequest()
      set({ user, isAuthenticated: true })
    } catch (error) {
      get().clearAuth()
      set({ error: getErrorMessage(error) })
    } finally {
      set({ isInitialized: true, isLoading: false })
    }
  },
}))

configureAuthBindings({
  getAccessToken: () => useAuthStore.getState().accessToken,
  setAccessToken: (token) => useAuthStore.getState().setAccessToken(token),
  clearAuthState: () => useAuthStore.getState().clearAuth(),
})
