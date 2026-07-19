import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export type UserFlow = 'student' | 'tutor'

export const useAppStore = defineStore('app', () => {
  const currentFlow = useLocalStorage<UserFlow | null>('currentFlow', null)

  const showGroupCard = useLocalStorage<boolean>('showGroupCard', true)

  const setFlow = (flow: UserFlow) => {
    currentFlow.value = flow
  }

  const isStudentFlow = computed(() => currentFlow.value === 'student')
  const isTutorFlow = computed(() => currentFlow.value === 'tutor')

  return {
    currentFlow,
    showGroupCard,
    setFlow,
    isStudentFlow,
    isTutorFlow,
  }
})
