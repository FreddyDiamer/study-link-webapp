<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/shared/components/ui'
import { ArrowIcon } from '@/shared/components/icons'
import { Card } from '@/shared/components/ui'
import { Rating } from '@/shared/components/ui'
import CreateReviewForm from '@/shared/components/CreateReviewForm.vue'
import { useDealDetails } from './hooks'
import { reviewService } from '@/services/business'
import { useAuthStore } from '@/stores/auth'
import { UserRole } from '@/shared/types'

const router = useRouter()
const authStore = useAuthStore()
const {
  deal,
  isLoading,
  error,
  subjectName,
  teacherName,
  tutorName,
  statusLabel,
  formatPrice,
  formatDate,
  handleBack,
  handleStartLesson,
  loadDeal,
  myReview,
} = useDealDetails()

async function handleReviewSubmit(payload: { rating: number; comment: string }) {
  if (!deal.value?.id || !authStore.user?.id) return
  await reviewService.createReview({
    dealId: deal.value.id,
    authorId: authStore.user.id,
    targetId: deal.value.tutorId,
    targetRole: UserRole.TUTOR,
    rating: payload.rating,
    comment: payload.comment || undefined,
  })
  await loadDeal()
}

async function handleDeleteReview() {
  if (!myReview.value?.id) return
  await reviewService.deleteReview(myReview.value.id)
  await loadDeal()
}
</script>

<template>
  <div class="min-h-screen bg-telegram-bg pt-6">
    <div class="px-4 mb-6">
      <div class="flex items-center">
        <Button variant="ghost" @click="handleBack" class="!p-2">
          <ArrowIcon class="w-5 h-5 rotate-90" />
        </Button>
        <h1 class="text-lg font-semibold text-telegram-text">Детали занятия</h1>
      </div>
    </div>
    <div v-if="isLoading" class="flex justify-center py-16">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-telegram-button"></div>
    </div>
    <div v-else-if="error" class="px-4">
      <div class="p-6 text-center">
        <div class="text-telegram-destructive mb-4">{{ error }}</div>
        <Button @click="loadDeal">Попробовать снова</Button>
      </div>
    </div>
    <div v-else-if="deal" class="px-4 space-y-6">
      <Card class="p-6">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h2 class="text-xl font-semibold text-telegram-text">{{ subjectName }}</h2>
            <p class="text-telegram-textSecondary">{{ teacherName }}</p>
          </div>
          <span class="px-2 py-1 text-xs font-medium rounded-full bg-telegram-secondary text-telegram-text">
            {{ statusLabel }}
          </span>
        </div>
        <div class="mb-4">
          <p class="text-telegram-textSecondary text-sm mb-1">Репетитор</p>
          <button
            v-if="deal.tutorId"
            type="button"
            class="text-telegram-accent font-medium hover:underline text-left"
            @click="router.push(`/user/${deal.tutorId}?view=tutor`)"
          >
            {{ tutorName }} →
          </button>
          <p v-else class="text-telegram-text font-medium">{{ tutorName }}</p>
        </div>
        <div class="mb-4">
          <p class="text-telegram-textSecondary text-sm mb-1">Стоимость</p>
          <p class="text-telegram-accent font-semibold text-lg">{{ formatPrice(deal.price) }}</p>
        </div>
        <div>
          <p class="text-telegram-textSecondary text-sm mb-1">Дата создания</p>
          <p class="text-telegram-text">{{ formatDate(deal.createdAt) }}</p>
        </div>
      </Card>
      <div v-if="deal.status === 'IN_PROGRESS' || deal.status === 'ACCEPTED'" class="space-y-3">
        <Button class="w-full" @click="handleStartLesson">
          {{ deal.status === 'IN_PROGRESS' ? 'Продолжить в Telegram' : 'Начать урок (написать репетитору)' }}
        </Button>
      </div>
      <div v-if="deal.status === 'COMPLETED' && myReview" class="mt-6">
        <h3 class="text-telegram-text font-semibold mb-3">Ваш отзыв</h3>
        <Card class="p-6">
          <div class="flex items-center gap-3 mb-3">
            <Rating :rating="myReview.rating" size="md" :show-count="false" readonly />
            <span class="text-telegram-textSecondary text-sm">
              {{ new Date(myReview.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }) }}
            </span>
          </div>
          <p v-if="myReview.comment" class="text-telegram-text text-sm mb-4">{{ myReview.comment }}</p>
          <p v-if="myReview.reply" class="text-telegram-textSecondary text-sm border-l-4 border-telegram-secondary pl-3 mb-4">
            <span class="font-medium text-telegram-text">Ответ репетитора:</span> {{ myReview.reply }}
          </p>
          <Button size="sm" variant="ghost" class="text-telegram-destructive" @click="handleDeleteReview">
            Удалить отзыв
          </Button>
        </Card>
      </div>
      <div v-else-if="deal.status === 'COMPLETED'" class="mt-6">
        <h3 class="text-telegram-text font-semibold mb-3">Оставить отзыв</h3>
        <CreateReviewForm
          :deal-id="deal.id"
          :target-id="deal.tutorId"
          target-role="TUTOR"
          :on-submit="handleReviewSubmit"
        />
      </div>
    </div>
  </div>
</template>
