import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { useAppStore, type UserFlow } from '@/stores/app'

export function useWelcome() {
  const router = useRouter()
  const telegramStore = useTelegramStore()
  const appStore = useAppStore()
  const isLoaded = ref(false)

  onMounted(() => {
    setTimeout(() => {
      isLoaded.value = true
    }, 100)
  })

  const selectRole = (flow: UserFlow) => {
    telegramStore.hapticFeedback('light')
    appStore.setFlow(flow)
    if (flow === 'student') {
      router.push('/student')
    } else {
      router.push('/tutor')
    }
  }

  return { isLoaded, selectRole }
}
