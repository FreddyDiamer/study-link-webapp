<script setup lang="ts">
import { RouterView } from 'vue-router'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import BottomNav from '@/shared/components/layout/BottomNav.vue'
import DevLogin from '@/features/auth/DevLogin.vue'
import { AppToast } from '@/shared/components/ui'
import { useAuthStore, useEducationStore } from '@/stores'
import { AUTH_EXPIRED_EVENT, MOCK_INIT_DATA } from './shared/constants'

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

// 401 от API: сбрасываем сессию и один раз пробуем войти заново по initData;
// если и это не удалось — показываем экран «откройте в Telegram» вместо цикла перезагрузок
const sessionExpired = ref(false)
let reloginAttempted = false
const handleAuthExpired = async () => {
  authStore.clearAuth()
  if (reloginAttempted) {
    sessionExpired.value = true
    return
  }
  reloginAttempted = true
  await initializeApp()
  if (!authStore.isAuthenticated) sessionExpired.value = true
}

const handleRetryLogin = async () => {
  sessionExpired.value = false
  await initializeApp()
  if (!authStore.isAuthenticated) sessionExpired.value = true
}

onMounted(() => {
  window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired)
  initializeApp()
})
onBeforeUnmount(() => window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired))
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
      <RouterView v-else-if="isAuthed" v-slot="{ Component: Page }">
        <Transition name="route" mode="out-in">
          <component :is="Page" />
        </Transition>
      </RouterView>

      <!-- сессия истекла -->
      <div
        v-else-if="sessionExpired"
        class="flex flex-col items-center justify-center h-full px-8 text-center gap-4"
      >
        <p class="text-subhead text-d-text-second">Сессия истекла. Войдите заново.</p>
        <button
          type="button"
          class="press h-11 px-6 rounded-[13px] bg-d-accent text-d-ink text-subhead font-bold"
          @click="handleRetryLogin"
        >
          Войти снова
        </button>
      </div>

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
