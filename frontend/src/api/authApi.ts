import api from './axios'

export type AuthUser = {
  id: string
  name: string
  email: string
}

export type RegisterInput = {
  name: string
  email: string
  password: string
  proteinGoal?: number
}

export type LoginInput = {
  email: string
  password: string
}

type AuthSuccessResponse = {
  status: 'success'
  accessToken: string
  data: {
    user: AuthUser
  }
}

type RefreshResponse = {
  status: 'success'
  accessToken: string
}

type MeResponse = {
  status: 'success'
  data: {
    user: AuthUser
  }
}

export const registerRequest = async (input: RegisterInput): Promise<{ accessToken: string; user: AuthUser }> => {
  const response = await api.post<AuthSuccessResponse>('/auth/register', input)

  return {
    accessToken: response.data.accessToken,
    user: response.data.data.user,
  }
}

export const loginRequest = async (input: LoginInput): Promise<{ accessToken: string; user: AuthUser }> => {
  const response = await api.post<AuthSuccessResponse>('/auth/login', input)

  return {
    accessToken: response.data.accessToken,
    user: response.data.data.user,
  }
}

export const logoutRequest = async (): Promise<void> => {
  await api.post('/auth/logout')
}

export const refreshRequest = async (): Promise<string> => {
  const response = await api.post<RefreshResponse>('/auth/refresh')
  return response.data.accessToken
}

export const fetchCurrentUserRequest = async (): Promise<AuthUser> => {
  const response = await api.get<MeResponse>('/auth/test')
  return response.data.data.user
}
