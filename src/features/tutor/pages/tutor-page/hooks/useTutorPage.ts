import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { useService } from '@/shared/composables'
import { PATHS } from '@/router/paths'
import type { Service } from '@/shared/types'

export function useTutorPage() {
  const router = useRouter()
  const telegramStore = useTelegramStore()
  const { getMyServices } = useService()
  const myServicesQuery = getMyServices()

  const searchQuery = ref('')
  const isLoading = myServicesQuery.isLoading
  const activeServices = computed(() => {
    const items = myServicesQuery.data.value?.items ?? []
    return items.filter((s: Service) => s.status === 'ACTIVE').slice(0, 3)
  })

  const quickActions = [
    {
      title: 'Добавить услугу',
      description: 'Создать новое предложение',
      icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
      color: 'bg-telegram-button',
      action: () => {
        telegramStore.hapticFeedback('light')
        router.push('/tutor/services/create')
      },
    },
    {
      title: 'Мои услуги',
      description: 'Управление предложениями',
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      color: 'bg-purple-500',
      action: () => {
        telegramStore.hapticFeedback('light')
        router.push('/tutor/services')
      },
    },
  ]

  const loadData = () => {
    myServicesQuery.refetch()
  }

  return { searchQuery, isLoading, activeServices, quickActions, loadData }
}
