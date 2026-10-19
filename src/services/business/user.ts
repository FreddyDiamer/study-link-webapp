import { usersApi } from '@/services/api'
import { formError } from './errors'
import { useAuthStore, useTelegramStore } from '@/stores'
import type { User } from '@/shared/types'

export class UserService {
  private get telegramStore() {
    return useTelegramStore()
  }

  private get authStore() {
    return useAuthStore()
  }

  // свежий профиль — в стор: от groupId в нём зависят «предметы вашей группы»
  private remember(user: User): User {
    if (user?.id && user.id === this.authStore.user?.id) this.authStore.setUser(user)
    return user
  }

  async getProfile(): Promise<User> {
    try {
      const user = await usersApi.getProfile()
      return this.remember(this.convertUserToRubles(user))
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

      return this.remember(this.convertUserToRubles(user))
    } catch (error) {
      // форма показывает причину у кнопки — модальный алерт здесь лишний
      this.telegramStore.hapticFeedback('error')
      throw formError(error, 'Не получилось сохранить профиль')
    }
  }

  /** inForm — смена группы внутри формы профиля: причину сбоя покажет форма, без алерта */
  async updateGroup(groupId: string, inForm = false): Promise<User> {
    try {
      this.telegramStore.hapticFeedback('light')

      const user = await usersApi.updateGroup(groupId)

      return this.remember(this.convertUserToRubles(user))
    } catch (error) {
      if (inForm) throw formError(error, 'Не получилось сменить группу')
      this.handleError(error, 'Ошибка при смене группы')
      throw error
    }
  }

  async getUser(id: string): Promise<User> {
    try {
      const user = await usersApi.getUser(id)
      return this.convertUserToRubles(user)
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

  private convertUserToRubles(user: User): User {
    return {
      ...user,
      balance: user.balance, // конвертируем из копеек в рубли
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
