import { computed, ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@/shared/composables'
import type { User } from '@/shared/types'
import type { EditProfileForm } from '../models'

export function useEditTutorProfile() {
  const router = useRouter()
  const { getProfile, updateProfile } = useUser()
  const profileQuery = getProfile()

  const user = computed(() => (profileQuery.data.value as User | undefined) ?? null)
  const isLoading = profileQuery.isLoading
  const isSaving = ref(false)
  const form = reactive<EditProfileForm>({
    name: '',
    description: '',
  })

  watch(
    user,
    (u) => {
      if (u) {
        form.name = u.name || ''
        form.description = u.description || ''
      }
    },
    { immediate: true },
  )

  const loadProfile = () => {
    profileQuery.refetch()
  }

  const handleSave = async () => {
    isSaving.value = true
    try {
      const updateData: Partial<User> = {}
      if (form.name.trim()) updateData.name = form.name.trim()
      if (form.description.trim()) updateData.description = form.description.trim()
      await updateProfile.mutateAsync(updateData)
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
