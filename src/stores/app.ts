import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type UserFlow = 'student' | 'tutor'

export const useAppStore = defineStore('app', () => {
  const currentFlow = ref<UserFlow | null>(null)
  const isAuthenticated = ref(false)

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
    setFlow,
    clearFlow,
    isStudentFlow,
    isTutorFlow,
  }
})
