<script setup lang="ts">
import { RouterView } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import BottomNav from '@/shared/components/layout/BottomNav.vue'
import DevLogin from '@/features/auth/DevLogin.vue'
import { AppToast, LoadError } from '@/shared/components/ui'
import { useAuthStore, useEducationStore } from '@/stores'
import { MOCK_INIT_DATA } from './shared/constants'

const authStore = useAuthStore()
const educationStore = useEducationStore()

// экраны-списки живут между переходами: возврат «назад» и смена таба не теряют позицию
const KEPT_PAGES = ['MarketPage', 'DealsPage', 'ProfilePage', 'MyResponsesPage']

const ready = ref(false)
// вход по initData не удался: пользователь в Telegram, звать его «открыть в Telegram» — ложь
const loginFailed = ref(false)
const isDev = import.meta.env.DEV
const isAuthed = computed(() => authStore.isAuthenticated)

const initEducation = () => {
  educationStore.initialize().catch((e) => console.error('Education init:', e))
}

const initializeApp = async () => {
  try {
    const telegramInitData = window.Telegram?.WebApp?.initData
    if (telegramInitData) {
      // внутри Telegram личность задаёт сам Telegram — при каждом запуске
      const { authService } = await import('@/services/business')
      try {
        await authService.loginWithTelegram(telegramInitData)
      } catch (error) {
        loginFailed.value = true
        throw error
      }
      return
    }

    // веб: сессия переживает перезагрузку, как у настоящего пользователя
    authStore.initializeAuth()
    // мок-initData — только в дев-сборке (в проде он открыл бы вход любому браузеру) и только
    // без сохранённой сессии: иначе он перебивал бы пользователя, выбранного на DevLogin
    if (!authStore.isAuthenticated && isDev && MOCK_INIT_DATA) {
      const { authService } = await import('@/services/business')
      await authService.loginWithTelegram(MOCK_INIT_DATA)
    }
  } catch (error) {
    console.error('Ошибка инициализации приложения:', error)
  } finally {
    ready.value = true
  }
}

// справочник нужен любому вошедшему, каким бы путём он ни вошёл: Telegram, сохранённая
// сессия или дев-вход. Событием из DevLogin это не сделать — вход размонтирует его раньше,
// чем он успеет что-то отправить, а emit размонтированного компонента молча теряется
watch(isAuthed, (authed) => authed && initEducation(), { immediate: true })

const retryLogin = () => {
  loginFailed.value = false
  ready.value = false
  initializeApp()
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
      <RouterView v-else-if="isAuthed" v-slot="{ Component: Page }">
        <Transition name="route" mode="out-in">
          <KeepAlive :include="KEPT_PAGES">
            <component :is="Page" />
          </KeepAlive>
        </Transition>
      </RouterView>

      <!-- Telegram не пустил: бэкенд недоступен или отверг initData — даём повторить -->
      <LoadError
        v-else-if="loginFailed"
        title="Не получилось войти"
        text="Заявки и сделки на месте — до них не дошёл ответ сервера. Проверьте соединение и попробуйте ещё раз."
        @retry="retryLogin"
      />

      <!-- веб-вход (только дев-окружение) -->
      <DevLogin v-else-if="isDev" />

      <!-- прод вне Telegram -->
      <div v-else class="flex items-center justify-center h-full px-8 text-center">
        <p class="text-subhead text-d-text-second">Откройте приложение в Telegram</p>
      </div>
    </main>

    <BottomNav v-if="isAuthed" />
  </div>
</template>
