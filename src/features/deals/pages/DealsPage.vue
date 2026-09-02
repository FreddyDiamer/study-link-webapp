<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useDealsBadge, useOrder, useToast } from '@/shared/composables'
import { reviewService } from '@/services/business'
import { useAuthStore } from '@/stores'
import { useTelegramStore } from '@/stores/telegram'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import { SegmentControl } from '@/shared/components/ui'
import DealCard, { type DealRole } from '../components/DealCard.vue'
import ReviewForm from '../components/ReviewForm.vue'
import { DealStatus, type Deal } from '@/shared/types'

const auth = useAuthStore()
const telegramStore = useTelegramStore()
const { getDeals, acceptDeal, updateDeal, completeDeal, cancelDeal } = useOrder()
const { showToast } = useToast()
const { refresh: refreshDealsBadge } = useDealsBadge()

const ROLES = [
  { id: 'customer', label: 'Я заказчик' },
  { id: 'worker', label: 'Я исполнитель' },
] as const

const role = ref<DealRole>('customer')
const loading = ref(true)
const busy = ref(false)
const deals = ref<Deal[]>([])
// рейтинг уже оставленного мной отзыва, по id сделки
const myRatings = ref<Record<string, number>>({})

// роль в сделке определяется самой сделкой, а не режимом человека
const visibleDeals = computed(() =>
  deals.value.filter((deal) =>
    role.value === 'customer' ? deal.studentId === auth.user?.id : deal.tutorId === auth.user?.id,
  ),
)

const loadMyReview = async (deal: Deal) => {
  if (deal.status !== DealStatus.COMPLETED) return
  try {
    const reviews = await reviewService.getDealReviews(deal.id)
    const mine = reviews.find((r) => r.authorId === auth.user?.id)
    if (mine) myRatings.value[deal.id] = mine.rating
  } catch (e) {
    console.error('Не удалось загрузить отзыв по сделке:', e)
  }
}

const load = async () => {
  loading.value = true
  try {
    const res = await getDeals()
    deals.value = res?.items ?? []
    myRatings.value = {}
    await Promise.all(deals.value.map(loadMyReview))
  } catch (e) {
    console.error('Не удалось загрузить сделки:', e)
  } finally {
    loading.value = false
  }
}

/**
 * В макете статуса три, на бэкенде пять: одна кнопка проводит сделку
 * через промежуточные переходы до «Завершена».
 */
const complete = async (deal: Deal) => {
  if (busy.value) return
  busy.value = true
  telegramStore.hapticFeedback('medium')
  try {
    if (deal.status === DealStatus.PENDING) await acceptDeal(deal.id)
    if (deal.status === DealStatus.PENDING || deal.status === DealStatus.ACCEPTED) {
      await updateDeal(deal.id, { status: DealStatus.IN_PROGRESS })
    }
    await completeDeal(deal.id)
    showToast('Сделка завершена')
    await load()
    await refreshDealsBadge()
  } catch (e) {
    console.error('Не удалось завершить сделку:', e)
  } finally {
    busy.value = false
  }
}

const cancel = async (deal: Deal) => {
  if (busy.value) return
  busy.value = true
  try {
    await cancelDeal(deal.id)
    showToast('Сделка отменена')
    await load()
    await refreshDealsBadge()
  } catch (e) {
    console.error('Не удалось отменить сделку:', e)
  } finally {
    busy.value = false
  }
}

const onReviewed = async () => {
  await load()
}

onMounted(load)
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
          <DealCard :deal="deal" :role="role" :busy="busy" @complete="complete" @cancel="cancel" />
          <ReviewForm
            v-if="deal.status === DealStatus.COMPLETED"
            class="mb-3.5"
            :deal="deal"
            :role="role"
            :existing-rating="myRatings[deal.id]"
            @submitted="onReviewed"
          />
        </div>

        <p v-if="!visibleDeals.length" class="text-center text-d-text-hint text-subhead py-10">
          {{ role === 'customer' ? 'Вы ещё не заказывали занятий' : 'У вас пока нет заказов' }}
        </p>
      </template>
    </div>
  </div>
</template>
