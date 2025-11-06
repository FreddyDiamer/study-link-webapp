<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTelegramStore } from '@/stores/telegram'
import { useOrder } from '@/shared/composables'
import RequestsList from '../components/RequestsList.vue'
import ResponsesList from '../components/ResponsesList.vue'
import DealsList from '../components/DealsList.vue'

const telegramStore = useTelegramStore()
const {
  requests,
  serviceResponses,
  deals,
  getMyRequests,
  getMyServiceResponses,
  getMyStudentDeals,
} = useOrder()

type TabType = 'requests' | 'responses' | 'deals'

const currentTab = ref<TabType>('requests')
const isLoading = ref(false)

const tabs = [
  { id: 'requests', label: 'Заявки', icon: '📋' },
  { id: 'responses', label: 'Отклики', icon: '📤' },
  { id: 'deals', label: 'Активные', icon: '🟢' },
] as const

const switchTab = async (tabId: TabType) => {
  telegramStore.hapticFeedback('light')
  currentTab.value = tabId

  // Загружаем данные при переключении табов
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
</script>

<template>
  <div class="min-h-screen bg-telegram-bg pt-6">
    <!-- Header -->
    <div class="px-4 mb-6">
      <h1 class="text-2xl font-bold text-telegram-text mb-2">Мои дела</h1>
      <p class="text-telegram-textSecondary">Заявки, отклики и активные уроки</p>
    </div>

    <!-- Tabs -->
    <div class="px-4 mb-6">
      <div class="flex bg-telegram-secondary rounded-xl p-1">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="switchTab(tab.id as TabType)"
          :class="[
            'flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200',
            currentTab === tab.id
              ? 'bg-telegram-card text-telegram-text shadow-sm'
              : 'text-telegram-textSecondary hover:text-telegram-text',
          ]"
        >
          <span class="text-base">{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="flex-1">
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-telegram-button"></div>
      </div>

      <RequestsList v-else-if="currentTab === 'requests'" :items="requests?.items || []" />
      <ResponsesList
        v-else-if="currentTab === 'responses'"
        :items="serviceResponses?.items || []"
      />
      <DealsList v-else-if="currentTab === 'deals'" :items="deals?.items || []" />
    </div>
  </div>
</template>
