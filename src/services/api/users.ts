import { apiClient } from './client'
import type { User } from '@/shared/types'

export const usersApi = {
  // Получить профиль пользователя
  getProfile: () => apiClient.get<User>('/users/profile'),

  // Обновить профиль пользователя
  updateProfile: (data: Partial<User>) => apiClient.patch<User>('/users/profile', data),

  // Получить пользователя по ID
  getUser: (id: string) => apiClient.get<User>(`/users/${id}`),

  // Получить баланс пользователя
  getBalance: () => apiClient.get<{ balance: number }>('/users/balance'),
}
