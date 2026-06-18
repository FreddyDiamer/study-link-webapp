<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import { StatusBadge } from '@/shared/components/ui'
import { PATHS } from '@/router/paths'
import type { Deal } from '@/shared/types'

interface Props {
  deal: Deal
  onAccept?: (dealId: string) => void
  onReject?: (dealId: string) => void
  onComplete?: (dealId: string) => void
}

const props = defineProps<Props>()
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

const handleViewDetails = () => {
  telegramStore.hapticFeedback('light')
  router.push(`${PATHS.TUTOR_ORDERS}/${props.deal.id}`)
}

const handleAccept = () => {
  telegramStore.hapticFeedback('light')
  props.onAccept?.(props.deal.id)
}

const handleReject = () => {
  telegramStore.hapticFeedback('light')
  props.onReject?.(props.deal.id)
}

const handleComplete = () => {
  telegramStore.hapticFeedback('light')
  props.onComplete?.(props.deal.id)
}
</script>

<template>
  <Card class="p-4 mb-4">
    <!-- Header -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <h3 class="font-semibold text-d-text mb-1">
          {{ props.deal.subject?.name || 'Предмет не указан' }}
        </h3>
        <p class="text-subhead text-d-text-second">
          Студент: {{ props.deal.student?.name || 'Не указан' }}
        </p>
      </div>

      <StatusBadge :deal="props.deal.status" />
    </div>

    <!-- Details -->
    <div class="space-y-2 mb-4">
      <div class="flex justify-between text-subhead">
        <span class="text-d-text-second">Цена:</span>
        <span class="font-medium text-d-text tnum">
          {{ formatPrice(props.deal.price) }}
        </span>
      </div>

      <div class="flex justify-between text-subhead">
        <span class="text-d-text-second">Создан:</span>
        <span class="text-d-text">
          {{ formatDate(props.deal.createdAt) }}
        </span>
      </div>

      <div v-if="props.deal.deadline" class="flex justify-between text-subhead">
        <span class="text-d-text-second">Дедлайн:</span>
        <span class="text-d-text">
          {{ formatDate(props.deal.deadline) }}
        </span>
      </div>
    </div>

    <!-- Description -->
    <div
      v-if="props.deal.serviceResponse?.message || props.deal.requestResponse?.message"
      class="mb-4"
    >
      <p class="text-subhead text-d-text line-clamp-2">
        {{ props.deal.serviceResponse?.message || props.deal.requestResponse?.message }}
      </p>
    </div>

    <!-- Actions -->
    <div class="flex space-x-2">
      <Button variant="ghost" size="sm" @click="handleViewDetails" class="flex-1">
        Подробнее
      </Button>

      <Button v-if="props.deal.status === 'PENDING'" @click="handleAccept" size="sm" class="flex-1">
        Принять
      </Button>

      <Button
        v-if="props.deal.status === 'PENDING'"
        variant="ghost"
        size="sm"
        @click="handleReject"
        class="text-d-coral"
      >
        Отклонить
      </Button>

      <Button
        v-if="props.deal.status === 'IN_PROGRESS'"
        @click="handleComplete"
        size="sm"
        class="flex-1"
      >
        Завершить
      </Button>
    </div>
  </Card>
</template>
