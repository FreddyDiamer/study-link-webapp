<script setup lang="ts">
import Button from '@/shared/components/ui/Button.vue'

defineEmits<{
  create: []
}>()
</script>

<template>
  <div class="text-center py-16">
    <div
      class="w-24 h-24 bg-gradient-to-br from-telegram-accent/20 to-telegram-accent/10 rounded-full mx-auto mb-6 flex items-center justify-center"
    >
      <svg
        class="w-12 h-12 text-telegram-accent"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    </div>
    <h2 class="text-2xl font-bold text-telegram-text mb-3">Создайте свои услуги</h2>
    <p class="text-telegram-textSecondary mb-12 max-w-md mx-auto leading-relaxed">
      Добавьте описания ваших услуг репетиторства с указанием предметов, стоимости и условий.
      Студенты смогут найти и выбрать подходящие занятия.
    </p>
    <Button
      @click="$emit('create')"
      class="bg-gradient-to-r from-telegram-accent to-telegram-accent/80 hover:from-telegram-accent/90 hover:to-telegram-accent/70 text-white px-8 py-3 font-semibold rounded-xl shadow-lg"
    >
      <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Создать услугу
    </Button>
  </div>
</template>
