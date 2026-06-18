<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, ref } from 'vue'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import BottomNav from '@/shared/components/layout/BottomNav.vue'
import { useAppStore, useEducationStore } from '@/stores'
import { MOCK_INIT_DATA } from './shared/constants'

const appStore = useAppStore()
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
  initializeApp()
})
</script>

<template>
  <div
    class="min-h-screen bg-d-ink text-d-text font-sl flex flex-col"
    :class="{
      'flow-student': appStore.isStudentFlow,
      'flow-tutor': appStore.isTutorFlow,
    }"
  >
    <AppHeader />

    <main class="flex-1 overflow-auto pt-14">
      <RouterView />
    </main>

    <BottomNav />
  </div>
</template>
