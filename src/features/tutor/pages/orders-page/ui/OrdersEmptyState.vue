<script setup lang="ts">
import Button from '@/shared/components/ui/Button.vue'

defineEmits<{
  resetFilters: []
}>()
</script>

<template>
  <div class="text-center py-12">
    <div
      class="w-16 h-16 bg-telegram-secondary rounded-full mx-auto mb-4 flex items-center justify-center"
    >
      <svg
        class="w-8 h-8 text-telegram-textSecondary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    </div>
    <h3 class="text-telegram-text font-semibold mb-2">Заказы не найдены</h3>
    <p class="text-telegram-textSecondary mb-4">Попробуйте изменить параметры поиска</p>
    <Button @click="$emit('resetFilters')" variant="secondary">Сбросить фильтры</Button>
  </div>
</template>
