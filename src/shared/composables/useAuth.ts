import { ref, computed } from 'vue'
import type { User } from '@/shared/types'
import { STORAGE_KEYS } from '@/shared/constants'

const user = ref<User | null>(null)
const isLoading = ref(false)

export const useAuth = () => {
  const isAuthenticated = computed(() => !!user.value)
  const isStudent = computed(() => user.value?.role === 'student' || user.value?.role === 'both')
  const isTutor = computed(() => user.value?.role === 'tutor' || user.value?.role === 'both')

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
        username: telegramUser.username,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        role: 'student',
        rating: 0,
        reviewsCount: 0,
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
    isStudent,
    isTutor,
    isLoading: computed(() => isLoading.value),
    login,
    logout,
    initAuth,
  }
}
