import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { serviceService } from '@/services/business/service'
import { useEducation } from '@/shared/composables'
import type { Service as ApiService, ServiceFilterDto } from '@/shared/types'
import type { SelectOption } from '@/shared/components/ui'
import type { Service, ServiceFilters } from '../models'

const defaultFilters: ServiceFilters = {
  search: '',
  subject: '',
  teacher: null,
  availability: 'all',
  sortBy: 'rating',
  sortOrder: 'desc',
}

function mapApiToViewModel(api: ApiService): Service {
  const apiWithTutor = api as ApiService & { tutorId?: string; tutor?: { id: string; name?: string } }
  return {
    id: api.id,
    title: api.subject?.name || 'Услуга',
    description: api.description || '',
    price: api.price,
    priceType: 'hour',
    subject: api.subject?.name || 'Предмет',
    lessonsCount: api.lessonsCount ?? 1,
    lessonDurationMinutes: api.lessonDurationMinutes ?? 60,
    teacher: {
      id: api.teacher?.id || '',
      name: api.teacher?.fullName || 'Преподаватель',
      experience: 0,
      rating: 0,
      reviewsCount: 0,
    },
    tutorId: apiWithTutor.tutorId ?? apiWithTutor.tutor?.id,
    tutorName: apiWithTutor.tutor?.name ?? undefined,
    format: 'online',
    workingHours: '',
    availability: 'available',
    tags: [],
    isOwnService: api.isOwnService,
    currentUserResponded: api.currentUserResponded,
  }
}

export function useServicesPage() {
  const route = useRoute()
  const telegramStore = useTelegramStore()
  const { activeSubjects, teachers, isInitialized, initialize } = useEducation()

  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const services = ref<Service[]>([])
  const availableSubjects = ref<SelectOption[]>([])
  const availableTeachers = ref<SelectOption[]>([])
  const showFilters = ref(false)
  const showRequestModal = ref(false)
  const selectedService = ref<Service | null>(null)
  const filters = ref<ServiceFilters>({ ...defaultFilters })

  const pageTitle = computed(() =>
    filters.value.subject ? `Услуги по ${filters.value.subject.toLowerCase()}` : 'Все услуги',
  )

  const filteredServices = computed(() => {
    let result = [...services.value]
    if (filters.value.search.trim()) {
      const q = filters.value.search.trim().toLowerCase()
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.teacher.name.toLowerCase().includes(q) ||
          s.subject.toLowerCase().includes(q),
      )
    }
    if (filters.value.availability !== 'all') {
      result = result.filter((s) => s.availability === filters.value.availability)
    }
    result.sort((a, b) => {
      let c = 0
      switch (filters.value.sortBy) {
        case 'price': c = a.price - b.price; break
        case 'rating': c = a.teacher.rating - b.teacher.rating; break
        case 'experience': c = a.teacher.experience - b.teacher.experience; break
        default: break
      }
      return filters.value.sortOrder === 'asc' ? c : -c
    })
    return result
  })

  const resultStats = computed(() => ({
    total: filteredServices.value.length,
    subjects: [...new Set(filteredServices.value.map((s) => s.subject))].length,
    teachers: [...new Set(filteredServices.value.map((s) => s.teacher.id))].length,
    averagePrice:
      filteredServices.value.length > 0
        ? Math.round(
            filteredServices.value.reduce((sum, s) => sum + s.price, 0) /
              filteredServices.value.length,
          )
        : 0,
  }))

  function buildApiFilters(): ServiceFilterDto {
    const apiFilters: ServiceFilterDto = {}
    if (filters.value.subject && activeSubjects.value.length > 0) {
      const subject = activeSubjects.value.find((s) => s.name === filters.value.subject)
      if (subject) apiFilters.subjectId = subject.id
    }
    if (filters.value.teacher) apiFilters.teacherId = filters.value.teacher
    return apiFilters
  }

  function extractFiltersData() {
    availableSubjects.value = activeSubjects.value.map((s) => ({ value: s.name, label: s.name }))
    availableTeachers.value = teachers.value.map((t) => ({ value: t.id, label: t.fullName }))
  }

  const loadServices = async () => {
    isLoading.value = true
    error.value = null
    try {
      if (!isInitialized.value) await initialize()
      const apiFilters = buildApiFilters()
      const response = await serviceService.getServices(apiFilters)
      services.value = response.items.map(mapApiToViewModel)
      extractFiltersData()
    } catch (err: unknown) {
      error.value = (err as Error).message || 'Ошибка загрузки услуг'
    } finally {
      isLoading.value = false
    }
  }

  const resetFilters = () => {
    filters.value = { ...defaultFilters }
    telegramStore.hapticFeedback('light')
    loadServices()
  }

  const toggleFilters = () => {
    showFilters.value = !showFilters.value
    telegramStore.hapticFeedback('light')
  }

  const goBack = () => {
    telegramStore.hapticFeedback('light')
    window.history.back()
  }

  const submitRequest = (service: Service) => {
    telegramStore.hapticFeedback('medium')
    selectedService.value = service
    showRequestModal.value = true
  }

  const handleRequestSubmit = async () => {
    try {
      telegramStore.showAlert('Заявка отправлена! Репетитор ответит в ближайшее время.')
      showRequestModal.value = false
      selectedService.value = null
      // После успешной заявки обновляем список услуг,
      // чтобы подтянулось актуальное поле currentUserResponded
      await loadServices()
    } catch (e) {
      console.error(e)
      telegramStore.showAlert('Ошибка отправки заявки. Попробуйте еще раз.')
    }
  }

  const viewServiceDetails = (service: Service) => {
    telegramStore.hapticFeedback('light')
  }

  watch(
    () => [filters.value.subject, filters.value.teacher],
    () => {
      if (isInitialized.value) loadServices()
    },
    { deep: true },
  )

  onMounted(async () => {
    if (!isInitialized.value) await initialize()
    const subject = route.query.subject as string
    if (subject) filters.value.subject = subject
    const search = route.query.search as string
    if (search) filters.value.search = search
    await loadServices()
  })

  return {
    filters,
    isLoading,
    error,
    filteredServices,
    pageTitle,
    resultStats,
    showFilters,
    showRequestModal,
    selectedService,
    availableSubjects,
    availableTeachers,
    loadServices,
    resetFilters,
    toggleFilters,
    goBack,
    submitRequest,
    handleRequestSubmit,
    viewServiceDetails,
  }
}
