import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTelegramStore = defineStore('telegram', () => {
  const webApp = ref<any>(null)
  const isInitialized = ref(false)

  const user = computed(() => webApp.value?.initDataUnsafe?.user)
  const userId = computed(() => user.value?.id)
  const username = computed(() => user.value?.username)
  const firstName = computed(() => user.value?.first_name)
  const lastName = computed(() => user.value?.last_name)

  const initWebApp = () => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      webApp.value = (window as any).Telegram.WebApp
      webApp.value.ready()
      webApp.value.expand()
      isInitialized.value = true
    }
  }

  const showAlert = (message: string) => {
    webApp.value?.showAlert(message)
  }

  const showConfirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      webApp.value?.showConfirm(message, resolve)
    })
  }

  const hapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    webApp.value?.HapticFeedback?.impactOccurred(type)
  }

  const close = () => {
    webApp.value?.close()
  }

  return {
    webApp,
    isInitialized,
    user,
    userId,
    username,
    firstName,
    lastName,
    initWebApp,
    showAlert,
    showConfirm,
    hapticFeedback,
    close,
  }
})
