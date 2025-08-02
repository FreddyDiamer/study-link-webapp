import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export type UserFlow = 'student' | 'tutor'

export const useAppStore = defineStore('app', () => {
  const currentFlow = useLocalStorage<UserFlow | null>('currentFlow', null)

  const isAuthenticated = ref(false)

  const showGroupCard = useLocalStorage<boolean>('showGroupCard', true)

  const setFlow = (flow: UserFlow) => {
    currentFlow.value = flow
  }

  const clearFlow = () => {
    currentFlow.value = null
  }

  const isStudentFlow = computed(() => currentFlow.value === 'student')
  const isTutorFlow = computed(() => currentFlow.value === 'tutor')

  return {
    currentFlow,
    isAuthenticated,
    showGroupCard,
    setFlow,
    clearFlow,
    isStudentFlow,
    isTutorFlow,
  }
})
