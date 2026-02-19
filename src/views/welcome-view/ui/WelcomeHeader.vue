<script setup lang="ts">
defineProps<{
  isLoaded: boolean
}>()
</script>

<template>
  <div
    class="bg-gradient-to-br from-telegram-accent to-telegram-button px-4 pt-8 pb-12 text-center"
  >
    <div
      class="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl mx-auto mb-6 flex items-center justify-center transition-all duration-700"
      :class="{ 'animate-bounce-subtle': isLoaded }"
    >
      <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
        />
      </svg>
    </div>

    <h1
      class="text-3xl font-bold text-white mb-3 transition-all duration-500"
      :class="{ 'animate-fade-in': isLoaded }"
    >
      Добро пожаловать!
    </h1>

    <p
      class="text-white/90 text-lg leading-relaxed max-w-xs mx-auto mb-8 transition-all duration-700 delay-200"
      :class="{ 'animate-slide-up': isLoaded }"
    >
      Выберите вашу роль чтобы начать пользоваться приложением
    </p>

    <slot />
  </div>
</template>
