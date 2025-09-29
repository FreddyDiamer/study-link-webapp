import { apiClient } from './client'
import type { User } from '@/shared/types'

export const usersApi = {
  // Получить профиль текущего пользователя
  getProfile(): Promise<User> {
    return apiClient.get('/users/me')
  },

  // Обновить профиль текущего пользователя
  updateProfile(data: Partial<User>): Promise<User> {
    return apiClient.patch('/users/me', data)
  },

  // Обновить группу пользователя
  updateGroup(groupId: string): Promise<User> {
    return apiClient.patch(`/users/group`, { groupId })
  },

  // Получить пользователя по ID
  getUser(id: string): Promise<User> {
    return apiClient.get(`/users/${id}`)
  },

  // Получить статистику пользователя
  getUserStats(id: string): Promise<any> {
    return apiClient.get(`/users/${id}/stats`)
  },
}
