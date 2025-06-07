import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { telegramService } from '@/services/integrations/telegram'

export const useTelegramStore = defineStore('telegram', () => {
  const isInitialized = ref(false)

  // Computed properties для реактивности
  const webApp = computed(() => telegramService.getWebApp())
  const user = computed(() => telegramService.getUser())
  const userId = computed(() => user.value?.id)
  const username = computed(() => user.value?.username)
  const firstName = computed(() => user.value?.first_name)
  const lastName = computed(() => user.value?.last_name)
  const initData = computed(() => telegramService.getInitData())

  // Инициализация
  const init = async () => {
    const success = await telegramService.init()
    isInitialized.value = success
    return success
  }

  // Proxy методы для удобства (делегируем в сервис)
  const showMainButton = (text: string, callback: () => void) => {
    telegramService.showMainButton(text, callback)
  }

  const hideMainButton = () => {
    telegramService.hideMainButton()
  }

  const showBackButton = (callback: () => void) => {
    telegramService.showBackButton(callback)
  }

  const hideBackButton = () => {
    telegramService.hideBackButton()
  }

  const showAlert = (message: string) => {
    telegramService.showAlert(message)
  }

  const showConfirm = (message: string): Promise<boolean> => {
    return telegramService.showConfirm(message)
  }

  const hapticFeedback = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning') => {
    telegramService.hapticFeedback(type)
  }

  const close = () => {
    telegramService.close()
  }

  return {
    // State
    isInitialized,

    // Computed (reactive)
    webApp,
    user,
    userId,
    username,
    firstName,
    lastName,
    initData,

    // Methods
    init,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    showAlert,
    showConfirm,
    hapticFeedback,
    close,
  }
})
