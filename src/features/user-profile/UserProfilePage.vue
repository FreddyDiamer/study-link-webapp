<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Card from '@/shared/components/ui/Card.vue'
import ReviewCard from '@/shared/components/ReviewCard.vue'
import { Rating } from '@/shared/components/ui'
import { usersApi } from '@/services/api/users'
import { reviewsApi } from '@/services/api/reviews'
import type { User, Review } from '@/shared/types'

interface UserStats {
  activeServices: number
  completedAsDealer: number
  openRequests: number
  completedAsStudent: number
  averageRating: number
  totalReviews: number
  hasServices: boolean
  hasRequests: boolean
}

const route = useRoute()
const userId = computed(() => route.params.id as string)

const view = ref<'tutor' | 'student'>('tutor')
const user = ref<User | null>(null)
const stats = ref<UserStats | null>(null)
const reviews = ref<Review[]>([])
const reviewStats = ref<{ totalReviews: number; averageRating: number } | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const targetRole = computed(() => (view.value === 'tutor' ? 'TUTOR' : 'STUDENT'))

async function loadUser() {
  if (!userId.value) return
  loading.value = true
  error.value = null
  try {
    const [userRes, statsRes] = await Promise.all([
      usersApi.getUser(userId.value),
      usersApi.getUserStats(userId.value),
    ])
    user.value = userRes as User & { services?: unknown[]; requests?: unknown[] }
    stats.value = statsRes as UserStats
    view.value =
      (route.query.view as 'tutor' | 'student') ||
      (stats.value?.hasServices ? 'tutor' : 'student')
    await loadReviewsForView()
  } catch (e: unknown) {
    error.value = (e as { message?: string })?.message || 'Не удалось загрузить профиль'
  } finally {
    loading.value = false
  }
}

async function loadReviewsForView() {
  if (!userId.value) return
  const role = targetRole.value
  try {
    const [reviewsRes, statsRes] = await Promise.all([
      reviewsApi.getByTarget(userId.value, role),
      reviewsApi.getTargetStats(userId.value, role),
    ])
    reviews.value = reviewsRes.items || []
    reviewStats.value = {
      totalReviews: statsRes.totalReviews,
      averageRating: statsRes.averageRating,
    }
  } catch {
    reviews.value = []
    reviewStats.value = null
  }
}

const statsList = computed(() => {
  const s = stats.value
  const rs = reviewStats.value
  if (!s) return []
  const reviewsCount = rs?.totalReviews ?? s.totalReviews
  const rating = rs?.averageRating ?? s.averageRating
  if (view.value === 'tutor') {
    return [
      { label: 'Активных услуг', value: s.activeServices, icon: '📚' },
      { label: 'Завершённых сделок', value: s.completedAsDealer, icon: '✅' },
      { label: 'Отзывов', value: reviewsCount, icon: '💬' },
      { label: 'Рейтинг', value: rating.toFixed(1), icon: '⭐' },
    ]
  }
  return [
    { label: 'Активных заявок', value: s.openRequests, icon: '📋' },
    { label: 'Завершённых сделок', value: s.completedAsStudent, icon: '✅' },
    { label: 'Отзывов', value: reviewsCount, icon: '💬' },
    { label: 'Рейтинг', value: rating.toFixed(1), icon: '⭐' },
  ]
})

watch(userId, loadUser, { immediate: false })
watch(view, loadReviewsForView)
onMounted(loadUser)
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <div v-if="loading" class="text-center py-12 text-telegram-textSecondary">
      Загрузка профиля...
    </div>
    <div v-else-if="error" class="text-center py-12">
      <p class="text-telegram-destructive">{{ error }}</p>
    </div>
    <template v-else-if="user">
      <!-- Header -->
      <Card class="p-6 mb-4">
        <div class="flex items-center space-x-4">
          <div
            class="w-16 h-16 bg-telegram-secondary rounded-full flex items-center justify-center text-telegram-text text-xl font-bold"
          >
            {{ user.name?.charAt(0) || 'П' }}
          </div>
          <div class="flex-1">
            <h1 class="text-xl font-semibold text-telegram-text">
              {{ user.name }}
            </h1>
            <p class="text-sm text-telegram-textSecondary">
              @{{ user.telegramUsername }}
            </p>
            <p v-if="user.description" class="text-sm text-telegram-text mt-2">
              {{ user.description }}
            </p>
          </div>
        </div>
      </Card>

      <!-- View toggle -->
      <div class="flex rounded-xl bg-telegram-secondary p-1 mb-4">
        <button
          type="button"
          class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="
            view === 'tutor'
              ? 'bg-telegram-bg text-telegram-text shadow'
              : 'text-telegram-textSecondary'
          "
          @click="view = 'tutor'"
        >
          Как преподаватель
        </button>
        <button
          type="button"
          class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="
            view === 'student'
              ? 'bg-telegram-bg text-telegram-text shadow'
              : 'text-telegram-textSecondary'
          "
          @click="view = 'student'"
        >
          Как студент
        </button>
      </div>

      <!-- Stats -->
      <Card class="p-4 mb-4">
        <h2 class="font-medium text-telegram-text mb-3">Статистика</h2>
        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="item in statsList"
            :key="item.label"
            class="flex items-center space-x-2 p-2 rounded-lg bg-telegram-secondary"
          >
            <span class="text-lg">{{ item.icon }}</span>
            <div>
              <div class="text-xs text-telegram-textSecondary">{{ item.label }}</div>
              <div class="font-semibold text-telegram-text">{{ item.value }}</div>
            </div>
          </div>
        </div>
      </Card>

      <!-- Rating summary (по выбранной роли) -->
      <div
        v-if="reviewStats && reviewStats.totalReviews > 0"
        class="flex items-center gap-2 mb-4"
      >
        <Rating
          :rating="reviewStats.averageRating"
          size="sm"
          :reviews-count="reviewStats.totalReviews"
          readonly
        />
        <span class="text-sm text-telegram-textSecondary">
          {{ view === 'tutor' ? 'как репетитор' : 'как студент' }}
        </span>
      </div>

      <!-- Reviews (по выбранной роли) -->
      <h2 class="font-medium text-telegram-text mb-3">
        Отзывы {{ view === 'tutor' ? 'как репетитор' : 'как студент' }}
      </h2>
      <div v-if="reviews.length === 0" class="py-6">
        <Card class="p-6 text-center">
          <p class="text-telegram-textSecondary">
            Пока нет отзывов {{ view === 'tutor' ? 'как о репетиторе' : 'как о студенте' }}.
          </p>
        </Card>
      </div>
      <div v-else class="space-y-3">
        <ReviewCard v-for="r in reviews" :key="r.id" :review="r" />
      </div>
    </template>
  </div>
</template>
