<script setup lang="ts">
import { useTelegramStore } from '@/stores/telegram'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import { StatusBadge } from '@/shared/components/ui'
import type { ServiceResponse } from '@/shared/types'

interface Props {
  response: ServiceResponse
  onAccept?: (responseId: string) => void
  onReject?: (responseId: string) => void
}

const props = defineProps<Props>()
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

const handleAccept = () => {
  telegramStore.hapticFeedback('light')
  props.onAccept?.(props.response.id)
}

const handleReject = () => {
  telegramStore.hapticFeedback('light')
  props.onReject?.(props.response.id)
}
</script>

<template>
  <Card class="p-4 mb-4">
    <!-- Header -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <h3 class="font-semibold text-d-text mb-1">
          {{ response.service?.subject?.name || 'Предмет не указан' }}
        </h3>
        <p class="text-subhead text-d-text-second">
          {{ response.service?.teacher?.fullName || 'Преподаватель не указан' }}
        </p>
      </div>

      <StatusBadge :response="response.status" />
    </div>

    <!-- Student info -->
    <div class="flex items-center space-x-3 mb-4">
      <div
        class="w-12 h-12 bg-d-accent rounded-full flex items-center justify-center text-d-ink font-bold"
      >
        {{ response.student?.name?.charAt(0) || 'С' }}
      </div>
      <div class="flex-1">
        <div class="font-medium text-d-text">{{ response.student?.name || 'Студент' }}</div>
        <div class="text-subhead text-d-text-second">
          @{{ response.student?.telegramUsername || 'username' }}
        </div>
      </div>
      <div class="text-right">
        <div v-if="response.price" class="font-bold text-d-accent tnum">
          {{ formatPrice(response.price) }}
        </div>
        <div class="text-caption text-d-text-second tnum">
          {{ formatDate(response.createdAt) }}
        </div>
      </div>
    </div>

    <!-- Message -->
    <div v-if="response.message" class="mb-4">
      <p class="text-subhead text-d-text bg-d-surface p-3 rounded-field">
        {{ response.message }}
      </p>
    </div>

    <!-- Details -->
    <div class="space-y-2 mb-4">
      <div v-if="response.proposedDeadline" class="flex justify-between text-subhead">
        <span class="text-d-text-second">Предложенный дедлайн:</span>
        <span class="text-d-text">{{ formatDate(response.proposedDeadline) }}</span>
      </div>

      <div class="flex justify-between text-subhead">
        <span class="text-d-text-second">Отклик получен:</span>
        <span class="text-d-text">{{ formatDate(response.createdAt) }}</span>
      </div>
    </div>

    <!-- Actions -->
    <div v-if="response.status === 'PENDING'" class="flex space-x-2">
      <Button @click="handleAccept" size="sm" class="flex-1"> Принять </Button>

      <Button @click="handleReject" variant="ghost" size="sm" class="text-d-coral">
        Отклонить
      </Button>
    </div>
  </Card>
</template>
