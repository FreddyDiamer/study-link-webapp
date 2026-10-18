import { computed } from 'vue'
import { useEducationStore } from '@/stores'

export const useEducation = () => {
  const educationStore = useEducationStore()

  const groups = computed(() => educationStore.groups)
  const isLoading = computed(() => educationStore.isLoading)
  const error = computed(() => educationStore.error)
  const isInitialized = computed(() => educationStore.isInitialized)

  const initialize = () => educationStore.initialize()
  const refresh = () => educationStore.refresh()
  const clear = () => educationStore.clear()

  return {
    // State
    groups,
    isLoading,
    error,
    isInitialized,

    // Methods
    initialize,
    refresh,
    clear,
  }
}
