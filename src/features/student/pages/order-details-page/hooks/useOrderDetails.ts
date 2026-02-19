import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { useEducation } from '@/shared/composables'
import { useOrder } from '@/shared/composables'
import type { Request, RequestResponse } from '../models'

export function useOrderDetails() {
  const route = useRoute()
  const router = useRouter()
  const telegramStore = useTelegramStore()
  const { getRequest, getRequestResponses } = useOrder()
  const { isInitialized, initialize } = useEducation()

  const order = ref<Request | null>(null)
  const responses = ref<RequestResponse[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const subjectName = computed(() => order.value?.subject?.name || 'Предмет не указан')
  const teacherName = computed(() => order.value?.teacher?.fullName || 'Преподаватель не указан')

  const loadOrderDetails = async () => {
    const orderId = route.params.id as string
    if (!orderId) return
    isLoading.value = true
    error.value = null
    try {
      const [orderData, responsesData] = await Promise.all([
        getRequest(orderId),
        getRequestResponses(orderId),
      ])
      order.value = orderData
      responses.value = responsesData
    } catch (err: unknown) {
      error.value = (err as Error).message || 'Ошибка загрузки данных заказа'
      console.error('Ошибка загрузки заказа:', err)
    } finally {
      isLoading.value = false
    }
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

  const handleResponseAction = async (responseId: string, action: 'accept' | 'reject') => {
    try {
      if (action === 'accept') console.log('Принятие отклика:', responseId)
      else console.log('Отклонение отклика:', responseId)
      await loadOrderDetails()
    } catch (e) {
      console.error('Ошибка обработки отклика:', e)
    }
  }

  onMounted(async () => {
    if (!isInitialized.value) await initialize()
    await loadOrderDetails()
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
  }
}
