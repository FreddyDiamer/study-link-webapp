import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { useUser, useTutor } from '@/shared/composables'
import { PATHS } from '@/router/paths'
import type { User } from '@/shared/types'
import type { StatItem } from '../models'

const DEFAULT_STATS: StatItem[] = [
  { label: 'Активных услуг', value: '0', icon: '📚' },
  { label: 'Заявок за месяц', value: '0', icon: '📋' },
  { label: 'Студентов', value: '0', icon: '👥' },
  { label: 'Рейтинг', value: '5.0', icon: '⭐' },
]

export function useTutorProfile() {
  const router = useRouter()
  const telegramStore = useTelegramStore()
  const { getProfile } = useUser()
  const { getTutorStats } = useTutor()
  const profileQuery = getProfile()
  const statsQuery = getTutorStats()

  const user = computed(() => (profileQuery.data.value as User | undefined) ?? null)
  const isLoading = computed(() => profileQuery.isLoading.value || statsQuery.isLoading.value)
  const stats = computed<StatItem[]>(() => {
    const s = statsQuery.data.value
    if (!s) return DEFAULT_STATS
    return [
      { label: 'Активных услуг', value: s.activeServices.toString(), icon: '📚' },
      { label: 'Заявок за месяц', value: s.monthlyRequests.toString(), icon: '📋' },
      { label: 'Студентов', value: s.totalStudents.toString(), icon: '👥' },
      { label: 'Рейтинг', value: s.averageRating.toFixed(1), icon: '⭐' },
    ]
  })

  const loadProfile = () => {
    profileQuery.refetch()
    statsQuery.refetch()
  }

  const editProfile = () => {
    router.push(PATHS.TUTOR_EDIT_PROFILE)
  }

  const openFeedback = () => {
    telegramStore.hapticFeedback('light')
    const supportBot = 'StudyLinkSupport'
    window.open(`https://t.me/${supportBot}`, '_blank')
  }

  const openSupport = () => {
    telegramStore.hapticFeedback('light')
    const supportBot = 'StudyLinkSupport'
    window.open(`https://t.me/${supportBot}`, '_blank')
  }

  return {
    user,
    isLoading,
    stats,
    loadProfile,
    editProfile,
    openFeedback,
    openSupport,
    telegramStore,
  }
}
