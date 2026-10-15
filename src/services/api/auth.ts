import { apiClient } from './client'
import type { AuthResponse } from '@/shared/types'

export interface DevUser {
  id: string
  name?: string
  telegramUsername?: string
}

/** Под кем войти: пусто — тестовый dev_user, создаётся бэкендом при первом входе. */
export type DevLoginTarget = { userId: string } | { telegramUsername: string }

export const authApi = {
  telegramAuth: (initData: string) => apiClient.post<AuthResponse>('/auth/telegram', { initData }),

  getProfile: () => apiClient.get<AuthResponse>('/auth/profile'),

  refreshToken: () => apiClient.get<AuthResponse>('/auth/refresh'),

  // --- DEV ONLY (бэкенд отдаёт эти эндпоинты только не в проде) ---
  devUsers: () => apiClient.get<DevUser[]>('/auth/dev/users'),
  devLogin: (target?: DevLoginTarget) =>
    apiClient.post<AuthResponse>('/auth/dev/login', target ?? {}),
}
