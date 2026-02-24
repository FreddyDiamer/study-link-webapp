import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { useEducation } from '@/shared/composables'
import { tutorService } from '@/services/business'
import type { Tutor, TutorSearchParams } from '../models'

export function useTutorsList() {
  const route = useRoute()
  const telegramStore = useTelegramStore()
  const { activeSubjects, isLoading: educationLoading, error: educationError, isInitialized, initialize } = useEducation()

  const searchQuery = ref('')
  const selectedSubject = ref<string | null>(null)
  const selectedSort = ref('rating')
  const showFilters = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const tutors = ref<Tutor[]>([])
  const totalTutors = ref(0)
  const currentPage = ref(1)
  const totalPages = ref(1)

  const availableSubjects = computed(() => activeSubjects.value.map((s) => s.name))
  const filteredTutors = computed(() => tutors.value)
  const pageTitle = computed(() =>
    selectedSubject.value ? `Репетиторы по ${selectedSubject.value.toLowerCase()}` : 'Все репетиторы',
  )

  const loadTutors = async () => {
    isLoading.value = true
    error.value = null
    try {
      const params: TutorSearchParams = {
        subject: selectedSubject.value || undefined,
        search: searchQuery.value.trim() || undefined,
        minRating: selectedSort.value === 'rating' ? 4 : undefined,
        page: currentPage.value,
        limit: 10,
      }
      const response = await tutorService.searchTutors(params)
      tutors.value = response.items ?? []
      totalTutors.value = response.total ?? 0
      totalPages.value = response.totalPages ?? 1
    } catch (err: unknown) {
      error.value = (err as Error).message
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
    telegramStore.hapticFeedback('light')
    loadTutors()
  }

  const toggleFilters = () => {
    showFilters.value = !showFilters.value
    telegramStore.hapticFeedback('light')
  }

  const goBack = () => {
    telegramStore.hapticFeedback('light')
    window.history.back()
  }

  const selectSubject = (subject: string | null) => {
    telegramStore.hapticFeedback('light')
    selectedSubject.value = subject
    currentPage.value = 1
    loadTutors()
  }

  watch([selectedSubject, selectedSort], () => {
    currentPage.value = 1
    loadTutors()
  })

  onMounted(async () => {
    if (!isInitialized.value) await initialize()
    const subject = route.query.subject as string
    if (subject) selectedSubject.value = subject
    await loadTutors()
  })

  return {
    searchQuery,
    selectedSubject,
    selectedSort,
    showFilters,
    educationLoading,
    educationError,
    initialize,
    isLoading,
    error,
    tutors: filteredTutors,
    totalTutors,
    currentPage,
    totalPages,
    availableSubjects,
    pageTitle,
    loadTutors,
    goToPage,
    toggleFilters,
    goBack,
    selectSubject,
  }
}
