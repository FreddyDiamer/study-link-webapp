import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { useAuthStore } from '@/stores/auth'
import { useOrder } from '@/shared/composables/useOrder'
import type { SelectOption } from '@/shared/components/ui'
import type { Request } from '@/shared/types'
import type { DealFilters, OrdersTab } from '../models'
import {
  DEFAULT_FILTERS,
  SORT_OPTIONS,
  SORT_ORDER_OPTIONS,
  getDealDescription,
  formatOrderDate,
  formatDeadlineInfo,
} from '../models'

export function useTutorOrders() {
  const route = useRoute()
  const router = useRouter()
  const telegramStore = useTelegramStore()
  const authStore = useAuthStore()
  const { getRequests, createRequestResponse } = useOrder()

  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const showFilters = ref(false)
  const showAcceptModal = ref(false)
  const selectedRequest = ref<Request | null>(null)
  const isAccepting = ref(false)
  const tutorComment = ref('')
  const proposedDate = ref('')
  const proposedPrice = ref<number | null>(null)

  const requests = ref<Request[]>([])
  const filters = ref<DealFilters>({ ...DEFAULT_FILTERS })
  const activeTab = ref<OrdersTab>('all')

  const availableSubjects = ref<SelectOption[]>([])
  const availableTeachers = ref<SelectOption[]>([])
  const sortOptions = ref<SelectOption[]>(SORT_OPTIONS)
  const sortOrderOptions = ref<SelectOption[]>(SORT_ORDER_OPTIONS)

  const isOwnOrder = (order: Request): boolean => {
    return authStore.user?.id === order.studentId
  }

  const filteredDeals = computed(() => {
    let result = [...requests.value]
    switch (activeTab.value) {
      case 'active':
        result = result.filter((r) => !r.deadline || new Date(r.deadline).getTime() >= Date.now())
        break
      case 'completed':
        result = result.filter((r) => r.deadline && new Date(r.deadline).getTime() < Date.now())
        break
    }
    if (filters.value.search.trim()) {
      const searchTerm = filters.value.search.trim().toLowerCase()
      result = result.filter(
        (req) =>
          req.subject.name.toLowerCase().includes(searchTerm) ||
          req.teacher.fullName.toLowerCase().includes(searchTerm) ||
          req.student.name.toLowerCase().includes(searchTerm) ||
          (req.description || '').toLowerCase().includes(searchTerm),
      )
    }
    if (filters.value.subject) {
      result = result.filter((req) => req.subject.id === filters.value.subject)
    }
    if (filters.value.teacher) {
      result = result.filter((req) => req.teacher.id === filters.value.teacher)
    }
    result.sort((a, b) => {
      let comparison = 0
      switch (filters.value.sortBy) {
        case 'price':
          comparison = (a.budget ?? 0) - (b.budget ?? 0)
          break
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'deadline': {
          const aD = a.deadline ? new Date(a.deadline).getTime() : Infinity
          const bD = b.deadline ? new Date(b.deadline).getTime() : Infinity
          comparison = aD - bD
          break
        }
        case 'updated':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          break
      }
      return filters.value.sortOrder === 'asc' ? comparison : -comparison
    })
    return result
  })

  const pageTitle = computed(() => 'Все заявки студентов')
  const filteredOrders = computed(() => filteredDeals.value)
  const resultStats = computed(() => ({
    total: filteredDeals.value.length,
    subjects: [...new Set(filteredDeals.value.map((d) => d.subject.name))].length,
    averagePrice:
      filteredDeals.value.length > 0
        ? Math.round(
            filteredDeals.value.reduce((sum, d) => sum + (d.budget ?? 0), 0) /
              filteredDeals.value.length,
          )
        : 0,
  }))

  function extractFiltersData() {
    const subjectMap = new Map<string, string>()
    requests.value.forEach((d) => {
      if (d.subject?.id && d.subject?.name) subjectMap.set(d.subject.id, d.subject.name)
    })
    availableSubjects.value = Array.from(subjectMap.entries()).map(([id, name]) => ({
      value: id,
      label: name,
    }))
    const teacherMap = new Map<string, string>()
    requests.value.forEach((d) => {
      if (d.teacher?.id && d.teacher?.fullName) teacherMap.set(d.teacher.id, d.teacher.fullName)
    })
    availableTeachers.value = Array.from(teacherMap.entries()).map(([id, fullName]) => ({
      value: id,
      label: fullName,
    }))
  }

  const loadOrders = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await getRequests()
      requests.value = response?.items ?? []
      extractFiltersData()
    } catch (err: any) {
      error.value = err.message || 'Ошибка загрузки заказов'
    } finally {
      isLoading.value = false
    }
  }

  const resetFilters = () => {
    filters.value = { ...DEFAULT_FILTERS }
    telegramStore.hapticFeedback('light')
  }

  const toggleFilters = () => {
    showFilters.value = !showFilters.value
    telegramStore.hapticFeedback('light')
  }

  const goBack = () => {
    telegramStore.hapticFeedback('light')
    router.back()
  }

  const respondToOrder = (deal: Request) => {
    telegramStore.hapticFeedback('medium')
    selectedRequest.value = deal
    if (deal.deadline) {
      proposedDate.value = new Date(deal.deadline).toISOString().slice(0, 16)
    } else {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(18, 0)
      proposedDate.value = tomorrow.toISOString().slice(0, 16)
    }
    proposedPrice.value = deal.budget ?? null
    showAcceptModal.value = true
  }

  const handleAcceptDeal = async () => {
    if (!selectedRequest.value) return
    if (!proposedDate.value.trim()) {
      telegramStore.hapticFeedback('error')
      telegramStore.showAlert('Пожалуйста, укажите дату и время проведения занятия')
      return
    }
    isAccepting.value = true
    telegramStore.hapticFeedback('medium')
    try {
      await createRequestResponse({
        tutorId: authStore.user?.id as string,
        requestId: selectedRequest.value.id,
        message: tutorComment.value.trim() || undefined,
        price: proposedPrice.value ?? undefined,
        proposedDeadline: new Date(proposedDate.value).toISOString(),
      })
      await loadOrders()
      telegramStore.hapticFeedback('success')
      showAcceptModal.value = false
      selectedRequest.value = null
      tutorComment.value = ''
      proposedDate.value = ''
      proposedPrice.value = null
      telegramStore.showAlert('Отклик отправлен! Студент получит уведомление.')
    } catch (err) {
      console.error('Ошибка отправки отклика:', err)
      telegramStore.hapticFeedback('error')
      telegramStore.showAlert('Не удалось отправить отклик. Попробуйте ещё раз.')
    } finally {
      isAccepting.value = false
    }
  }

  const handleCloseAcceptModal = () => {
    if (!isAccepting.value) {
      showAcceptModal.value = false
      selectedRequest.value = null
      tutorComment.value = ''
      proposedDate.value = ''
      proposedPrice.value = null
    }
  }

  watch(showAcceptModal, (isOpen) => {
    if (!isOpen) {
      selectedRequest.value = null
      tutorComment.value = ''
      proposedDate.value = ''
      proposedPrice.value = null
    }
  })

  onMounted(() => {
    const subject = route.query.subject as string
    if (subject) filters.value.subject = subject
    const search = route.query.search as string
    if (search) filters.value.search = search
    loadOrders()
  })

  return {
    isLoading,
    error,
    showFilters,
    showAcceptModal,
    selectedRequest,
    isAccepting,
    tutorComment,
    proposedDate,
    proposedPrice,
    filters,
    availableSubjects,
    availableTeachers,
    sortOptions,
    sortOrderOptions,
    filteredOrders,
    pageTitle,
    resultStats,
    isOwnOrder,
    getDealDescription,
    formatDate: formatOrderDate,
    formatDeadlineInfo,
    loadOrders,
    resetFilters,
    toggleFilters,
    goBack,
    respondToOrder,
    handleAcceptDeal,
    handleCloseAcceptModal,
    setTutorComment: (v: string) => { tutorComment.value = v },
    setProposedDate: (v: string) => { proposedDate.value = v },
    setProposedPrice: (v: number | null) => { proposedPrice.value = v },
  }
}
