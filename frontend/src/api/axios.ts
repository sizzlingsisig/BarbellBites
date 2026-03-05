import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

type AuthBindings = {
  getAccessToken: () => string | null
  setAccessToken: (token: string) => void
  clearAuthState: () => void
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v2',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

let refreshPromise: Promise<string | null> | null = null
let authBindings: AuthBindings = {
  getAccessToken: () => null,
  setAccessToken: () => undefined,
  clearAuthState: () => undefined,
}

export const configureAuthBindings = (bindings: AuthBindings): void => {
  authBindings = bindings
}

api.interceptors.request.use((config) => {
  const token = authBindings.getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

const refreshAccessToken = async (): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = api
      .post<{ accessToken: string }>('/auth/refresh')
      .then((response) => {
        const nextToken = response.data.accessToken
        authBindings.setAccessToken(nextToken)
        return nextToken
      })
      .catch(() => {
        authBindings.clearAuthState()
        return null
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined
    const status = error.response?.status
    const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh') ?? false

    if (!originalRequest || status !== 401 || originalRequest._retry || isRefreshRequest) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    const refreshedToken = await refreshAccessToken()

    if (!refreshedToken) {
      authBindings.clearAuthState()
      return Promise.reject(error)
    }

    originalRequest.headers.Authorization = `Bearer ${refreshedToken}`
    return api(originalRequest)
  },
)

export default api