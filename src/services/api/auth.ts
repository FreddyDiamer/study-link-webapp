import { apiClient } from './client'
import type { AuthResponse } from '@/shared/types'

export interface DevUser {
  id: string
  name?: string
  telegramUsername?: string
}

export const authApi = {
  telegramAuth: (initData: string) => apiClient.post<AuthResponse>('/auth/telegram', { initData }),

  getProfile: () => apiClient.get<AuthResponse>('/auth/profile'),

  refreshToken: () => apiClient.get<AuthResponse>('/auth/refresh'),

  // --- DEV ONLY (бэкенд отдаёт эти эндпоинты только не в проде) ---
  devUsers: () => apiClient.get<DevUser[]>('/auth/dev/users'),
  devLogin: (userId?: string) =>
    apiClient.post<AuthResponse>('/auth/dev/login', userId ? { userId } : {}),
}
