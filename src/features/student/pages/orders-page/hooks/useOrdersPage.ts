import { ref, onMounted } from 'vue'
import { useTelegramStore } from '@/stores/telegram'
import { useOrder } from '@/shared/composables'
import type { TabType } from '../models'

export function useOrdersPage() {
  const telegramStore = useTelegramStore()
  const {
    requests,
    serviceResponses,
    deals,
    getMyRequests,
    getMyServiceResponses,
    getMyStudentDeals,
  } = useOrder()

  const currentTab = ref<TabType>('requests')
  const isLoading = ref(false)

  const switchTab = async (tabId: TabType) => {
    telegramStore.hapticFeedback('light')
    currentTab.value = tabId
    await loadTabData(tabId)
  }

  const loadTabData = async (tabId: TabType) => {
    isLoading.value = true
    try {
      switch (tabId) {
        case 'requests':
          await getMyRequests()
          break
        case 'responses':
          await getMyServiceResponses()
          break
        case 'deals':
          await getMyStudentDeals()
          break
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error)
    } finally {
      isLoading.value = false
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
    deals,
    switchTab,
  }
}
