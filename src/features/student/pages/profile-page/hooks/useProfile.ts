import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { userService } from '@/services/business'
import { PATHS } from '@/router/paths'
import type { User } from '../models'

export function useProfile() {
  const router = useRouter()
  const telegramStore = useTelegramStore()

  const user = ref<User | null>(null)
  const isLoading = ref(false)

  const loadProfile = async () => {
    isLoading.value = true
    try {
      user.value = await userService.getProfile()
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error)
    } finally {
      isLoading.value = false
    }
  }

  const editProfile = () => {
    router.push(PATHS.STUDENT_EDIT_PROFILE)
  }

  const openFeedback = () => {
    console.log('Открытие поддержки')
  }

  onMounted(() => {
    loadProfile()
  })

  return {
    user,
    isLoading,
    loadProfile,
    editProfile,
    openFeedback,
    telegramStore,
  }
}
