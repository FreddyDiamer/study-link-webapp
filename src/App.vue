<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useTelegramStore } from '@/stores/telegram'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import BottomNav from '@/shared/components/layout/BottomNav.vue'

const telegramStore = useTelegramStore()

onMounted(() => {
  telegramStore.initWebApp()
})
</script>

<template>
  <div class="min-h-screen bg-telegram-bg text-telegram-text flex flex-col">
    <AppHeader />

    <main class="flex-1 overflow-auto pt-14">
      <RouterView />
    </main>

    <BottomNav />
  </div>
</template>

<style>
html {
  font-size: 16px;
}

body {
  margin: 0;
  padding: 0;
  font-family:
    'Inter',
    'SF Pro Display',
    -apple-system,
    BlinkMacSystemFont,
    system-ui,
    sans-serif;
  background-color: #17212b;
  color: #ffffff;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

/* Hide scrollbars */
::-webkit-scrollbar {
  display: none;
}

html {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
