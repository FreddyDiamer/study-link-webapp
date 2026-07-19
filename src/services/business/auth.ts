import { authApi } from '@/services/api'
import { useAuthStore, useTelegramStore } from '@/stores'
import type { AuthResponse } from '@/shared/types'
import { STORAGE_KEYS } from '@/shared/constants'

export class AuthService {
  private get authStore() {
    return useAuthStore()
  }

  private get telegramStore() {
    return useTelegramStore()
  }

  async loginWithTelegram(initData: string): Promise<AuthResponse> {
    try {
      // Haptic feedback
      this.telegramStore.hapticFeedback('light')

      // API запрос
      const response = await authApi.telegramAuth(initData)

      // Сохраняем токен и пользователя
      this.saveAuthData(response)

      // Обновляем состояние
      this.authStore.setUser(response.user as any)
      this.authStore.setToken(response.accessToken)

      // Показываем уведомление
      this.telegramStore.showAlert('Успешная авторизация!')

      return response
    } catch (error) {
      this.handleAuthError(error)
      throw error
    }
  }

  private saveAuthData(response: AuthResponse): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.accessToken)
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user))
  }

  private handleAuthError(error: any): void {
    let message = 'Ошибка авторизации'

    if (error.response?.status === 401) {
      message = 'Неверные данные авторизации'
      // Сбрасываем данные авторизации
      this.authStore.clearAuth()
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
    } else if (error.response?.status >= 500) {
      message = 'Проблемы на сервере. Попробуйте позже'
    } else if (error.message) {
      message = error.message
    }

    this.telegramStore.showAlert(message)
  }
}

export const authService = new AuthService()
