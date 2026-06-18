<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import { StatusBadge } from '@/shared/components/ui'
import type { Deal } from '@/shared/types'

interface Props {
  deal: Deal
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
})

const router = useRouter()
const telegramStore = useTelegramStore()

const formatPrice = (price: number) => {
  return `${price} ₽`
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const handleContactTutor = () => {
  telegramStore.hapticFeedback('light')
  // TODO: Добавить логику связи с репетитором
  console.log('Связаться с репетитором:', props.deal.tutorId)
}

const handleCancelDeal = () => {
  telegramStore.hapticFeedback('light')
  // TODO: Добавить логику отмены сделки
  console.log('Отменить сделку:', props.deal.id)
}

const handleLeaveReview = () => {
  telegramStore.hapticFeedback('light')
  router.push(`/student/reviews/create?dealId=${props.deal.id}`)
}
</script>

<template>
  <Card class="p-4 mb-4">
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <h3 class="font-semibold text-d-text mb-1">
          {{ deal.subject?.name || 'Предмет не указан' }}
        </h3>
        <p class="text-subhead text-d-text-second">
          {{ deal.teacher?.fullName || 'Преподаватель не указан' }}
        </p>
      </div>

      <div class="flex flex-col items-end gap-1">
        <div class="font-bold text-d-accent text-title-m tnum">
          {{ formatPrice(deal.price) }}
        </div>
        <StatusBadge :deal="deal.status" />
      </div>
    </div>

    <!-- Tutor info -->
    <div class="flex items-center space-x-3 mb-4">
      <div
        class="w-12 h-12 bg-d-accent rounded-full flex items-center justify-center text-d-ink font-bold"
      >
        {{ deal.tutor?.name?.charAt(0) || 'Р' }}
      </div>
      <div class="flex-1">
        <div class="font-medium text-d-text">{{ deal.tutor?.name || 'Репетитор' }}</div>
        <div class="text-subhead text-d-text-second">
          @{{ deal.tutor?.telegramUsername || 'username' }}
        </div>
      </div>
    </div>

    <!-- Deal details -->
    <div class="space-y-2 mb-4">
      <div class="flex justify-between text-subhead">
        <span class="text-d-text-second">Создано:</span>
        <span class="text-d-text">{{ formatDate(deal.createdAt) }}</span>
      </div>

      <div v-if="deal.deadline" class="flex justify-between text-subhead">
        <span class="text-d-text-second">Дедлайн:</span>
        <span class="text-d-text">{{ formatDate(deal.deadline) }}</span>
      </div>

      <div class="flex justify-between text-subhead">
        <span class="text-d-text-second">Обновлено:</span>
        <span class="text-d-text">{{ formatDate(deal.updatedAt) }}</span>
      </div>
    </div>

    <!-- Actions -->
    <div v-if="showActions" class="flex space-x-2">
      <Button
        v-if="deal.status === 'IN_PROGRESS'"
        @click="handleContactTutor"
        size="sm"
        class="flex-1"
      >
        Связаться
      </Button>

      <Button
        v-if="deal.status === 'PENDING' || deal.status === 'ACCEPTED'"
        @click="handleCancelDeal"
        variant="ghost"
        size="sm"
        class="text-d-coral"
      >
        Отменить
      </Button>

      <Button
        v-if="deal.status === 'COMPLETED' && !deal.review"
        @click="handleLeaveReview"
        size="sm"
        class="flex-1"
      >
        Оставить отзыв
      </Button>
    </div>
  </Card>
</template>
