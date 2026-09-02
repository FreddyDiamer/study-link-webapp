import { readonly, ref } from 'vue'
import { orderService } from '@/services/business'
import { DealStatus } from '@/shared/types'

/**
 * Счётчик активных сделок для бейджа на табе «Сделки» (в макете — красный кружок).
 * Состояние модульное: BottomNav читает, экраны дёргают refresh() после действий над сделкой.
 */
const activeCount = ref(0)

export const useDealsBadge = () => {
  const refresh = async () => {
    try {
      const response = await orderService.getDeals()
      activeCount.value = (response?.items ?? []).filter(
        (deal) => deal.status === DealStatus.IN_PROGRESS,
      ).length
    } catch {
      // бейдж — вспомогательный элемент, молча оставляем прежнее значение
    }
  }

  return {
    // State
    activeCount: readonly(activeCount),

    // Methods
    refresh,
  }
}
