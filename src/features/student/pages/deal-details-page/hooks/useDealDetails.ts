import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { orderService } from '@/services/business'
import { queryKeys } from '@/shared/lib/query-keys'
import { useTelegramStore } from '@/stores/telegram'
import type { Deal } from '@/shared/types'

export function useDealDetails() {
  const route = useRoute()
  const router = useRouter()
  const telegramStore = useTelegramStore()
  const dealId = computed(() => route.params.id as string)
  const dealQuery = useQuery({
    queryKey: computed(() => queryKeys.deal(dealId.value)),
    queryFn: () => orderService.getDeal(dealId.value),
    enabled: computed(() => !!dealId.value),
  })

  const deal = computed(() => dealQuery.data.value as Deal | undefined)
  const isLoading = computed(() => dealQuery.isLoading.value)
  const error = computed(() => dealQuery.error.value?.message ?? null)

  const subjectName = computed(() => deal.value?.subject?.name ?? '')
  const teacherName = computed(() => deal.value?.teacher?.fullName ?? '')
  const tutorName = computed(() => deal.value?.tutor?.name ?? '')
  const tutorUsername = computed(() => deal.value?.tutor?.telegramUsername ?? '')

  const statusLabel = computed(() => {
    const s = deal.value?.status
    if (!s) return ''
    const map: Record<string, string> = {
      PENDING: 'Ожидает начала',
      ACCEPTED: 'Принята',
      IN_PROGRESS: 'В процессе',
      COMPLETED: 'Завершена',
      CANCELLED: 'Отменена',
    }
    return map[s] ?? s
  })

  function formatPrice(price: number | undefined) {
    if (price == null) return '—'
    return `${Math.round(price)} ₽`
  }

  function formatDate(dateStr: string | undefined) {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  function handleBack() {
    telegramStore.hapticFeedback('light')
    router.push('/student/orders')
  }

  function handleStartLesson() {
    telegramStore.hapticFeedback('light')
    const username = tutorUsername.value
    if (username) {
      const url = username.startsWith('@') ? `https://t.me/${username.slice(1)}` : `https://t.me/${username}`
      window.open(url, '_blank')
    } else {
      telegramStore.showAlert('Контакт репетитора недоступен')
    }
  }

  function loadDeal() {
    return dealQuery.refetch()
  }

  const myReview = computed(() => deal.value?.review ?? null)

  return {
    deal,
    isLoading,
    error,
    subjectName,
    teacherName,
    tutorName,
    statusLabel,
    formatPrice,
    formatDate,
    handleBack,
    handleStartLesson,
    loadDeal,
    myReview,
  }
}
