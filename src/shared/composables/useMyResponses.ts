import { computed, ref } from 'vue'
import { orderService } from '@/services/business'
import { RequestStatus, ResponseStatus } from '@/shared/types'

/** Исходящий отклик в едином виде: роль задаёт объект, а не режим человека. */
export interface MyResponse {
  id: string
  /** на заявку откликались как исполнитель, на услугу — как заказчик */
  kind: 'request' | 'service'
  subject: string
  teacher: string
  counterparty: string
  price?: number
  message?: string
  createdAt: string
  /** живые отклики держат полный вид, отработавшие сжимаются */
  state: 'pending' | 'accepted' | 'closed'
  label: string
}

const daysSince = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime()
  return Math.max(0, Math.floor(diff / (24 * 60 * 60 * 1000)))
}

const waitingLabel = (iso: string) => {
  const days = daysSince(iso)
  if (days === 0) return 'сегодня'
  if (days === 1) return '1 день'
  if (days < 5) return `${days} дня`
  return `${days} дней`
}

export const useMyResponses = () => {
  const items = ref<MyResponse[]>([])
  const isLoading = ref(false)
  const failed = ref(false)

  const load = async () => {
    isLoading.value = true
    failed.value = false
    try {
      const [asTutor, asStudent] = await Promise.all([
        orderService.getMyRequestResponses(),
        orderService.getMyServiceResponses(),
      ])

      const fromRequests: MyResponse[] = (asTutor?.items ?? []).map((r) => {
        const requestClosed = r.request?.status === RequestStatus.CLOSED
        const state =
          r.status === ResponseStatus.ACCEPTED
            ? 'accepted'
            : r.status === ResponseStatus.PENDING
              ? 'pending'
              : 'closed'
        return {
          id: r.id,
          kind: 'request' as const,
          subject: r.request?.subject?.name ?? 'Предмет',
          teacher: r.request?.teacher?.fullName ?? '—',
          counterparty: r.request?.student?.name ?? 'Студент',
          price: r.price ?? undefined,
          message: r.message ?? undefined,
          createdAt: r.createdAt,
          state,
          label:
            state === 'accepted'
              ? 'Выбрали вас'
              : state === 'pending'
                ? 'Ждёт ответа'
                : requestClosed
                  ? 'Заявку закрыли'
                  : 'Выбрали другого',
        }
      })

      const fromServices: MyResponse[] = (asStudent?.items ?? []).map((r) => {
        const state =
          r.status === ResponseStatus.ACCEPTED
            ? 'accepted'
            : r.status === ResponseStatus.PENDING
              ? 'pending'
              : 'closed'
        return {
          id: r.id,
          kind: 'service' as const,
          subject: r.service?.subject?.name ?? 'Предмет',
          teacher: r.service?.teacher?.fullName ?? '—',
          counterparty: r.service?.tutor?.name ?? 'Репетитор',
          price: r.price ?? r.service?.price,
          message: r.message ?? undefined,
          createdAt: r.createdAt,
          state,
          label:
            state === 'accepted'
              ? 'Вас записали'
              : state === 'pending'
                ? 'Ждёт ответа'
                : 'Репетитор отказал',
        }
      })

      items.value = [...fromRequests, ...fromServices].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    } catch (e) {
      console.error('Не удалось загрузить мои отклики:', e)
      failed.value = true
    } finally {
      isLoading.value = false
    }
  }

  // три счётчика отвечают на вопрос «где я вообще» за один взгляд
  const pending = computed(() => items.value.filter((i) => i.state === 'pending'))
  const accepted = computed(() => items.value.filter((i) => i.state === 'accepted'))
  const closed = computed(() => items.value.filter((i) => i.state === 'closed'))

  return {
    // State
    items,
    isLoading,
    failed,
    pending,
    accepted,
    closed,

    // Methods
    load,
    waitingLabel,
  }
}
