import { isAxiosError } from 'axios'
import { authApi } from '@/services/api'
import type { DevLoginTarget } from '@/services/api/auth'
import { useAuthStore, useTelegramStore } from '@/stores'
import type { TelegramAuthDto, AuthResponse } from '@/shared/types'
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

      return response
    } catch (error) {
      this.handleAuthError(error)
      throw error
    }
  }

  // --- DEV: вход по вебу, только в дев-окружении ---
  async getDevUsers() {
    return authApi.devUsers()
  }

  /** Ошибки бросает уже по-русски: экран входа показывает их у поля, а не алертом. */
  async devLogin(target?: DevLoginTarget): Promise<AuthResponse> {
    try {
      const response = await authApi.devLogin(target)
      this.saveAuthData(response)
      this.authStore.setUser(response.user as any)
      this.authStore.setToken(response.accessToken)
      return response
    } catch (error) {
      throw new Error(this.devLoginErrorMessage(error, target))
    }
  }

  async refreshProfile(): Promise<AuthResponse> {
    try {
      const response = await authApi.getProfile()

      // Обновляем данные пользователя
      this.authStore.setUser(response.user as any)
      this.authStore.setToken(response.accessToken)

      return response
    } catch (error) {
      this.handleAuthError(error)
      throw error
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await authApi.refreshToken()

      // Обновляем токен
      this.authStore.setToken(response.accessToken)
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.accessToken)

      return response
    } catch (error) {
      this.handleAuthError(error)
      throw error
    }
  }

  logout(): void {
    // Очищаем данные
    this.authStore.clearAuth()
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)

    // Haptic feedback
    this.telegramStore.hapticFeedback('medium')
  }

  isAuthenticated(): boolean {
    return !!this.authStore.token && !!this.authStore.user
  }

  private parseTelegramInitData(initData: string): TelegramAuthDto {
    const urlParams = new URLSearchParams(initData)

    // Парсим user объект из строки
    const userStr = urlParams.get('user')
    let user: any = {}
    if (userStr) {
      try {
        user = JSON.parse(userStr)
      } catch {
        user = {}
      }
    }

    return {
      id: parseInt(user.id || '0'),
      first_name: user.first_name || '',
      last_name: user.last_name || undefined,
      username: user.username || undefined,
      photo_url: user.photo_url || undefined,
      auth_date: parseInt(urlParams.get('auth_date') || '0'),
      hash: urlParams.get('hash') || '',
    }
  }

  private saveAuthData(response: AuthResponse): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.accessToken)
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user))
  }

  private devLoginErrorMessage(error: unknown, target?: DevLoginTarget): string {
    const status = isAxiosError(error) ? error.response?.status : undefined

    if (status === 404) {
      // по username бэкенд ищет по всей базе; по id — пользователь пропал после загрузки списка
      return target && 'telegramUsername' in target
        ? `Пользователя @${target.telegramUsername} нет в базе`
        : 'Пользователь не найден — обновите список'
    }
    if (status === 403) return 'Бэкенд запущен не в development — веб-вход выключен'
    if (status === undefined || status >= 500) {
      return 'Бэкенд не отвечает — проверьте, что API запущен'
    }
    return 'Не удалось войти. Попробуйте ещё раз'
  }

  private handleAuthError(error: any): void {
    let message = 'Ошибка авторизации'

    if (error.response?.status === 401) {
      message = 'Неверные данные авторизации'
      this.logout()
    } else if (error.response?.status >= 500) {
      message = 'Проблемы на сервере. Попробуйте позже'
    } else if (error.message) {
      message = error.message
    }

    this.telegramStore.showAlert(message)
  }
}

export const authService = new AuthService()
