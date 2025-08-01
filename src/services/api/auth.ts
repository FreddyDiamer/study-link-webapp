import { apiClient } from './client'
import type { AuthResponse } from '@/shared/types'

export const authApi = {
  telegramAuth: (initData: string) => apiClient.post<AuthResponse>('/auth/telegram', { initData }),

  getProfile: () => apiClient.get<AuthResponse>('/auth/profile'),

  refreshToken: () => apiClient.get<AuthResponse>('/auth/refresh'),
}
