import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore, useAuthStore, useTelegramStore } from '@/stores'
import { useEducation } from '@/shared/composables'
import { PATHS } from '@/router/paths'

export function useStudentPage() {
  const router = useRouter()
  const telegramStore = useTelegramStore()
  const appStore = useAppStore()
  const authStore = useAuthStore()

  const {
    activeSubjects,
    isLoading: educationLoading,
    error: educationError,
    isInitialized,
    initialize,
  } = useEducation()

  const searchQuery = ref('')

  const mySubjects = computed(() =>
    activeSubjects.value.map((subject) => ({
      id: subject.id,
      name: subject.name,
      tutorsCount: Math.floor(Math.random() * 30) + 10,
      servicesCount: Math.floor(Math.random() * 50) + 20,
      lastActivity: getRandomDate(),
      averagePrice: Math.floor(Math.random() * 1000) + 1500,
      isActive: subject.isActive,
    })),
  )

  function getRandomDate(): string | null {
    const dates = ['2024-01-15', '2024-01-10', '2024-01-05', '2023-12-20', null]
    return dates[Math.floor(Math.random() * dates.length)]
  }

  function formatDate(dateString: string | null) {
    if (!dateString) return 'Никогда'
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Сегодня'
    if (diffDays === 1) return 'Вчера'
    if (diffDays < 7) return `${diffDays} дн. назад`
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
  }

  const search = () => {
    telegramStore.hapticFeedback('light')
    const searchValue = searchQuery.value.trim()
    router.push({
      path: PATHS.STUDENT_SERVICES,
      query: searchValue ? { search: searchValue } : {},
    })
  }

  const findTutorsForSubject = (subject: { name: string }) => {
    telegramStore.hapticFeedback('medium')
    router.push({ path: '/student/tutors', query: { subject: subject.name } })
  }

  const createOrder = () => {
    telegramStore.hapticFeedback('light')
    router.push('/student/orders/create')
  }

  const viewOrders = () => {
    telegramStore.hapticFeedback('light')
    router.push('/student/orders')
  }

  onMounted(async () => {
    if (!isInitialized.value) await initialize()
  })

  return {
    searchQuery,
    mySubjects,
    educationLoading,
    educationError,
    initialize,
    formatDate,
    search,
    findTutorsForSubject,
    createOrder,
    viewOrders,
    appStore,
    authStore,
  }
}
