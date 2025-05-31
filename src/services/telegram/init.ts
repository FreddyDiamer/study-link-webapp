import { ref } from 'vue'
import type { TelegramUser } from '@/shared/types'
/// <reference types="@types/telegram-web-app" />

class TelegramService {
  private webapp: typeof window.Telegram.WebApp | null = null
  private isInitialized = ref(false)
  private user = ref<TelegramUser | null>(null)

  init() {
    if (typeof window === 'undefined') return

    // Проверяем наличие Telegram WebApp
    if (!window.Telegram?.WebApp) {
      console.warn('Telegram WebApp not available')
      return
    }

    this.webapp = window.Telegram.WebApp
    this.webapp.ready()
    this.webapp.expand()

    // Получаем пользователя
    if (this.webapp.initDataUnsafe?.user) {
      this.user.value = this.webapp.initDataUnsafe.user
    }

    this.isInitialized.value = true

    console.log('Telegram WebApp initialized', {
      version: this.webapp.version,
      user: this.user.value,
    })
  }

  getUser() {
    return this.user.value
  }

  isReady() {
    return this.isInitialized.value
  }

  showMainButton(text: string, callback: () => void) {
    if (!this.webapp) return

    this.webapp.MainButton.setText(text)
    this.webapp.MainButton.onClick(callback)
    this.webapp.MainButton.show()
  }

  hideMainButton() {
    if (!this.webapp) return
    this.webapp.MainButton.hide()
  }

  showBackButton(callback: () => void) {
    if (!this.webapp) return
    this.webapp.BackButton.onClick(callback)
    this.webapp.BackButton.show()
  }

  hideBackButton() {
    if (!this.webapp) return
    this.webapp.BackButton.hide()
  }

  hapticFeedback(type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning') {
    if (!this.webapp) return

    if (type === 'success' || type === 'error' || type === 'warning') {
      this.webapp.HapticFeedback.notificationOccurred(type)
    } else {
      this.webapp.HapticFeedback.impactOccurred(type)
    }
  }

  close() {
    if (!this.webapp) return
    this.webapp.close()
  }

  getInitData() {
    return this.webapp?.initData || ''
  }
}

export const telegramService = new TelegramService()
