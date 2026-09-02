<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useDealsBadge, useOrder, useToast } from '@/shared/composables'
import { useAuthStore } from '@/stores'
import { useTelegramStore } from '@/stores/telegram'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import { SegmentControl } from '@/shared/components/ui'
import DealCard, { type DealRole } from '../components/DealCard.vue'
import DealReviews from '../components/DealReviews.vue'
import CancelSheet from '../components/CancelSheet.vue'
import { DealStatus, type Deal } from '@/shared/types'

const auth = useAuthStore()
const telegramStore = useTelegramStore()
const { getDeals, completeDeal, cancelDeal, reopenDeal } = useOrder()
const { showToast } = useToast()
const { refresh: refreshDealsBadge } = useDealsBadge()

const ROLES = [
  { id: 'customer', label: 'Я заказчик' },
  { id: 'worker', label: 'Я исполнитель' },
] as const

const CONTACTED_KEY = 'sl:contacted-deals'

const role = ref<DealRole>('customer')
const loading = ref(false)
const busy = ref(false)
const deals = ref<Deal[]>([])
const cancelSheet = ref(false)
const dealToCancel = ref<Deal | null>(null)
// сделки, по которым уже открывали переписку: после этого главным становится
// подтверждение, а не кнопка «Написать»
const contacted = ref<string[]>([])

// роль в сделке определяется самой сделкой, а не режимом человека
const visibleDeals = computed(() =>
  deals.value.filter((deal) =>
    role.value === 'customer' ? deal.studentId === auth.user?.id : deal.tutorId === auth.user?.id,
  ),
)

const readContacted = () => {
  try {
    const raw = localStorage.getItem(CONTACTED_KEY)
    contacted.value = raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    contacted.value = []
  }
}

const markContacted = (deal: Deal) => {
  if (contacted.value.includes(deal.id)) return
  contacted.value = [...contacted.value, deal.id]
  try {
    localStorage.setItem(CONTACTED_KEY, JSON.stringify(contacted.value))
  } catch {
    // приватный режим — потеряем только приоритет кнопок
  }
}

const load = async () => {
  loading.value = true
  try {
    const res = await getDeals()
    deals.value = res?.items ?? []
  } catch (e) {
    console.error('Не удалось загрузить сделки:', e)
  } finally {
    loading.value = false
  }
}

/**
 * Подтверждение со своей стороны. Сделку закрывает бэкенд, когда отметились обе:
 * в одиночку рейтинг себе не нарисуешь.
 */
const confirm = async (deal: Deal) => {
  if (busy.value) return
  busy.value = true
  telegramStore.hapticFeedback('medium')
  try {
    const updated = await completeDeal(deal.id)
    showToast(
      updated?.status === DealStatus.COMPLETED
        ? 'Сделка завершена'
        : 'Ждём подтверждения второй стороны',
    )
    await load()
    await refreshDealsBadge()
  } catch (e) {
    console.error('Не удалось подтвердить выполнение:', e)
  } finally {
    busy.value = false
  }
}

// работа ещё не готова: снимаем подтверждение второй стороны и останавливаем таймер
const reopen = async (deal: Deal) => {
  if (busy.value) return
  busy.value = true
  try {
    await reopenDeal(deal.id)
    showToast('Сделка снова в работе')
    await load()
    await refreshDealsBadge()
  } catch (e) {
    console.error('Не удалось вернуть сделку в работу:', e)
  } finally {
    busy.value = false
  }
}

const askCancel = (deal: Deal) => {
  dealToCancel.value = deal
  cancelSheet.value = true
}

const cancel = async (reason: string) => {
  const deal = dealToCancel.value
  dealToCancel.value = null
  if (!deal || busy.value) return
  busy.value = true
  try {
    await cancelDeal(deal.id, reason)
    showToast('Сделка отменена')
    await load()
    await refreshDealsBadge()
  } catch (e) {
    console.error('Не удалось отменить сделку:', e)
  } finally {
    busy.value = false
  }
}

onMounted(() => {
  readContacted()
  load()
})
</script>

<template>
  <div class="flex flex-col h-full">
    <AppHeader title="Сделки" sub="Ваши активные занятия" />

    <div class="shrink-0 px-[18px] pt-3.5 pb-2.5">
      <SegmentControl v-model="role" :items="ROLES" />
    </div>

    <div class="flex-1 overflow-y-auto px-[18px] pt-1.5 pb-[18px]">
      <div v-if="loading" class="flex items-center justify-center py-16">
        <span
          class="w-6 h-6 rounded-full border-2 border-d-border-soft border-t-d-accent animate-d-spin"
        />
      </div>

      <template v-else>
        <div v-for="deal in visibleDeals" :key="deal.id">
          <DealCard
            :deal="deal"
            :role="role"
            :busy="busy"
            :contacted="contacted.includes(deal.id)"
            @confirm="confirm"
            @cancel="askCancel"
            @contact="markContacted"
            @reopen="reopen"
          />
          <DealReviews
            v-if="deal.status === DealStatus.COMPLETED"
            class="mb-3.5"
            :deal="deal"
            :role="role"
            @submitted="load"
          />
        </div>

        <p v-if="!visibleDeals.length" class="text-center text-d-text-hint text-subhead py-10">
          {{ role === 'customer' ? 'Вы ещё не заказывали занятий' : 'У вас пока нет заказов' }}
        </p>
      </template>
    </div>

    <CancelSheet v-model="cancelSheet" @pick="cancel" />
  </div>
</template>
