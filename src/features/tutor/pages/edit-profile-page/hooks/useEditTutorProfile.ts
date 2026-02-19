import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userService } from '@/services/business/user'
import type { User } from '@/shared/types'
import type { EditProfileForm } from '../models'

export function useEditTutorProfile() {
  const router = useRouter()

  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const isSaving = ref(false)
  const form = reactive<EditProfileForm>({
    name: '',
    description: '',
  })

  const loadProfile = async () => {
    isLoading.value = true
    try {
      user.value = await userService.getProfile()
      form.name = user.value.name || ''
      form.description = user.value.description || ''
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error)
    } finally {
      isLoading.value = false
    }
  }

  const handleSave = async () => {
    isSaving.value = true
    try {
      const updateData: Partial<User> = {}
      if (form.name.trim()) updateData.name = form.name.trim()
      if (form.description.trim()) updateData.description = form.description.trim()
      await userService.updateProfile(updateData)
      router.back()
    } catch (error) {
      console.error('Ошибка сохранения профиля:', error)
    } finally {
      isSaving.value = false
    }
  }

  const handleBack = () => {
    router.back()
  }

  onMounted(() => {
    loadProfile()
  })

  return {
    user,
    form,
    isLoading,
    isSaving,
    loadProfile,
    handleSave,
    handleBack,
  }
}
