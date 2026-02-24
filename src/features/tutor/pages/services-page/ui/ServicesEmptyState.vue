<script setup lang="ts">
defineEmits<{
  create: []
}>()
</script>

<template>
  <div class="text-center py-16">
    <div
      class="w-24 h-24 bg-gradient-to-br from-telegram-accent/20 to-telegram-accent/10 rounded-full mx-auto mb-4 flex items-center justify-center"
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
    <p class="text-telegram-textSecondary mb-0 max-w-md mx-auto leading-relaxed">
      Добавьте описания ваших услуг репетиторства с указанием предметов, стоимости и условий.
      Студенты смогут найти и выбрать подходящие занятия.
    </p>
    <div
      class="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full bg-telegram-accent/10 border border-telegram-accent/40 shadow-sm mx-auto mb-6 cursor-pointer hover:bg-telegram-accent/20 hover:border-telegram-accent/70 transition-all duration-200 backdrop-blur-sm"
      @click="$emit('create')"
    >
      <div
        class="w-7 h-7 rounded-full bg-telegram-accent flex items-center justify-center text-white shadow-md"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <div class="text-left">
        <div class="text-sm font-semibold text-telegram-accent">Создать услугу</div>
      </div>
    </div>
  </div>
</template>
