<script setup lang="ts">
import { useTelegramStore } from '@/stores/telegram'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import type { Request } from '@/shared/types'

interface Props {
  request: Request
  onRespond?: (requestId: string) => void
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

const handleRespond = () => {
  telegramStore.hapticFeedback('light')
  props.onRespond?.(props.request.id)
}

const handleViewDetails = () => {
  telegramStore.hapticFeedback('light')
  // TODO: Добавить навигацию к деталям заявки
  console.log('Просмотр деталей заявки:', props.request.id)
}
</script>

<template>
  <Card class="p-4 mb-4 hover:shadow-lg transition-shadow">
    <!-- Header -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <h3 class="font-semibold text-telegram-text mb-1">
          {{ request.subject?.name || 'Предмет не указан' }}
        </h3>
        <p class="text-sm text-telegram-text-secondary">
          {{ request.teacher?.fullName || 'Преподаватель не указан' }}
        </p>
      </div>

      <div class="text-right">
        <div v-if="request.budget" class="font-bold text-telegram-accent">
          {{ formatPrice(request.budget) }}
        </div>
        <div class="text-xs text-telegram-text-secondary">
          {{ formatDate(request.createdAt) }}
        </div>
      </div>
    </div>

    <!-- Student info -->
    <div class="flex items-center space-x-3 mb-4">
      <div
        class="w-12 h-12 bg-telegram-accent rounded-full flex items-center justify-center text-white font-bold"
      >
        {{ request.student?.name?.charAt(0) || 'С' }}
      </div>
      <div class="flex-1">
        <div class="font-medium text-telegram-text">{{ request.student?.name || 'Студент' }}</div>
        <div class="text-sm text-telegram-text-secondary">
          @{{ request.student?.telegramUsername || 'username' }}
        </div>
      </div>
    </div>

    <!-- Description -->
    <div v-if="request.description" class="mb-4">
      <p class="text-sm text-telegram-text bg-telegram-secondary p-3 rounded-lg">
        {{ request.description }}
      </p>
    </div>

    <!-- Details -->
    <div class="space-y-2 mb-4">
      <div v-if="request.deadline" class="flex justify-between text-sm">
        <span class="text-telegram-text-secondary">Дедлайн:</span>
        <span class="text-telegram-text">{{ formatDate(request.deadline) }}</span>
      </div>

      <div class="flex justify-between text-sm">
        <span class="text-telegram-text-secondary">Заявка создана:</span>
        <span class="text-telegram-text">{{ formatDate(request.createdAt) }}</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex space-x-2">
      <Button @click="handleViewDetails" variant="ghost" size="sm" class="flex-1">
        Подробнее
      </Button>

      <Button @click="handleRespond" size="sm" class="flex-1"> Откликнуться </Button>
    </div>
  </Card>
</template>
