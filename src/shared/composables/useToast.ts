import { readonly, ref } from 'vue'

/**
 * Тост как в макете: всплывает поверх экрана, живёт ~2 секунды и гаснет.
 * Состояние модульное — очередь одна на приложение, тост рисует <AppToast> в App.vue.
 */
const message = ref('')
let hideTimer: ReturnType<typeof setTimeout> | undefined

export const useToast = () => {
  const showToast = (text: string, duration = 2000) => {
    message.value = text
    clearTimeout(hideTimer)
    hideTimer = setTimeout(() => {
      message.value = ''
    }, duration)
  }

  const hideToast = () => {
    clearTimeout(hideTimer)
    message.value = ''
  }

  return {
    // State
    message: readonly(message),

    // Methods
    showToast,
    hideToast,
  }
}
