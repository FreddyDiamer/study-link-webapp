import { ref, computed } from 'vue'
import type { User } from '@/shared/types'
import { STORAGE_KEYS } from '@/shared/constants'

const user = ref<User | null>(null)
const isLoading = ref(false)

export const useAuth = () => {
  const isAuthenticated = computed(() => !!user.value)

  const login = async (telegramUser: any) => {
    isLoading.value = true
    try {
      // TODO: API call to authenticate with Telegram user
      // const response = await authService.login(telegramUser)
      // user.value = response.user

      // Temporary mock
      user.value = {
        id: '1',
        telegramId: telegramUser.id,
        telegramUsername: telegramUser.username,
        firstName: telegramUser.first_name,
        name: telegramUser.first_name,
        lastActivity: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        balance: 0,
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user.value))
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
  }

  const initAuth = () => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER)
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
  }

  return {
    user: computed(() => user.value),
    isAuthenticated,
    isLoading: computed(() => isLoading.value),
    login,
    logout,
    initAuth,
  }
}
