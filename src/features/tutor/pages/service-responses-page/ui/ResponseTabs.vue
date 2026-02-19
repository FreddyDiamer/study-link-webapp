<script setup lang="ts">
import type { ResponseTabId } from '../models'
import { RESPONSE_TABS } from '../models'

defineProps<{
  activeTab: ResponseTabId
  pendingCount: number
  activeCount: number
  completedCount: number
}>()

const emit = defineEmits<{
  'update:activeTab': [value: ResponseTabId]
}>()

function getCount(id: ResponseTabId, pending: number, active: number, completed: number): number {
  if (id === 'new') return pending
  if (id === 'active') return active
  return completed
}
</script>

<template>
  <div class="flex space-x-1 mb-6 bg-telegram-secondary rounded-lg p-1">
    <button
      v-for="tab in RESPONSE_TABS"
      :key="tab.id"
      type="button"
      @click="emit('update:activeTab', tab.id)"
      :class="[
        'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
        activeTab === tab.id
          ? 'bg-telegram-accent text-white shadow-sm'
          : 'text-telegram-textSecondary hover:text-telegram-text',
      ]"
    >
      {{ tab.label }}
      <span
        v-if="getCount(tab.id, pendingCount, activeCount, completedCount) > 0"
        class="ml-2 px-2 py-0.5 rounded-full text-xs"
        :class="activeTab === tab.id ? 'bg-white/20' : 'bg-telegram-accent text-white'"
      >
        {{ getCount(tab.id, pendingCount, activeCount, completedCount) }}
      </span>
    </button>
  </div>
</template>
