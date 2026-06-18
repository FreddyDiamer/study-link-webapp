<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useService } from '@/shared/composables'
import { reviewService } from '@/services/business'
import { useAuthStore } from '@/stores'
import { useTelegramStore } from '@/stores/telegram'
import { serviceRespondPath } from '@/router/paths'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import AvatarChip from '@/shared/components/AvatarChip.vue'
import ReviewItem from '@/shared/components/ReviewItem.vue'
import ReputationHero from '../components/ReputationHero.vue'
import type { Service, Review } from '@/shared/types'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const telegramStore = useTelegramStore()
const { getService } = useService()

const id = route.params.id as string
const loading = ref(true)
const service = ref<Service | null>(null)
const reviews = ref<Review[]>([])

const formatPrice = (kopeks: number) =>
  `${Math.round(kopeks / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₽`

const rating = computed(() => service.value?.tutor?.rating ?? 0)
const reviewsCount = computed(() => reviews.value.length)
const responsesCount = computed(() => service.value?.responses?.length ?? 0)

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

const recentReviews = computed(() => reviews.value.slice(0, 3))

const responded = computed(
  () => !!service.value?.responses?.some((r) => r.studentId === auth.user?.id),
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

const goRespond = () => {
  telegramStore.hapticFeedback('light')
  router.push(serviceRespondPath(id))
}

onMounted(load)
</script>

<template>
  <div class="flex flex-col h-full">
    <AppHeader title="Репетитор" :sub="service?.subject?.name" back />

    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <span class="w-6 h-6 rounded-full border-2 border-d-border-soft border-t-d-accent animate-d-spin" />
    </div>

    <template v-else-if="service">
      <div class="flex-1 overflow-y-auto px-[18px] pb-[18px]">
        <!-- tutor -->
        <div class="reveal flex items-center gap-3 mb-4">
          <AvatarChip :name="service.tutor?.name" size="lg" />
          <div>
            <div class="text-[18px] font-semibold">{{ service.tutor?.name || 'Репетитор' }}</div>
            <div class="text-caption text-d-text-hint mt-0.5">
              {{ service.subject?.name }} · {{ service.teacher?.fullName }}
            </div>
          </div>
        </div>

        <ReputationHero
          class="mb-3.5"
          :rating="rating"
          :reviews-count="reviewsCount"
          :distribution="distribution"
        />

        <!-- price + responses -->
        <div class="reveal flex gap-3 mb-[18px]" style="animation-delay: 0.1s">
          <div class="flex-1 bg-d-panel border border-d-border rounded-[13px] p-3.5">
            <div class="text-overline uppercase text-d-text-hint mb-1.5">Цена</div>
            <div class="text-price-lg tnum">{{ formatPrice(service.price) }}</div>
          </div>
          <div class="flex-1 bg-d-panel border border-d-border rounded-[13px] p-3.5">
            <div class="text-overline uppercase text-d-text-hint mb-1.5">Откликов</div>
            <div class="text-price-lg tnum">{{ responsesCount }}</div>
          </div>
        </div>

        <!-- reviews -->
        <div class="reveal text-overline uppercase text-d-text-hint mb-3" style="animation-delay: 0.14s">
          Последние отзывы
        </div>
        <div v-if="recentReviews.length" class="flex flex-col gap-2.5">
          <ReviewItem
            v-for="r in recentReviews"
            :key="r.id"
            :author="r.author?.name || 'Аноним'"
            :rating="r.rating"
            :text="r.comment"
          />
        </div>
        <p v-else class="text-subhead text-d-text-hint">Пока нет отзывов</p>
      </div>

      <!-- footer action -->
      <div
        class="shrink-0 px-[18px] pt-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))] bg-d-ink border-t border-d-border"
      >
        <div
          v-if="responded"
          class="h-[52px] rounded-[13px] border-[1.5px] border-d-accent text-d-accent flex items-center justify-center gap-2 text-[15px] font-semibold"
        >
          ✓ Вы откликнулись
        </div>
        <button
          v-else
          class="press w-full h-[52px] rounded-[13px] bg-d-accent text-d-ink text-body font-bold"
          @click="goRespond"
        >
          Откликнуться
        </button>
      </div>
    </template>
  </div>
</template>
