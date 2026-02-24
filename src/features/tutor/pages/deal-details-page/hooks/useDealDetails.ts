import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { orderService } from '@/services/business'
import { queryKeys } from '@/shared/lib/query-keys'
import { useTelegramStore } from '@/stores/telegram'
import { useOrder } from '@/shared/composables/useOrder'
import type { Deal } from '@/shared/types'

export function useDealDetails() {
  const route = useRoute()
  const router = useRouter()
  const telegramStore = useTelegramStore()
  const { completeDeal: completeDealMutation, updateDeal: updateDealMutation } = useOrder()
  const completeDealMutationFn = completeDealMutation()
  const updateDealMutationFn = updateDealMutation()
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
  const studentName = computed(() => deal.value?.student?.name ?? '')

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
    router.push('/tutor/services')
  }

  async function handleStartLesson() {
    if (!dealId.value) return
    telegramStore.hapticFeedback('medium')
    try {
      await updateDealMutationFn.mutateAsync({
        id: dealId.value,
        data: { status: 'IN_PROGRESS' },
      })
      telegramStore.showAlert('Занятие начато')
      await dealQuery.refetch()
    } catch (err: any) {
      telegramStore.showAlert(err?.message ?? 'Не удалось начать занятие')
    }
  }

  async function handleComplete() {
    if (!dealId.value) return
    telegramStore.hapticFeedback('medium')
    try {
      await completeDealMutationFn.mutateAsync(dealId.value)
      telegramStore.showAlert('Занятие завершено')
      await dealQuery.refetch()
    } catch (err: any) {
      telegramStore.showAlert(err?.message ?? 'Не удалось завершить')
    }
  }

  function loadDeal() {
    dealQuery.refetch()
  }

  return {
    deal,
    isLoading,
    error,
    subjectName,
    teacherName,
    studentName,
    statusLabel,
    formatPrice,
    formatDate,
    handleBack,
    handleStartLesson,
    handleComplete,
    loadDeal,
  }
}
