<script setup lang="ts">
import { RouterView } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import BottomNav from '@/shared/components/layout/BottomNav.vue'
import DevLogin from '@/features/auth/DevLogin.vue'
import { AppToast } from '@/shared/components/ui'
import { useAuthStore, useEducationStore } from '@/stores'
import { MOCK_INIT_DATA } from './shared/constants'

const authStore = useAuthStore()
const educationStore = useEducationStore()

const ready = ref(false)
const isDev = import.meta.env.DEV
const isAuthed = computed(() => authStore.isAuthenticated)

const initEducation = () => {
  educationStore.initialize().catch((e) => console.error('Education init:', e))
}

const initializeApp = async () => {
  try {
    const initData = window.Telegram?.WebApp?.initData || MOCK_INIT_DATA
    if (initData) {
      // запуск внутри Telegram (или с mock initData)
      const { authService } = await import('@/services/business')
      await authService.loginWithTelegram(initData)
    } else {
      // веб: подхватываем сохранённую сессию (dev-логин и т.п.)
      authStore.initializeAuth()
    }
    if (authStore.isAuthenticated) initEducation()
  } catch (error) {
    console.error('Ошибка инициализации приложения:', error)
  } finally {
    ready.value = true
  }
}

const onDevAuthed = () => {
  initEducation()
}

onMounted(initializeApp)
</script>

<template>
  <div class="h-screen bg-d-ink text-d-text font-sl flex flex-col overflow-hidden">
    <main class="relative flex-1 min-h-0">
      <AppToast />

      <!-- загрузка -->
      <div v-if="!ready" class="flex items-center justify-center h-full">
        <span
          class="w-7 h-7 rounded-full border-2 border-d-border-soft border-t-d-accent animate-d-spin"
        />
      </div>

      <!-- приложение -->
      <RouterView v-else-if="isAuthed" />

      <!-- веб-вход (только дев-окружение) -->
      <DevLogin v-else-if="isDev" @authed="onDevAuthed" />

      <!-- прод вне Telegram -->
      <div v-else class="flex items-center justify-center h-full px-8 text-center">
        <p class="text-subhead text-d-text-second">Откройте приложение в Telegram</p>
      </div>
    </main>

    <BottomNav v-if="isAuthed" />
  </div>
</template>
