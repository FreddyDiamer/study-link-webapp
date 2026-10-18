import { defineStore } from 'pinia'
import { ref } from 'vue'
import { educationService } from '@/services/business'
import type { Group } from '@/shared/types'

/**
 * Глобальный справочник — только группы: их выбирают в профиле. Предметы и преподавателей
 * (≈1400 каждого) целиком не держим: выбор строится из расписания группы
 * (useMyGroupSubjects) и серверного поиска.
 */
export const useEducationStore = defineStore('education', () => {
  // State
  const groups = ref<Group[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isInitialized = ref(false)

  // Actions
  const initialize = async () => {
    if (isInitialized.value) return

    isLoading.value = true
    error.value = null

    try {
      groups.value = await educationService.getGroups()
      isInitialized.value = true
    } catch (err: any) {
      error.value = err.message
      console.error('Ошибка загрузки групп:', err)
    } finally {
      isLoading.value = false
    }
  }

  const refresh = async () => {
    isInitialized.value = false
    await initialize()
  }

  const clear = () => {
    groups.value = []
    isLoading.value = false
    error.value = null
    isInitialized.value = false
  }

  return {
    // State
    groups,
    isLoading,
    error,
    isInitialized,

    // Actions
    initialize,
    refresh,
    clear,
  }
})
