import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import type { User, TelegramUser } from '@/shared/types'
import { STORAGE_KEYS } from '@/shared/constants'
import { authApi } from '@/api/auth'
import { telegramService } from '@/services/telegram/init'

interface AuthResponse {
  user: User
  token: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const userRole = computed(() => user.value?.role)
  const isStudent = computed(() => userRole.value === 'student' || userRole.value === 'both')
  const isTutor = computed(() => userRole.value === 'tutor' || userRole.value === 'both')

  // Actions
  const initializeAuth = () => {
    // Загружаем данные из localStorage
    const savedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER)

    if (savedToken && savedUser) {
      try {
        token.value = savedToken
        user.value = JSON.parse(savedUser)
      } catch (err) {
        console.error('Failed to parse saved user data:', err)
        clearAuth()
      }
    }
  }

  const loginWithTelegram = async () => {
    if (!telegramService.isReady()) {
      throw new Error('Telegram WebApp not initialized')
    }

    const telegramUser = telegramService.getUser()
    if (!telegramUser) {
      throw new Error('No Telegram user data')
    }

    isLoading.value = true
    error.value = null

    try {
      const initData = telegramService.getInitData()

      const response = await authApi.loginWithTelegram({
        initData,
        user: telegramUser,
      })

      user.value = response.user
      token.value = response.token

      // Сохраняем в localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user))

      return response.user
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка авторизации'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (err) {
      console.warn('Ошибка при выходе:', err)
    } finally {
      clearAuth()
    }
  }

  const clearAuth = () => {
    user.value = null
    token.value = null
    error.value = null
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
  }

  const updateProfile = async (userData: Partial<User>) => {
    if (!user.value) return

    isLoading.value = true
    try {
      const updatedUser = await authApi.getCurrentUser()

      user.value = { ...user.value, ...updatedUser }
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user.value))

      return updatedUser
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка обновления профиля'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    user: readonly(user),
    token: readonly(token),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Getters
    isAuthenticated,
    userRole,
    isStudent,
    isTutor,

    // Actions
    initializeAuth,
    loginWithTelegram,
    logout,
    clearAuth,
    updateProfile,
  }
})
