/// <reference types="@types/telegram-web-app" />

class TelegramService {
  private webapp: typeof window.Telegram.WebApp | null = null

  async init(): Promise<boolean> {
    if (typeof window === 'undefined') return false

    // Проверяем, запущено ли приложение в Telegram
    const isTelegramWebApp =
      window.Telegram?.WebApp &&
      window.Telegram.WebApp.initData &&
      window.Telegram.WebApp.initDataUnsafe?.user

    if (!isTelegramWebApp) {
      console.warn('Telegram WebApp not available - running in browser mode')
      return false
    }

    // Wait for Telegram WebApp to load
    for (let i = 0; i < 100; i++) {
      if (window.Telegram?.WebApp) {
        break
      }
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    if (!window.Telegram?.WebApp) {
      console.warn('Telegram WebApp not available')
      return false
    }

    this.webapp = window.Telegram.WebApp
    this.webapp.ready()

    this.configurate()

    console.log('Telegram WebApp initialized', {
      version: this.webapp.version,
      user: this.getUser(),
    })

    return true
  }

  private configurate() {
    if (!this.webapp) return

    this.webapp.expand()
    this.webapp.enableClosingConfirmation()
    this.webapp.disableVerticalSwipes()
  }

  // Getters
  getWebApp() {
    return this.webapp
  }

  getUser(): WebAppUser | null {
    return this.webapp?.initDataUnsafe?.user || null
  }

  getInitData(): string {
    return this.webapp?.initData || ''
  }

  isReady(): boolean {
    return !!this.webapp
  }

  // Main Button
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

  // Back Button
  showBackButton(callback: () => void) {
    if (!this.webapp) return
    this.webapp.BackButton.onClick(callback)
    this.webapp.BackButton.show()
  }

  hideBackButton() {
    if (!this.webapp) return
    this.webapp.BackButton.hide()
  }

  // UI Methods
  showAlert(message: string) {
    // вне Telegram (веб-дев) мостика нет — иначе ошибка молча пропадала бы
    if (!this.webapp) {
      window.alert(message)
      return
    }
    this.webapp.showAlert(message)
  }

  showConfirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.webapp?.showConfirm(message, resolve)
    })
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
    this.webapp?.close()
  }
}

export const telegramService = new TelegramService()
