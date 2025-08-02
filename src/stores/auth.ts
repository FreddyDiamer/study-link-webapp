import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import type { User } from '@/shared/types'
import { STORAGE_KEYS } from '@/shared/constants'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!token.value)

  // Mutations (только изменение состояния)
  const setUser = (newUser: User) => {
    user.value = newUser
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser))
  }

  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken)
  }

  const setAuth = (authData: { user: User; token: string }) => {
    setUser(authData.user)
    setToken(authData.token)
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setError = (errorMessage: string | null) => {
    error.value = errorMessage
  }

  const clearAuth = () => {
    user.value = null
    token.value = null
    error.value = null
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
  }

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

  return {
    // State (readonly для защиты от прямых изменений)
    user: readonly(user),
    token: readonly(token),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Getters
    isAuthenticated,

    // Mutations
    setUser,
    setToken,
    setAuth,
    setLoading,
    setError,
    clearAuth,
    initializeAuth,
  }
})
