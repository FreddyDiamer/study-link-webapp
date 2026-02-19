import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { userService } from '@/services/business/user'
import type { User } from '@/shared/types'

export function useEditProfile() {
  const router = useRouter()
  const telegramStore = useTelegramStore()

  const form = reactive({
    firstName: telegramStore.firstName || '',
    lastName: telegramStore.lastName || '',
  })
  const isLoading = ref(false)

  const handleSave = async () => {
    isLoading.value = true
    try {
      const updateData: Partial<User> = {
        name: `${form.firstName} ${form.lastName}`.trim(),
      }
      await userService.updateProfile(updateData)
      router.back()
    } catch (error) {
      console.error('Ошибка сохранения профиля:', error)
    } finally {
      isLoading.value = false
    }
  }

  const handleBack = () => router.back()

  return { form, isLoading, handleSave, handleBack }
}
