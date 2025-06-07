import { apiClient } from './client'
import type { User, TelegramUser } from '@/shared/types'

export interface LoginRequest {
  initData: string
  user: TelegramUser
}

export interface AuthResponse {
  user: User
  token: string
}

export const authApi = {
  // Авторизация через Telegram
  loginWithTelegram: (data: LoginRequest) => apiClient.post<AuthResponse>('/auth/telegram', data),

  // Обновление токена
  refreshToken: () => apiClient.post<AuthResponse>('/auth/refresh'),

  // Выход
  logout: () => apiClient.post('/auth/logout'),

  // Получение текущего пользователя
  getCurrentUser: () => apiClient.get<User>('/auth/me'),

  // Обновление профиля пользователя
  updateProfile: (data: Partial<User>) => apiClient.put<User>('/auth/profile', data),

  // Проверка токена
  verifyToken: () => apiClient.get<{ valid: boolean }>('/auth/verify'),
}
