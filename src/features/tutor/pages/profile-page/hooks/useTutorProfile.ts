import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { userService } from '@/services/business/user'
import { useTutor } from '@/shared/composables'
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
  const { getTutorStats } = useTutor()

  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const stats = ref<StatItem[]>(DEFAULT_STATS)

  const loadProfile = async () => {
    isLoading.value = true
    try {
      user.value = await userService.getProfile()
      const tutorStats = await getTutorStats()
      stats.value = [
        { label: 'Активных услуг', value: tutorStats.activeServices.toString(), icon: '📚' },
        { label: 'Заявок за месяц', value: tutorStats.monthlyRequests.toString(), icon: '📋' },
        { label: 'Студентов', value: tutorStats.totalStudents.toString(), icon: '👥' },
        { label: 'Рейтинг', value: tutorStats.averageRating.toFixed(1), icon: '⭐' },
      ]
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error)
    } finally {
      isLoading.value = false
    }
  }

  const editProfile = () => {
    router.push(PATHS.TUTOR_EDIT_PROFILE)
  }

  const openFeedback = () => {
    console.log('Открыть форму обратной связи')
  }

  const openSupport = () => {
    console.log('Открытие поддержки')
  }

  onMounted(() => {
    loadProfile()
  })

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
