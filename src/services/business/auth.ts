import { authApi } from '@/services/api/auth'
import { useTelegramStore } from '@/stores/telegram'
import { useAuthStore } from '@/stores/auth'
import type { User, UserRole } from '@/shared/types'

export interface AuthStep {
  id: number
  title: string
  description: string
  isCompleted: boolean
  isRequired: boolean
}

export interface UserProfileData {
  firstName: string
  lastName?: string
  username?: string
  role: UserRole
  group?: string
}

export class AuthService {
  private telegramStore = useTelegramStore()
  private authStore = useAuthStore()

  /**
   * Инициализация авторизации из localStorage
   */
  initializeAuth() {
    this.authStore.initializeAuth()
  }

  /**
   * Авторизация через Telegram WebApp
   */
  async loginWithTelegram(): Promise<User> {
    if (!this.telegramStore.isInitialized) {
      throw new Error('Telegram WebApp не инициализирован')
    }

    const telegramUser = this.telegramStore.user
    if (!telegramUser) {
      throw new Error('Нет данных пользователя Telegram')
    }

    this.authStore.setLoading(true)
    this.authStore.setError(null)

    try {
      const initData = this.telegramStore.initData

      const response = await authApi.loginWithTelegram({
        initData,
        user: telegramUser,
      })

      // Обновляем store через мутации
      this.authStore.setAuth({
        user: response.user,
        token: response.token,
      })

      // Показываем уведомление через Telegram
      this.telegramStore.hapticFeedback('light')
      this.telegramStore.showAlert('Авторизация прошла успешно')

      return response.user
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error)
      this.authStore.setError(errorMessage)

      console.error('Ошибка авторизации через Telegram:', error)
      throw new Error(errorMessage)
    } finally {
      this.authStore.setLoading(false)
    }
  }

  /**
   * Выход из системы
   */
  async logout(): Promise<void> {
    this.authStore.setLoading(true)

    try {
      // Попытка вызвать API logout
      await authApi.logout()
    } catch (error) {
      console.warn('Ошибка при выходе из API:', error)
      // Не блокируем выход при ошибке API
    } finally {
      // Всегда очищаем локальное состояние
      this.authStore.clearAuth()
      this.authStore.setLoading(false)

      this.telegramStore.hapticFeedback('medium')
      this.telegramStore.showAlert('Вы вышли из системы')
    }
  }

  /**
   * Обновление профиля пользователя
   */
  async updateProfile(userData: Partial<User>): Promise<User> {
    if (!this.authStore.user) {
      throw new Error('Пользователь не авторизован')
    }

    this.authStore.setLoading(true)
    this.authStore.setError(null)

    try {
      // Отправляем обновления на сервер
      const updatedUser = await authApi.updateProfile(userData)

      // Обновляем store
      this.authStore.setUser(updatedUser)

      this.telegramStore.hapticFeedback('medium')
      this.telegramStore.showAlert('Профиль обновлен')

      return updatedUser
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error)
      this.authStore.setError(errorMessage)

      console.error('Ошибка обновления профиля:', error)
      throw new Error(errorMessage)
    } finally {
      this.authStore.setLoading(false)
    }
  }

  /**
   * Получение текущего пользователя с сервера
   */
  async getCurrentUser(): Promise<User> {
    if (!this.authStore.token) {
      throw new Error('Нет токена авторизации')
    }

    this.authStore.setLoading(true)

    try {
      const user = await authApi.getCurrentUser()

      // Обновляем store актуальными данными
      this.authStore.setUser(user)

      return user
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error)
      this.authStore.setError(errorMessage)

      // Если токен невалидный, очищаем авторизацию
      if (error.response?.status === 401) {
        this.authStore.clearAuth()
      }

      console.error('Ошибка получения пользователя:', error)
      throw new Error(errorMessage)
    } finally {
      this.authStore.setLoading(false)
    }
  }

  /**
   * Проверка валидности токена
   */
  async validateToken(): Promise<boolean> {
    if (!this.authStore.token) {
      return false
    }

    try {
      await this.getCurrentUser()
      return true
    } catch (error) {
      console.log('Токен невалидный:', error)
      return false
    }
  }

  /**
   * Принудительное обновление токена из localStorage
   */
  refreshFromStorage() {
    this.authStore.initializeAuth()
  }

  /**
   * Получение понятного сообщения об ошибке
   */
  private getErrorMessage(error: any): string {
    if (error.response?.status === 400) {
      return error.response.data?.message || 'Некорректные данные'
    }
    if (error.response?.status === 401) {
      return 'Необходима повторная авторизация'
    }
    if (error.response?.status === 403) {
      return 'Недостаточно прав для выполнения операции'
    }
    if (error.response?.status >= 500) {
      return 'Проблемы на сервере. Попробуйте позже'
    }
    if (error.response?.data?.message) {
      return error.response.data.message
    }
    if (error.message) {
      return error.message
    }
    return 'Произошла ошибка авторизации'
  }

  /**
   * Получение шагов регистрации
   */
  getAuthSteps(): AuthStep[] {
    return [
      {
        id: 1,
        title: 'Выбор роли',
        description: 'Выберите, кто вы: студент или репетитор',
        isCompleted: false,
        isRequired: true,
      },
      {
        id: 2,
        title: 'Основная информация',
        description: 'Укажите имя и дополнительную информацию',
        isCompleted: false,
        isRequired: true,
      },
      {
        id: 3,
        title: 'Группа',
        description: 'Укажите группу (для студентов)',
        isCompleted: false,
        isRequired: false,
      },
    ]
  }

  /**
   * Проверка, требуется ли регистрация
   */
  isAuthRequired(): boolean {
    const user = this.authStore.user
    return !user || !this.isProfileComplete(user)
  }

  /**
   * Проверка полноты профиля
   */
  isProfileComplete(user: User): boolean {
    if (!user.firstName || !user.role) {
      return false
    }

    // Базовая проверка для всех пользователей
    return true
  }

  /**
   * Выбор роли пользователя
   */
  async selectUserRole(role: UserRole) {
    if (!['student', 'tutor', 'both'].includes(role)) {
      throw new Error('Некорректная роль пользователя')
    }

    try {
      await this.updateProfile({ role })

      this.telegramStore.hapticFeedback('medium')

      return true
    } catch (error: any) {
      console.error('Ошибка выбора роли:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Обновление имени пользователя
   */
  async updateName(firstName: string, lastName?: string) {
    if (!firstName || firstName.trim().length < 2) {
      throw new Error('Имя должно содержать минимум 2 символа')
    }

    try {
      await this.updateProfile({ firstName, lastName })

      this.telegramStore.hapticFeedback('medium')
      this.telegramStore.showAlert('Имя обновлено')

      return true
    } catch (error: any) {
      console.error('Ошибка обновления имени:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Обновление группы студента
   */
  async updateGroup(group: string) {
    if (!group || group.trim().length === 0) {
      throw new Error('Укажите группу')
    }

    try {
      await this.updateProfile({ group })

      this.telegramStore.hapticFeedback('medium')
      this.telegramStore.showAlert('Группа обновлена')

      return true
    } catch (error: any) {
      console.error('Ошибка обновления группы:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Обновление username
   */
  async updateUsername(username: string) {
    if (!username || username.trim().length === 0) {
      throw new Error('Укажите имя пользователя')
    }

    try {
      await this.updateProfile({ username })

      this.telegramStore.hapticFeedback('medium')
      this.telegramStore.showAlert('Имя пользователя обновлено')

      return true
    } catch (error: any) {
      console.error('Ошибка обновления username:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Завершение регистрации
   */
  async completeAuth() {
    const user = this.authStore.user
    if (!user) {
      throw new Error('Пользователь не авторизован')
    }

    if (!this.isProfileComplete(user)) {
      throw new Error('Заполните все обязательные поля')
    }

    try {
      // Здесь может быть дополнительная логика завершения регистрации
      this.telegramStore.hapticFeedback('success')
      this.telegramStore.showAlert('Регистрация завершена!')

      return true
    } catch (error: any) {
      console.error('Ошибка завершения регистрации:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Получение прогресса регистрации
   */
  getAuthProgress(): { completed: number; total: number; percentage: number } {
    const user = this.authStore.user
    if (!user) {
      return { completed: 0, total: 3, percentage: 0 }
    }

    let completed = 0
    const total = 3

    // Роль выбрана
    if (user.role) completed++

    // Имя указано
    if (user.firstName) completed++

    // Дополнительная информация (опционально)
    if (user.group || user.username) completed++

    const percentage = Math.round((completed / total) * 100)

    return { completed, total, percentage }
  }

  /**
   * Валидация данных профиля
   */
  private validateProfileData(data: Partial<UserProfileData>) {
    if (data.firstName !== undefined) {
      if (!data.firstName || data.firstName.trim().length < 2) {
        throw new Error('Имя должно содержать минимум 2 символа')
      }
      if (data.firstName.length > 50) {
        throw new Error('Имя не должно превышать 50 символов')
      }
    }

    if (data.lastName !== undefined) {
      if (data.lastName && data.lastName.length > 50) {
        throw new Error('Фамилия не должна превышать 50 символов')
      }
    }

    if (data.username !== undefined) {
      if (data.username && data.username.length > 30) {
        throw new Error('Имя пользователя не должно превышать 30 символов')
      }
    }

    if (data.group !== undefined) {
      if (data.group && data.group.length > 20) {
        throw new Error('Название группы не должно превышать 20 символов')
      }
    }
  }
}

// Создаем единственный экземпляр
export const authService = new AuthService()
