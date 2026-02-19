<script setup lang="ts">
import type { ResponseTabId } from '../models'

defineProps<{
  activeTab: ResponseTabId
}>()
</script>

<template>
  <div class="text-center py-16">
    <div
      class="w-20 h-20 bg-telegram-secondary rounded-full mx-auto mb-6 flex items-center justify-center"
    >
      <svg
        class="w-10 h-10 text-telegram-textSecondary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
    </div>
    <h2 class="text-xl font-semibold text-telegram-text mb-3">
      {{
        activeTab === 'new'
          ? 'Пока нет новых откликов'
          : activeTab === 'active'
            ? 'Нет активных откликов'
            : 'Нет завершенных откликов'
      }}
    </h2>
    <p class="text-telegram-textSecondary max-w-sm mx-auto">
      {{
        activeTab === 'new'
          ? 'Когда ученики начнут откликаться на вашу услугу, они появятся здесь'
          : activeTab === 'active'
            ? 'Принятые отклики будут отображаться в этом разделе'
            : 'Завершенные уроки с учениками будут показаны здесь'
      }}
    </p>
  </div>
</template>
