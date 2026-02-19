<script setup lang="ts">
import { Button } from '@/shared/components/ui'
import { ResponseCard, ResponseTabs, ResponsesEmptyState } from './ui'
import { useServiceResponses } from './hooks'

const {
  activeTab,
  service,
  filteredResponses,
  pendingCount,
  activeCount,
  completedCount,
  goBack,
  acceptResponse,
  rejectResponse,
  contactStudent,
  completeLessons,
} = useServiceResponses()
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <div class="flex items-center mb-6">
      <Button variant="ghost" @click="goBack" class="p-2 -ml-2 rounded-lg mr-3">
        <svg class="w-5 h-5 text-telegram-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </Button>
      <div class="flex-1">
        <h1 class="text-xl font-bold text-telegram-text mb-1">
          {{ service.subject.name }} • {{ service.teacher.fullName }}
        </h1>
        <p class="text-telegram-textSecondary text-sm">
          {{ service.description }} • {{ service.price }}₽
        </p>
      </div>
    </div>

    <ResponseTabs
      v-model:activeTab="activeTab"
      :pending-count="pendingCount"
      :active-count="activeCount"
      :completed-count="completedCount"
    />

    <div v-if="filteredResponses.length > 0" class="space-y-4">
      <ResponseCard
        v-for="response in filteredResponses"
        :key="response.id"
        :response="response"
        @accept="acceptResponse"
        @reject="rejectResponse"
        @contact="contactStudent"
        @complete="completeLessons"
      />
    </div>

    <ResponsesEmptyState v-else :active-tab="activeTab" />
  </div>
</template>
