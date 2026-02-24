<script setup lang="ts">
import { RequestsList, ResponsesList, DealsList } from './ui'
import { useOrdersPage } from './hooks'
import { TABS } from './models'
import type { TabType } from './models'

const { currentTab, isLoading, requests, serviceResponses, activeDeals, completedDeals, switchTab } = useOrdersPage()
</script>

<template>
  <div class="min-h-screen bg-telegram-bg pt-6">
    <div class="px-4 mb-6">
      <h1 class="text-2xl font-bold text-telegram-text mb-2">Мои дела</h1>
      <p class="text-telegram-textSecondary">Заявки, отклики и активные уроки</p>
    </div>
    <div class="px-4 mb-6">
      <div class="flex bg-telegram-secondary rounded-xl p-1">
        <button
          v-for="tab in TABS"
          :key="tab.id"
          @click="switchTab(tab.id as TabType)"
          :class="[
            'flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200',
            currentTab === tab.id ? 'bg-telegram-card text-telegram-text shadow-sm' : 'text-telegram-textSecondary hover:text-telegram-text',
          ]"
        >
          <span class="text-base">{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
        </button>
      </div>
    </div>
    <div class="flex-1">
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-telegram-button"></div>
      </div>
      <template v-else>
        <RequestsList v-if="currentTab === 'requests'" :items="requests?.items ?? []" />
        <ResponsesList v-else-if="currentTab === 'responses'" :items="serviceResponses?.items ?? []" />
        <DealsList v-else-if="currentTab === 'deals'" :items="activeDeals?.items ?? []" />
        <DealsList v-else-if="currentTab === 'deals-completed'" :items="completedDeals?.items ?? []" />
      </template>
    </div>
  </div>
</template>
