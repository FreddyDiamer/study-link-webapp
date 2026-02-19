<script setup lang="ts">
import Card from '@/shared/components/ui/Card.vue'

defineProps<{
  isLoaded: boolean
}>()
</script>

<template>
  <Card
    class="p-6 bg-telegram-card border border-telegram-border shadow-telegram transition-all duration-700 delay-500"
    :class="{ 'animate-slide-up': isLoaded }"
  >
    <h3 class="text-lg font-semibold text-telegram-text mb-4 text-center">
      Почему выбирают нас?
    </h3>

    <div class="space-y-4">
      <div class="flex items-start space-x-3">
        <div
          class="w-6 h-6 bg-telegram-success rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        >
          <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div>
          <p class="text-telegram-text font-medium text-sm">Знание требований преподавателей</p>
          <p class="text-telegram-textSecondary text-xs mt-1">
            Репетиторы знают специфику конкретных преподавателей
          </p>
        </div>
      </div>

      <div class="flex items-start space-x-3">
        <div
          class="w-6 h-6 bg-telegram-success rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        >
          <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div>
          <p class="text-telegram-text font-medium text-sm">Быстрый поиск</p>
          <p class="text-telegram-textSecondary text-xs mt-1">
            Найди репетитора по предмету и преподавателю за минуты
          </p>
        </div>
      </div>

      <div class="flex items-start space-x-3">
        <div
          class="w-6 h-6 bg-telegram-success rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        >
          <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div>
          <p class="text-telegram-text font-medium text-sm">Безопасные платежи</p>
          <p class="text-telegram-textSecondary text-xs mt-1">
            Все транзакции проходят через защищенную систему Telegram
          </p>
        </div>
      </div>
    </div>
  </Card>
</template>
