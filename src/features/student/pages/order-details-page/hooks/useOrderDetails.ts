import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { useTelegramStore } from '@/stores/telegram'
import { useEducation } from '@/shared/composables'
import { orderService } from '@/services/business'
import { queryKeys } from '@/shared/lib/query-keys'
import type { Request, RequestResponse } from '../models'

export function useOrderDetails() {
  const route = useRoute()
  const router = useRouter()
  const queryClient = useQueryClient()
  const telegramStore = useTelegramStore()
  const { isInitialized, initialize } = useEducation()

  const orderId = computed(() => route.params.id as string)

  const requestQuery = useQuery({
    queryKey: computed(() => queryKeys.request(orderId.value)),
    queryFn: () => orderService.getRequest(orderId.value),
    enabled: computed(() => !!orderId.value),
  })

  const requestResponsesQuery = useQuery({
    queryKey: computed(() => queryKeys.requestResponses(orderId.value)),
    queryFn: () => orderService.getRequestResponses(orderId.value),
    enabled: computed(() => !!orderId.value),
  })

  const order = computed(() => (requestQuery.data.value as Request | undefined) ?? null)
  const responses = computed(
    () => (requestResponsesQuery.data.value as RequestResponse[] | undefined) ?? [],
  )

  const isLoading = computed(
    () => requestQuery.isLoading.value || requestResponsesQuery.isLoading.value,
  )
  const error = computed(() => {
    const e = requestQuery.error.value || requestResponsesQuery.error.value
    return e ? (e as Error).message || 'Ошибка загрузки данных заказа' : null
  })

  const subjectName = computed(() => order.value?.subject?.name || 'Предмет не указан')
  const teacherName = computed(() => order.value?.teacher?.fullName || 'Преподаватель не указан')

  const loadOrderDetails = async () => {
    await Promise.all([requestQuery.refetch(), requestResponsesQuery.refetch()])
  }

  const formatPrice = (price: number) => `${price} ₽`
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const handleBack = () => router.back()
  const handleEditOrder = () => {
    if (order.value) router.push(`/student/orders/${order.value.id}/edit`)
  }

  const handleResponseAction = async (responseId: string, action: 'accept' | 'reject' | 'cancel') => {
    try {
      if (action === 'accept') {
        await orderService.acceptRequestResponse(responseId)
      } else if (action === 'reject') {
        await orderService.rejectRequestResponse(responseId)
      } else if (action === 'cancel') {
        await orderService.cancelRequestResponse(responseId)
      }
      await loadOrderDetails()
      queryClient.invalidateQueries({ queryKey: queryKeys.myRequests() })
      queryClient.invalidateQueries({ queryKey: queryKeys.requestResponses(orderId.value) })
      queryClient.invalidateQueries({ queryKey: queryKeys.myStudentDeals() })
    } catch (e) {
      console.error('Ошибка обработки отклика:', e)
      telegramStore.showAlert((e as Error)?.message ?? 'Не удалось выполнить действие')
    }
  }

  const handleContactTutor = (telegramUsername?: string) => {
    if (!telegramUsername) {
      telegramStore.showAlert('Telegram репетитора не указан')
      return
    }
    const telegramUrl = `https://t.me/${telegramUsername.replace('@', '')}`
    window.open(telegramUrl, '_blank')
  }

  onMounted(async () => {
    if (!isInitialized.value) await initialize()
  })

  return {
    order,
    responses,
    isLoading,
    error,
    subjectName,
    teacherName,
    loadOrderDetails,
    formatPrice,
    formatDate,
    handleBack,
    handleEditOrder,
    handleResponseAction,
    handleContactTutor,
  }
}
