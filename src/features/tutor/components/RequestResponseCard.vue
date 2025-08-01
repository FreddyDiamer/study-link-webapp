<script setup lang="ts">
import { useTelegramStore } from '@/stores/telegram'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import type { RequestResponse } from '@/shared/types'

interface Props {
  response: RequestResponse
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

const getStatusConfig = (status: string) => {
  const configs = {
    PENDING: {
      label: 'Ожидает',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    ACCEPTED: {
      label: 'Принят',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    REJECTED: {
      label: 'Отклонен',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    EXPIRED: {
      label: 'Истек',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  }
  return configs[status as keyof typeof configs] || configs.PENDING
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
        <h3 class="font-semibold text-telegram-text mb-1">
          {{ response.request?.subject?.name || 'Предмет не указан' }}
        </h3>
        <p class="text-sm text-telegram-textSecondary">
          {{ response.request?.teacher?.fullName || 'Преподаватель не указан' }}
        </p>
      </div>

      <div
        :class="[
          'px-2 py-1 rounded-full text-xs font-medium',
          getStatusConfig(response.status).bgColor,
          getStatusConfig(response.status).color,
        ]"
      >
        {{ getStatusConfig(response.status).label }}
      </div>
    </div>

    <!-- Student info -->
    <div class="flex items-center space-x-3 mb-4">
      <div
        class="w-12 h-12 bg-telegram-accent rounded-full flex items-center justify-center text-white font-bold"
      >
        {{ response.request?.student?.name?.charAt(0) || 'С' }}
      </div>
      <div class="flex-1">
        <div class="font-medium text-telegram-text">
          {{ response.request?.student?.name || 'Студент' }}
        </div>
        <div class="text-sm text-telegram-textSecondary">
          @{{ response.request?.student?.telegramUsername || 'username' }}
        </div>
      </div>
      <div class="text-right">
        <div v-if="response.price" class="font-bold text-telegram-accent">
          {{ formatPrice(response.price) }}
        </div>
        <div class="text-xs text-telegram-textSecondary">
          {{ formatDate(response.createdAt) }}
        </div>
      </div>
    </div>

    <!-- Message -->
    <div v-if="response.message" class="mb-4">
      <p class="text-sm text-telegram-text bg-telegram-secondary p-3 rounded-lg">
        {{ response.message }}
      </p>
    </div>

    <!-- Details -->
    <div class="space-y-2 mb-4">
      <div v-if="response.proposedDeadline" class="flex justify-between text-sm">
        <span class="text-telegram-textSecondary">Предложенный дедлайн:</span>
        <span class="text-telegram-text">{{ formatDate(response.proposedDeadline) }}</span>
      </div>

      <div class="flex justify-between text-sm">
        <span class="text-telegram-textSecondary">Отклик отправлен:</span>
        <span class="text-telegram-text">{{ formatDate(response.createdAt) }}</span>
      </div>
    </div>

    <!-- Actions -->
    <div v-if="response.status === 'PENDING'" class="flex space-x-2">
      <Button @click="handleAccept" size="sm" class="flex-1"> Принять </Button>

      <Button @click="handleReject" variant="ghost" size="sm" class="text-telegram-destructive">
        Отклонить
      </Button>
    </div>
  </Card>
</template>
