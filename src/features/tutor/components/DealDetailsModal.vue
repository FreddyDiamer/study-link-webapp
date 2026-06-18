<script setup lang="ts">
import { useTelegramStore } from '@/stores/telegram'
import { Modal, Button, StatusBadge } from '@/shared/components/ui'
import type { Deal } from '@/shared/types'

interface Props {
  deal: Deal | null
  isVisible: boolean
  isAccepting?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isAccepting: false,
})

const emit = defineEmits<{
  'update:isVisible': [value: boolean]
  accept: [dealId: string]
  reject: [dealId: string]
  complete: [dealId: string]
}>()

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

const handleClose = () => {
  emit('update:isVisible', false)
}

const handleAccept = () => {
  if (props.deal) {
    emit('accept', props.deal.id)
  }
}

const handleReject = () => {
  if (props.deal) {
    emit('reject', props.deal.id)
  }
}

const handleComplete = () => {
  if (props.deal) {
    emit('complete', props.deal.id)
  }
}
</script>

<template>
  <Modal :model-value="isVisible" @update:model-value="handleClose" title="Детали заказа">
    <div v-if="deal" class="space-y-6">
      <!-- Student info -->
      <div class="flex items-center space-x-4">
        <div
          class="w-16 h-16 bg-d-accent rounded-full flex items-center justify-center text-d-ink text-title-m font-bold"
        >
          {{ deal.student?.name?.charAt(0) || 'С' }}
        </div>
        <div class="flex-1">
          <h3 class="text-title-m font-semibold text-d-text">
            {{ deal.student?.name || 'Студент' }}
          </h3>
          <p class="text-subhead text-d-text-second">
            @{{ deal.student?.telegramUsername || 'username' }}
          </p>
        </div>
        <div class="text-right">
          <div class="text-title-l font-bold text-d-accent tnum">
            {{ formatPrice(deal.price) }}
          </div>
        </div>
      </div>

      <!-- Deal details -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-subhead text-d-text-second">Предмет:</span>
          <span class="font-medium text-d-text">
            {{ deal.subject?.name || 'Не указан' }}
          </span>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-subhead text-d-text-second">Преподаватель:</span>
          <span class="font-medium text-d-text">
            {{ deal.teacher?.fullName || 'Не указан' }}
          </span>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-subhead text-d-text-second">Статус:</span>
          <StatusBadge :deal="deal.status" />
        </div>

        <div class="flex items-center justify-between">
          <span class="text-subhead text-d-text-second">Создан:</span>
          <span class="text-d-text">{{ formatDate(deal.createdAt) }}</span>
        </div>

        <div v-if="deal.deadline" class="flex items-center justify-between">
          <span class="text-subhead text-d-text-second">Дедлайн:</span>
          <span class="text-d-text">{{ formatDate(deal.deadline) }}</span>
        </div>
      </div>

      <!-- Description -->
      <div v-if="deal.serviceResponse?.message || deal.requestResponse?.message">
        <h4 class="font-medium text-d-text mb-2">Описание:</h4>
        <p class="text-subhead text-d-text-second bg-d-surface p-3 rounded-field">
          {{ deal.serviceResponse?.message || deal.requestResponse?.message }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex space-x-3 pt-4">
        <Button
          v-if="deal.status === 'PENDING'"
          @click="handleAccept"
          :loading="isAccepting"
          class="flex-1"
        >
          Принять заказ
        </Button>

        <Button
          v-if="deal.status === 'PENDING'"
          @click="handleReject"
          variant="ghost"
          :disabled="isAccepting"
        >
          Отклонить
        </Button>

        <Button v-if="deal.status === 'IN_PROGRESS'" @click="handleComplete" class="flex-1">
          Завершить
        </Button>

        <Button
          v-if="deal.status !== 'PENDING' && deal.status !== 'IN_PROGRESS'"
          @click="handleClose"
          class="flex-1"
        >
          Закрыть
        </Button>
      </div>
    </div>
  </Modal>
</template>
