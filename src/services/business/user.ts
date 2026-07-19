import { usersApi } from '@/services/api'
import { useTelegramStore } from '@/stores'
import type { User } from '@/shared/types'

export class UserService {
  private get telegramStore() {
    return useTelegramStore()
  }

  async getProfile(): Promise<User> {
    try {
      return await usersApi.getProfile()
    } catch (error) {
      this.handleError(error, 'Ошибка при получении профиля')
      throw error
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      this.validateProfileData(data)

      this.telegramStore.hapticFeedback('light')

      const user = await usersApi.updateProfile(data)

      this.telegramStore.showAlert('Профиль обновлен!')

      return user
    } catch (error) {
      this.handleError(error, 'Ошибка при обновлении профиля')
      throw error
    }
  }

  async getUser(id: string): Promise<User> {
    try {
      return await usersApi.getUser(id)
    } catch (error) {
      this.handleError(error, 'Ошибка при получении пользователя')
      throw error
    }
  }

  private validateProfileData(data: Partial<User>): void {
    if (data.name && data.name.trim().length < 2) {
      throw new Error('Имя должно содержать минимум 2 символа')
    }
    if (data.name && data.name.length > 50) {
      throw new Error('Имя не должно превышать 50 символов')
    }
    if (data.description && data.description.length > 500) {
      throw new Error('Описание не должно превышать 500 символов')
    }
  }

  private handleError(error: any, defaultMessage: string): void {
    let message = defaultMessage

    if (error.response?.status === 403) {
      message = 'Недостаточно прав для выполнения операции'
    } else if (error.response?.status === 404) {
      message = 'Пользователь не найден'
    } else if (error.response?.status >= 500) {
      message = 'Проблемы на сервере. Попробуйте позже'
    } else if (error.message) {
      message = error.message
    }

    this.telegramStore.showAlert(message)
  }
}

export const userService = new UserService()
