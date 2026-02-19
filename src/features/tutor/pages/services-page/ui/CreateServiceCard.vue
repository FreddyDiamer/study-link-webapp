<script setup lang="ts">
import Card from '@/shared/components/ui/Card.vue'

defineEmits<{
  click: []
}>()
</script>

<template>
  <Card
    class="p-4 cursor-pointer hover:bg-telegram-accent/5 transition-colors border-2 border-dashed border-telegram-accent/30 hover:border-telegram-accent/50"
    @click="$emit('click')"
  >
    <div class="flex items-center space-x-4">
      <div
        class="w-10 h-10 bg-telegram-accent/10 rounded-full flex items-center justify-center flex-shrink-0"
      >
        <svg class="w-5 h-5 text-telegram-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <div>
        <h3 class="text-base font-semibold text-telegram-accent">Добавить услугу</h3>
        <p class="text-telegram-textSecondary text-sm">Создайте новую услугу для студентов</p>
      </div>
    </div>
  </Card>
</template>
