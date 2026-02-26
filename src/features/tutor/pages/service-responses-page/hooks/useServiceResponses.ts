import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { orderService, serviceService } from '@/services/business'
import type { ResponseTabId, ServiceInfo, ServiceResponseItem } from '../models'
import { getResponseStatusInfo, formatResponseDate, formatResponseDeadline } from '../models'
import type { Service, ServiceResponse } from '@/shared/types'

function mapServiceToInfo(s: Service): ServiceInfo {
  return {
    id: s.id,
    tutorId: s.tutorId,
    subjectId: s.subjectId,
    teacherId: s.teacherId,
    price: s.price ?? 0,
    description: s.description ?? '',
    workingHours: '',
    status: s.status,
    lessonsCount: s.lessonsCount ?? 1,
    lessonDurationMinutes: s.lessonDurationMinutes ?? 60,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
    subject: { name: s.subject?.name ?? '' },
    teacher: { fullName: s.teacher?.fullName ?? '' },
  }
}

function mapResponseToItem(r: ServiceResponse): ServiceResponseItem {
  return {
    id: r.id,
    studentId: r.studentId,
    serviceId: r.serviceId,
    message: r.message ?? '',
    price: r.price ?? 0,
    proposedDeadline: r.proposedDeadline ?? null,
    proposedDeadlineType: (r as any).proposedDeadlineType,
    budgetType: (r as any).budgetType,
    status: r.status,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    student: {
      name: r.student?.name ?? '',
      rating: 0,
      telegramUsername: (r.student as any)?.telegramUsername,
    },
    service: {
      price: r.service?.price ?? 0,
      subject: { name: r.service?.subject?.name ?? '' },
      teacher: { fullName: r.service?.teacher?.fullName ?? '' },
    },
  }
}

export function useServiceResponses() {
  const route = useRoute()
  const router = useRouter()
  const telegramStore = useTelegramStore()

  const serviceId = computed(() => route.params.id as string)
  const activeTab = ref<ResponseTabId>('new')
  const service = ref<ServiceInfo | null>(null)
  const responses = ref<ServiceResponseItem[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const filteredResponses = computed(() => {
    switch (activeTab.value) {
      case 'new':
        return responses.value.filter((r) => r.status === 'PENDING')
      case 'active':
        return responses.value.filter((r) => r.status === 'ACCEPTED')
      case 'completed':
        return responses.value.filter((r) => r.status === 'REJECTED' || r.status === 'EXPIRED')
      default:
        return responses.value
    }
  })

  const pendingCount = computed(() => responses.value.filter((r) => r.status === 'PENDING').length)
  const activeCount = computed(() => responses.value.filter((r) => r.status === 'ACCEPTED').length)
  const completedCount = computed(
    () => responses.value.filter((r) => r.status === 'REJECTED' || r.status === 'EXPIRED').length,
  )

  async function loadData() {
    const id = serviceId.value
    if (!id) return
    isLoading.value = true
    error.value = null
    try {
      const [svc, res] = await Promise.all([
        serviceService.getService(id),
        orderService.getServiceResponses(id),
      ])
      service.value = mapServiceToInfo(svc)
      responses.value = res.map(mapResponseToItem)
    } catch (err: any) {
      error.value = err?.message ?? 'Не удалось загрузить данные'
      service.value = null
      responses.value = []
    } finally {
      isLoading.value = false
    }
  }

  function goBack() {
    telegramStore.hapticFeedback('light')
    router.back()
  }

  async function acceptResponse(response: ServiceResponseItem) {
    telegramStore.hapticFeedback('medium')
    error.value = null
    try {
      await orderService.acceptServiceResponse(response.id)
      await loadData()
    } catch (err: any) {
      error.value = err?.message ?? 'Не удалось принять отклик'
      telegramStore.showAlert(error.value)
    }
  }

  async function rejectResponse(response: ServiceResponseItem) {
    telegramStore.hapticFeedback('heavy')
    error.value = null
    try {
      await orderService.rejectServiceResponse(response.id)
      await loadData()
    } catch (err: any) {
      error.value = err?.message ?? 'Не удалось отклонить отклик'
      telegramStore.showAlert(error.value)
    }
  }

  function contactStudent(response: ServiceResponseItem) {
    telegramStore.hapticFeedback('light')
    const username = response.student?.telegramUsername
    if (username) {
      const url = username.startsWith('@') ? `https://t.me/${username.slice(1)}` : `https://t.me/${username}`
      window.open(url, '_blank')
    } else {
      telegramStore.showAlert('Контакт студента недоступен')
    }
  }

  function completeLessons(_response: ServiceResponseItem) {
    telegramStore.hapticFeedback('light')
    telegramStore.showAlert('Завершение занятий — в карточке сделки на вкладке «Активные»')
  }

  onMounted(() => {
    loadData()
  })

  watch(serviceId, () => {
    loadData()
  })

  return {
    serviceId,
    activeTab,
    service,
    responses,
    filteredResponses,
    pendingCount,
    activeCount,
    completedCount,
    isLoading,
    error,
    goBack,
    acceptResponse,
    rejectResponse,
    contactStudent,
    completeLessons,
    loadData,
    getResponseStatusInfo,
    formatDate: formatResponseDate,
    formatDeadline: formatResponseDeadline,
  }
}
