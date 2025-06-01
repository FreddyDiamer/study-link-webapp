import { ref, computed, onMounted } from 'vue'
import { telegramService } from '@/services/integrations/telegram'

export const useTelegram = () => {
  const isReady = ref(false)

  const init = () => {
    telegramService.init()
    isReady.value = telegramService.isReady()
  }

  onMounted(() => {
    init()
  })

  return {
    // Состояние
    isReady: computed(() => telegramService.isReady()),
    user: computed(() => telegramService.getUser()),
    initData: computed(() => telegramService.getInitData()),

    // Методы кнопок
    showMainButton: telegramService.showMainButton.bind(telegramService),
    hideMainButton: telegramService.hideMainButton.bind(telegramService),
    showBackButton: telegramService.showBackButton.bind(telegramService),
    hideBackButton: telegramService.hideBackButton.bind(telegramService),

    // Утилиты
    hapticFeedback: telegramService.hapticFeedback.bind(telegramService),
    close: telegramService.close.bind(telegramService),
  }
}
