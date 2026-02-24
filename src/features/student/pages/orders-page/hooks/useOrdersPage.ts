import { ref, computed, onMounted } from 'vue'
import { useTelegramStore } from '@/stores/telegram'
import { useOrder } from '@/shared/composables'
import type { TabType } from '../models'

export function useOrdersPage() {
  const telegramStore = useTelegramStore()
  const {
    getMyRequests,
    getMyServiceResponses,
    getMyStudentDeals,
  } = useOrder()

  const myRequestsQuery = getMyRequests()
  const myServiceResponsesQuery = getMyServiceResponses()
  const myStudentDealsQuery = getMyStudentDeals()

  const requests = computed(() => myRequestsQuery.data.value ?? null)
  const serviceResponses = computed(() => myServiceResponsesQuery.data.value ?? null)
  const dealsRaw = computed(() => myStudentDealsQuery.data.value ?? null)

  const activeDeals = computed(() => {
    const data = dealsRaw.value
    const items = (data?.items ?? []).filter((d) => d.status !== 'COMPLETED')
    return data ? { ...data, items, total: items.length } : { items: [], total: 0 }
  })
  const completedDeals = computed(() => {
    const data = dealsRaw.value
    const items = (data?.items ?? []).filter((d) => d.status === 'COMPLETED')
    return data ? { ...data, items, total: items.length } : { items: [], total: 0 }
  })

  const currentTab = ref<TabType>('requests')
  const isLoading = computed(
    () =>
      myRequestsQuery.isLoading.value ||
      myServiceResponsesQuery.isLoading.value ||
      myStudentDealsQuery.isLoading.value,
  )

  const switchTab = async (tabId: TabType) => {
    telegramStore.hapticFeedback('light')
    currentTab.value = tabId
    await loadTabData(tabId)
  }

  const loadTabData = async (tabId: TabType) => {
    try {
      switch (tabId) {
        case 'requests':
          await myRequestsQuery.refetch()
          break
        case 'responses':
          await myServiceResponsesQuery.refetch()
          break
        case 'deals':
        case 'deals-completed':
          await myStudentDealsQuery.refetch()
          break
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error)
    }
  }

  onMounted(async () => {
    await loadTabData(currentTab.value)
  })

  return {
    currentTab,
    isLoading,
    requests,
    serviceResponses,
    activeDeals,
    completedDeals,
    switchTab,
  }
}
