<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, ref } from 'vue'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import BottomNav from '@/shared/components/layout/BottomNav.vue'
import DevPanel from '@/shared/components/dev/DevPanel.vue'
import { useAppStore, useAuthStore, useEducationStore } from '@/stores'
import { setupQueryCacheWatcher } from '@/shared/lib/query-client'
import ProfileQueryKeeper from '@/shared/components/ProfileQueryKeeper.vue'
import { MOCK_INIT_DATA } from './shared/constants'

const appStore = useAppStore()
const authStore = useAuthStore()
const educationStore = useEducationStore()

const loading = ref(true)

const initializeApp = async () => {
  loading.value = true

  try {
    // Инициализируем авторизацию и образовательные данные параллельно
    const { authService } = await import('@/services/business')

    const initData = window.Telegram?.WebApp?.initData || MOCK_INIT_DATA
    await authService.loginWithTelegram(initData)
    await educationStore.initialize()
  } catch (error) {
    console.error('Ошибка инициализации приложения:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Настраиваем отслеживание смены пользователя для очистки кэша Vue Query
  setupQueryCacheWatcher()
  initializeApp()
})
</script>

<template>
  <div
    class="min-h-screen bg-telegram-bg text-telegram-text flex flex-col"
    :class="{
      'flow-student': appStore.isStudentFlow,
      'flow-tutor': appStore.isTutorFlow,
    }"
  >
    <AppHeader />

    <!-- Держит запрос /users/me активным для автообновления по refetchInterval -->
    <ProfileQueryKeeper v-if="authStore.isAuthenticated" />

    <main class="flex-1 overflow-auto pt-14">
      <RouterView />
    </main>

    <BottomNav />

    <!-- Панель разработчика -->
    <DevPanel />
  </div>
</template>
