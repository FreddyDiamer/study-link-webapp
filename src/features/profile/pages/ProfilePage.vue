<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { userService, reviewService } from '@/services/business'
import { useAuthStore } from '@/stores'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import AvatarChip from '@/shared/components/AvatarChip.vue'
import ReviewItem from '@/shared/components/ReviewItem.vue'
import type { User, Review } from '@/shared/types'

const auth = useAuthStore()
const loading = ref(true)
const profile = ref<User | null>(null)
const reviews = ref<Review[]>([])

const formatPrice = (kopeks: number) =>
  `${Math.round(kopeks / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₽`

const rating = computed(() => profile.value?.rating ?? 0)
const stars = computed(() => {
  const f = Math.round(rating.value)
  return '★★★★★'.slice(0, f) + '☆☆☆☆☆'.slice(0, 5 - f)
})
const recentReviews = computed(() => reviews.value.slice(0, 3))

const load = async () => {
  loading.value = true
  try {
    const me = await userService.getProfile()
    profile.value = me
    if (me?.id) reviews.value = await reviewService.getUserReviews(me.id)
  } catch (e) {
    console.error('Не удалось загрузить профиль:', e)
    profile.value = (auth.user as User) ?? null
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="flex flex-col h-full">
    <AppHeader title="Профиль" />
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <span class="w-6 h-6 rounded-full border-2 border-d-border-soft border-t-d-accent animate-d-spin" />
    </div>

    <div v-else-if="profile" class="flex-1 overflow-y-auto px-[18px] pt-3.5 pb-[18px]">
      <!-- identity -->
      <div class="reveal flex items-center gap-3.5 mb-[18px]">
        <AvatarChip :name="profile.name" size="xl" />
        <div>
          <div class="text-title-l">{{ profile.name }}</div>
          <div class="text-caption text-d-text-hint mt-0.5">
            <span v-if="profile.telegramUsername">@{{ profile.telegramUsername }}</span>
            <span v-if="profile.group?.number"> · Группа {{ profile.group.number }}</span>
          </div>
        </div>
      </div>

      <!-- reputation hero -->
      <div
        class="reveal bg-d-panel border border-d-border rounded-sheet p-[18px] mb-4"
        style="animation-delay: 0.05s"
      >
        <div class="flex items-end gap-3 mb-3.5">
          <div class="text-[40px] font-bold text-d-rating leading-[0.9] tnum">
            {{ rating.toFixed(1) }}
          </div>
          <div class="pb-1">
            <div class="text-d-rating text-subhead tracking-[2px]">{{ stars }}</div>
            <div class="text-[12px] text-d-text-hint mt-0.5">
              {{ reviews.length }} отзывов о вас
            </div>
          </div>
        </div>

        <ReviewItem
          v-for="r in recentReviews"
          :key="r.id"
          bare
          :author="r.author?.name || 'Аноним'"
          :rating="r.rating"
          :text="r.comment"
        />
        <p v-if="!reviews.length" class="text-subhead text-d-text-hint">Пока нет отзывов</p>
      </div>

      <!-- balance -->
      <div
        class="reveal flex items-center justify-between bg-d-panel border border-d-border rounded-[14px] p-4"
        style="animation-delay: 0.1s"
      >
        <span class="text-subhead text-d-text-second">Баланс</span>
        <span class="text-[20px] font-bold tnum">{{ formatPrice(profile.balance ?? 0) }}</span>
      </div>
    </div>
  </div>
</template>
