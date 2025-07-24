<script setup lang="ts">
import { ref } from 'vue'
import { useTelegramStore } from '@/stores/telegram'
import RequestsList from '../components/RequestsList.vue'
import ResponsesList from '../components/ResponsesList.vue'
import DealsList from '../components/DealsList.vue'

const telegramStore = useTelegramStore()

type TabType = 'requests' | 'responses' | 'deals'

const currentTab = ref<TabType>('requests')

const tabs = [
  { id: 'requests', label: 'Заявки', icon: '📋' },
  { id: 'responses', label: 'Отклики', icon: '📤' },
  { id: 'deals', label: 'Активные', icon: '🟢' },
] as const

const switchTab = (tabId: TabType) => {
  telegramStore.hapticFeedback('light')
  currentTab.value = tabId
}
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
      <RequestsList v-if="currentTab === 'requests'" />
      <ResponsesList v-if="currentTab === 'responses'" />
      <DealsList v-if="currentTab === 'deals'" />
    </div>
  </div>
</template>
