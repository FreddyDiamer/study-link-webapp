<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/shared/components/ui'
import { ArrowIcon } from '@/shared/components/icons'
import { Card } from '@/shared/components/ui'
import { Rating } from '@/shared/components/ui'
import { useDealDetails } from './hooks'
import { reviewService } from '@/services/business'

const router = useRouter()

const {
  deal,
  isLoading,
  error,
  subjectName,
  teacherName,
  studentName,
  statusLabel,
  formatPrice,
  formatDate,
  handleBack,
  handleStartLesson,
  handleComplete,
  loadDeal,
} = useDealDetails()

const showReplyForm = ref(false)
const replyDraft = ref('')
const isSavingReply = ref(false)

const dealReview = computed(() => deal.value?.review ?? null)

function startEditReply() {
  replyDraft.value = dealReview.value?.reply ?? ''
  showReplyForm.value = true
}

function cancelReplyForm() {
  showReplyForm.value = false
  replyDraft.value = ''
}

async function saveReply() {
  const review = dealReview.value
  if (!review?.id) return
  isSavingReply.value = true
  try {
    await reviewService.setReviewReply(review.id, replyDraft.value.trim() || null)
    await loadDeal()
    showReplyForm.value = false
    replyDraft.value = ''
  } finally {
    isSavingReply.value = false
  }
}

async function deleteReply() {
  const review = dealReview.value
  if (!review?.id) return
  try {
    await reviewService.setReviewReply(review.id, null)
    await loadDeal()
  } catch (_) {}
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
          <p class="text-telegram-textSecondary text-sm mb-1">Студент</p>
          <button
            v-if="deal.studentId"
            type="button"
            class="text-telegram-accent font-medium hover:underline text-left"
            @click="router.push(`/user/${deal.studentId}?view=student`)"
          >
            {{ studentName }} →
          </button>
          <p v-else class="text-telegram-text font-medium">{{ studentName }}</p>
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
      <div class="space-y-3">
        <Button
          v-if="deal.status === 'PENDING' || deal.status === 'ACCEPTED'"
          class="w-full bg-telegram-success hover:bg-telegram-success/90 text-white"
          @click="handleStartLesson"
        >
          Провожу занятие
        </Button>
        <Button
          v-if="deal.status === 'IN_PROGRESS'"
          class="w-full bg-telegram-secondary text-telegram-text hover:bg-telegram-secondary/80"
          @click="handleComplete"
        >
          Закончить
        </Button>
      </div>

      <!-- Отзыв студента и ответ репетитора -->
      <div v-if="deal.status === 'COMPLETED' && dealReview" class="mt-6 space-y-4">
        <h3 class="text-telegram-text font-semibold">Отзыв студента</h3>
        <Card class="p-6">
          <div class="flex items-center gap-3 mb-3">
            <Rating :rating="dealReview.rating" size="md" :show-count="false" readonly />
            <span class="text-telegram-textSecondary text-sm">
              {{ new Date(dealReview.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }) }}
            </span>
          </div>
          <p v-if="dealReview.comment" class="text-telegram-text text-sm">{{ dealReview.comment }}</p>
        </Card>

        <h3 class="text-telegram-text font-semibold">Ваш ответ</h3>
        <Card v-if="!showReplyForm" class="p-6">
          <p v-if="dealReview.reply" class="text-telegram-text text-sm mb-4">{{ dealReview.reply }}</p>
          <p v-else class="text-telegram-textSecondary text-sm mb-4">Ответ на отзыв ещё не оставлен.</p>
          <div class="flex gap-2">
            <Button size="sm" class="bg-telegram-success hover:bg-telegram-success/90 text-white" @click="startEditReply">
              {{ dealReview.reply ? 'Изменить' : 'Оставить ответ' }}
            </Button>
            <Button
              v-if="dealReview.reply"
              size="sm"
              variant="ghost"
              class="text-telegram-destructive"
              @click="deleteReply"
            >
              Удалить ответ
            </Button>
          </div>
        </Card>
        <Card v-else class="p-6">
          <textarea
            v-model="replyDraft"
            rows="4"
            placeholder="Напишите ответ на отзыв..."
            class="w-full px-4 py-3 bg-telegram-secondary border border-telegram-border rounded-xl text-telegram-text placeholder-telegram-textSecondary focus:outline-none focus:border-telegram-accent resize-none mb-3"
          />
          <div class="flex gap-2">
            <Button size="sm" :disabled="isSavingReply" @click="saveReply">Сохранить</Button>
            <Button size="sm" variant="ghost" :disabled="isSavingReply" @click="cancelReplyForm">Отмена</Button>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>
