<script setup lang="ts">
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-telegram-text mb-2">Избранное</h1>
      <p class="text-telegram-textSecondary">Репетиторы, которых вы добавили в избранное</p>
    </div>

    <!-- Empty state -->
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
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </div>

      <h2 class="text-xl font-semibold text-telegram-text mb-3">Пока пусто</h2>

      <p class="text-telegram-textSecondary mb-8 max-w-sm mx-auto">
        Найдите репетиторов и добавьте понравившихся в избранное для быстрого доступа
      </p>

      <Button class="mx-auto"> Найти репетиторов </Button>
    </div>
  </div>
</template>
