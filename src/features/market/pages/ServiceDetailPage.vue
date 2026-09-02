<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useOrder, useService, useToast } from '@/shared/composables'
import { reviewService } from '@/services/business'
import { useAuthStore } from '@/stores'
import { useTelegramStore } from '@/stores/telegram'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import AvatarChip from '@/shared/components/AvatarChip.vue'
import ReputationHero from '../components/ReputationHero.vue'
import { formatKopeks } from '@/shared/utils'
import type { Review, Service } from '@/shared/types'

const route = useRoute()
const auth = useAuthStore()
const telegramStore = useTelegramStore()
const { getService } = useService()
const { createServiceResponse } = useOrder()
const { showToast } = useToast()

const id = route.params.id as string
const loading = ref(true)
const booking = ref(false)
const booked = ref(false)
const service = ref<Service | null>(null)
const reviews = ref<Review[]>([])

const rating = computed(() => service.value?.tutor?.rating ?? 0)
const reviewsCount = computed(() => service.value?.tutor?.reviewsCount ?? reviews.value.length)

// распределение оценок (ширины полос относительно макс. корзины)
const distribution = computed<number[] | undefined>(() => {
  if (!reviews.value.length) return undefined
  const buckets = [0, 0, 0, 0, 0] // 5★..1★
  reviews.value.forEach((r) => {
    const idx = 5 - Math.round(r.rating)
    if (idx >= 0 && idx < 5) buckets[idx]++
  })
  const max = Math.max(...buckets, 1)
  return buckets.map((c) => Math.round((c / max) * 100))
})

const responded = computed(
  () => booked.value || !!service.value?.responses?.some((r) => r.studentId === auth.user?.id),
)

const load = async () => {
  loading.value = true
  try {
    const s = await getService(id)
    service.value = s
    if (s?.tutor?.id) reviews.value = await reviewService.getUserReviews(s.tutor.id)
  } catch (e) {
    console.error('Не удалось загрузить услугу:', e)
  } finally {
    loading.value = false
  }
}

// в макете запись в одно касание: без формы, отклик уходит сразу
const book = async () => {
  if (booking.value || !auth.user?.id) return
  booking.value = true
  try {
    await createServiceResponse({ studentId: auth.user.id, serviceId: id })
    telegramStore.hapticFeedback('medium')
    booked.value = true
    showToast('Заявка репетитору отправлена')
  } catch (e) {
    console.error('Не удалось записаться:', e)
  } finally {
    booking.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="flex flex-col h-full">
    <AppHeader title="Услуга" :sub="service?.tutor?.name" back />

    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <span
        class="w-6 h-6 rounded-full border-2 border-d-border-soft border-t-d-accent animate-d-spin"
      />
    </div>

    <template v-else-if="service">
      <div class="flex-1 overflow-y-auto px-[18px] pt-4 pb-[18px]">
        <!-- репетитор -->
        <div class="reveal flex items-center gap-3 mb-4">
          <AvatarChip :name="service.tutor?.name" size="lg" />
          <div>
            <div class="text-[17px] font-semibold">{{ service.tutor?.name || 'Репетитор' }}</div>
            <div class="text-caption text-d-text-hint mt-0.5">
              {{ service.subject?.name }} · {{ service.teacher?.fullName }}
            </div>
          </div>
        </div>

        <ReputationHero
          class="mb-4"
          :rating="rating"
          :reviews-count="reviewsCount"
          :distribution="distribution"
        />

        <!-- цена -->
        <div
          class="reveal bg-d-panel border border-d-border rounded-[13px] p-3.5 mb-4"
          style="animation-delay: 0.09s"
        >
          <div class="text-overline uppercase text-d-text-hint mb-1.5">Цена занятия</div>
          <div class="text-[24px] font-bold tnum">{{ formatKopeks(service.price) }}</div>
        </div>

        <template v-if="service.description">
          <div
            class="reveal text-overline uppercase text-d-text-hint mb-2.5"
            style="animation-delay: 0.12s"
          >
            Описание
          </div>
          <p class="reveal text-body text-d-text-bright" style="animation-delay: 0.12s">
            {{ service.description }}
          </p>
        </template>
      </div>

      <div
        class="shrink-0 px-[18px] pt-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))] bg-d-ink border-t border-d-border"
      >
        <div
          v-if="responded"
          class="h-[52px] rounded-[13px] border-[1.5px] border-d-accent text-d-accent flex items-center justify-center gap-2 text-[15px] font-semibold"
        >
          ✓ Заявка отправлена
        </div>
        <button
          v-else
          class="press w-full h-[52px] rounded-[13px] bg-d-accent text-d-ink text-body font-bold disabled:opacity-40"
          :disabled="booking"
          @click="book"
        >
          Записаться
        </button>
      </div>
    </template>
  </div>
</template>
