<script setup lang="ts">
import { TABS } from '../models'
import type { TutorServicesTab } from '../models'

defineProps<{
  activeTab: TutorServicesTab
}>()

const emit = defineEmits<{
  'update:activeTab': [value: TutorServicesTab]
}>()
</script>

<template>
  <div class="flex bg-telegram-secondary rounded-xl p-1 mb-6">
    <button
      v-for="tab in TABS"
      :key="tab.id"
      type="button"
      @click="emit('update:activeTab', tab.id)"
      :class="[
        'flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200',
        activeTab === tab.id
          ? 'bg-telegram-card text-telegram-text shadow-sm'
          : 'text-telegram-textSecondary hover:text-telegram-text',
      ]"
    >
      <span class="text-base">{{ tab.icon }}</span>
      <span>{{ tab.label }}</span>
    </button>
  </div>
</template>
