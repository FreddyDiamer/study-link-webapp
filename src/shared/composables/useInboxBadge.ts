import { readonly, ref } from 'vue'
import { orderService, serviceService } from '@/services/business'
import {
  RequestStatus,
  ResponseStatus,
  ServiceStatus,
  type Request,
  type Service,
} from '@/shared/types'
import { pluralize } from '@/shared/utils'

/** Отклики, по которым владелец ещё не принял решение. */
export const countPending = (responses?: { status: ResponseStatus }[]) =>
  (responses ?? []).filter((r) => r.status === ResponseStatus.PENDING).length

// ответа ждут только на живом объекте: закрытая заявка и скрытая услуга уже никого не держат
export const pendingOnRequest = (request: Request) =>
  request.status === RequestStatus.OPEN ? countPending(request.responses) : 0

export const pendingOnService = (service: Service) =>
  service.status === ServiceStatus.ACTIVE ? countPending(service.responses) : 0

/** «1 ждёт ответа», «3 ждут ответа» */
export const pendingLabel = (count: number) =>
  `${count} ${pluralize(count, 'ждёт', 'ждут', 'ждут')} ответа`

/**
 * Счётчик входящих откликов, ждущих решения, для бейджа на табе «Профиль».
 * Состояние модульное: BottomNav читает, экраны дёргают refresh() после решения по отклику.
 */
const pendingCount = ref(0)

export const useInboxBadge = () => {
  /** Профиль уже загрузил свои заявки и услуги — считаем по ним, без второго запроса. */
  const sync = (requests: Request[], services: Service[]) => {
    pendingCount.value =
      requests.reduce((sum, r) => sum + pendingOnRequest(r), 0) +
      services.reduce((sum, s) => sum + pendingOnService(s), 0)
  }

  const refresh = async () => {
    try {
      const [requests, services] = await Promise.all([
        orderService.getMyRequests(),
        serviceService.getMyServices(),
      ])
      sync(requests?.items ?? [], services?.items ?? [])
    } catch {
      // бейдж — вспомогательный элемент, молча оставляем прежнее значение
    }
  }

  return {
    // State
    pendingCount: readonly(pendingCount),

    // Methods
    sync,
    refresh,
  }
}
