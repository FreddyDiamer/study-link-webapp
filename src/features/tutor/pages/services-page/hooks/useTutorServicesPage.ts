import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { PATHS } from '@/router/paths'
import { useService } from '@/shared/composables'
import { useOrder } from '@/shared/composables/useOrder'
import type {
  TutorServicesTab,
  TutorServiceCard,
  TutorActiveDeal,
  TutorRequestResponse,
} from '../models'
import type { Service, Deal, RequestResponse, ServiceStatus, ResponseStatus } from '@/shared/types'
import { DealStatus } from '@/shared/types'

export function useTutorServicesPage() {
  const router = useRouter()
  const telegramStore = useTelegramStore()
  const { getMyServices } = useService()
  const { getMyTutorDeals, getMyRequestResponses, deleteRequestResponse, completeDeal: completeDealMutation, updateDeal: updateDealMutation } = useOrder()
  const deleteRequestResponseMutation = deleteRequestResponse()
  const completeDealMutationFn = completeDealMutation()
  const updateDealMutationFn = updateDealMutation()
  const activeTab = ref<TutorServicesTab>('services')

  // Запросы создаём на верхнем уровне, чтобы Vue Query их регистрировал и вызывал API
  const myServicesQuery = getMyServices()
  const myTutorDealsQuery = getMyTutorDeals()
  const myRequestResponsesQuery = getMyRequestResponses()

  const error = ref<string | null>(null)

  // Функции маппинга данных с бэка в типы компонента
  const mapServiceToCard = (service: Service): TutorServiceCard => {
    const statusMap: Record<ServiceStatus, 'active' | 'frozen' | 'deleted'> = {
      ACTIVE: 'active',
      INACTIVE: 'frozen',
      SUSPENDED: 'frozen',
    }

    // Используем хеш строки ID как числовой идентификатор для совместимости
    const numericId = service.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

    return {
      id: numericId,
      originalId: service.id,
      title: `${service.subject.name} - ${service.teacher.fullName}`,
      subject: service.subject.name,
      teacher: service.teacher.fullName,
      level: '',
      description: service.description || '',
      price: service.price,
      lessonsCount: service.lessonsCount ?? 1,
      lessonDurationMinutes: service.lessonDurationMinutes ?? 60,
      duration: service.lessonDurationMinutes ?? 60,
      format: ['Онлайн', 'Очно'],
      status: statusMap[service.status] || 'active',
      studentsCount: 0, // TODO: добавить подсчет студентов
      rating: 0, // TODO: добавить рейтинг
      reviewsCount: 0, // TODO: добавить количество отзывов
      features: [], // TODO: добавить features если нужно
      responsesCount: service.responses?.length || 0,
      newResponsesCount: service.responses?.filter((r) => r.status === 'PENDING').length || 0,
      activeResponsesCount: service.responses?.filter((r) => r.status === 'ACCEPTED').length || 0,
      hasActiveDeals: false, // TODO: проверить наличие активных сделок
    }
  }

  const mapDealToCard = (deal: Deal): TutorActiveDeal => {
    const statusMap: Record<DealStatus, 'pending' | 'accepted' | 'in_progress' | 'completed'> = {
      PENDING: 'pending',
      ACCEPTED: 'accepted',
      IN_PROGRESS: 'in_progress',
      COMPLETED: 'completed',
      CANCELLED: 'pending',
    }

    // Используем хеш строки ID как числовой идентификатор для совместимости
    const numericId = deal.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

    return {
      id: numericId,
      originalId: deal.id,
      studentId: deal.studentId,
      studentName: deal.student.name,
      studentAvatar: deal.student.avatarUrl,
      serviceTitle: deal.subject.name,
      subject: deal.subject.name,
      teacher: deal.teacher.fullName,
      taskDescription: deal.requestResponse?.request?.description || '',
      tutorComment: deal.requestResponse?.message,
      price: deal.price, // уже в рублях благодаря бизнес-сервису
      deadline: deal.deadline ? new Date(deal.deadline) : undefined,
      status: statusMap[deal.status] || 'pending',
      createdAt: new Date(deal.createdAt),
      lastActivity: new Date(deal.updatedAt),
    }
  }

  const mapRequestResponseToCard = (response: RequestResponse): TutorRequestResponse => {
    const statusMap: Record<ResponseStatus, 'pending' | 'accepted' | 'rejected' | 'expired'> = {
      PENDING: 'pending',
      ACCEPTED: 'accepted',
      REJECTED: 'rejected',
      EXPIRED: 'expired',
    }

    // Используем хеш строки ID как числовой идентификатор для совместимости
    const numericId = response.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const numericRequestId = response.requestId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

    return {
      id: numericId,
      originalId: response.id,
      tutorId: response.tutorId,
      requestId: numericRequestId,
      studentName: response.request.student.name,
      studentAvatar: response.request.student.avatarUrl,
      requestTitle: `${response.request.subject.name} - ${response.request.teacher.fullName}`,
      requestDescription: response.request.description || '',
      message: response.message,
      price: response.price, // уже в рублях
      proposedDeadline: response.proposedDeadline ? new Date(response.proposedDeadline) : undefined,
      status: statusMap[response.status] || 'pending',
      createdAt: new Date(response.createdAt),
      budget: response.request.budget, // уже в рублях
      urgency: 'medium', // TODO: добавить urgency в Request если нужно
    }
  }

  const services = computed(() =>
    (myServicesQuery.data.value?.items ?? []).map(mapServiceToCard),
  )

  const allDealsMapped = computed(() =>
    (myTutorDealsQuery.data.value?.items ?? []).map(mapDealToCard),
  )
  const activeDeals = computed(() =>
    allDealsMapped.value.filter((d) => d.status !== 'completed'),
  )
  const completedDeals = computed(() =>
    allDealsMapped.value.filter((d) => d.status === 'completed'),
  )
  const requestResponses = computed(() =>
    (myRequestResponsesQuery.data.value?.items ?? []).map(mapRequestResponseToCard),
  )

  const isLoading = computed(
    () =>
      myServicesQuery.isLoading.value ||
      myTutorDealsQuery.isLoading.value ||
      myRequestResponsesQuery.isLoading.value,
  )

  const loadServices = () => {
    error.value = null
    myServicesQuery.refetch()
  }

  const loadDeals = () => {
    error.value = null
    myTutorDealsQuery.refetch()
  }

  const loadRequestResponses = () => {
    error.value = null
    myRequestResponsesQuery.refetch()
  }

  const loadTabData = (tab: TutorServicesTab) => {
    switch (tab) {
      case 'services':
        loadServices()
        break
      case 'deals':
      case 'deals-completed':
        loadDeals()
        break
      case 'responses':
        loadRequestResponses()
        break
    }
  }

  const activeServices = computed(() =>
    services.value.filter((s) => s.status !== 'deleted'),
  )

  const pendingResponsesCount = computed(
    () => requestResponses.value.filter((r) => r.status === 'pending').length,
  )
  const activeDealsCount = computed(
    () =>
      activeDeals.value.filter(
        (d) => d.status === 'in_progress' || d.status === 'accepted',
      ).length,
  )

  function createService() {
    telegramStore.hapticFeedback('light')
    router.push(PATHS.TUTOR_CREATE_SERVICE)
  }

  function viewService(service: TutorServiceCard) {
    if (service.status === 'deleted') return
    telegramStore.hapticFeedback('light')
    router.push(`/tutor/services/${service.originalId}/responses`)
  }

  function editService(service: TutorServiceCard) {
    telegramStore.hapticFeedback('light')
    router.push(`/tutor/services/${service.originalId}/edit`)
  }

  function viewDealDetails(deal: TutorActiveDeal) {
    telegramStore.hapticFeedback('light')
    router.push(`/tutor/deals/${deal.originalId}`)
  }

  async function startDeal(deal: TutorActiveDeal) {
    telegramStore.hapticFeedback('medium')
    error.value = null
    try {
      await updateDealMutationFn.mutateAsync({
        id: deal.originalId,
        data: { status: DealStatus.IN_PROGRESS },
      })
      telegramStore.showAlert('Занятие начато')
      await myTutorDealsQuery.refetch()
    } catch (err: any) {
      const message = err?.message || 'Не удалось начать занятие'
      error.value = message
      telegramStore.showAlert(message)
      console.error('Ошибка начала занятия:', err)
    }
  }

  async function completeDeal(deal: TutorActiveDeal) {
    telegramStore.hapticFeedback('medium')
    error.value = null
    try {
      await completeDealMutationFn.mutateAsync(deal.originalId)
      telegramStore.showAlert('Занятие завершено')
      await myTutorDealsQuery.refetch()
    } catch (err: any) {
      const message = err?.message || 'Не удалось завершить сделку'
      error.value = message
      telegramStore.showAlert(message)
      console.error('Ошибка завершения сделки:', err)
    }
  }

  async function withdrawResponse(response: TutorRequestResponse) {
    telegramStore.hapticFeedback('medium')
    error.value = null
    try {
      await deleteRequestResponseMutation.mutateAsync(response.originalId)
      telegramStore.showAlert('Отклик отозван')
      await myRequestResponsesQuery.refetch()
    } catch (err: any) {
      const message = err.message || 'Не удалось отозвать отклик'
      error.value = message
      telegramStore.showAlert(message)
      console.error('Ошибка отзыва отклика:', err)
    }
  }

  function switchTab(tab: TutorServicesTab) {
    telegramStore.hapticFeedback('light')
    activeTab.value = tab
  }

  // Загружаем данные при монтировании и при изменении таба
  onMounted(() => {
    loadTabData(activeTab.value)
  })

  watch(activeTab, (newTab) => {
    loadTabData(newTab)
  })

  return {
    activeTab,
    services,
    activeDeals,
    completedDeals,
    requestResponses,
    activeServices,
    pendingResponsesCount,
    activeDealsCount,
    isLoading,
    error,
    createService,
    viewService,
    editService,
    viewDealDetails,
    startDeal,
    completeDeal,
    withdrawResponse,
    switchTab,
    loadServices,
    loadDeals,
    loadRequestResponses,
  }
}
