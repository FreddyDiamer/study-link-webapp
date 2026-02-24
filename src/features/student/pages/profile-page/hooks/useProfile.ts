import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { useUser } from '@/shared/composables'
import { PATHS } from '@/router/paths'
import type { User } from '../models'

export function useProfile() {
  const router = useRouter()
  const telegramStore = useTelegramStore()
  const { getProfile } = useUser()
  const profileQuery = getProfile()

  const user = computed(() => (profileQuery.data.value as User | undefined) ?? null)
  const isLoading = profileQuery.isLoading

  const loadProfile = () => {
    profileQuery.refetch()
  }

  const editProfile = () => {
    router.push(PATHS.STUDENT_EDIT_PROFILE)
  }

  const openFeedback = () => {
    telegramStore.hapticFeedback('light')
    const supportBot = 'StudyLinkSupport'
    window.open(`https://t.me/${supportBot}`, '_blank')
  }

  return {
    user,
    isLoading,
    loadProfile,
    editProfile,
    openFeedback,
    telegramStore,
  }
}
