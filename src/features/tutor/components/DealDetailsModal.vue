<script setup lang="ts">
import { computed } from 'vue'
import { useTelegramStore } from '@/stores/telegram'
import { Modal, Button } from '@/shared/components/ui'
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

const statusConfig = computed(() => {
  if (!props.deal) return null

  const configs = {
    PENDING: {
      label: 'Ожидает',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    ACCEPTED: {
      label: 'Принят',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    IN_PROGRESS: {
      label: 'В работе',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    COMPLETED: {
      label: 'Завершен',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    CANCELLED: {
      label: 'Отменен',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  }
  return configs[props.deal.status] || configs.PENDING
})

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
          class="w-16 h-16 bg-telegram-accent rounded-full flex items-center justify-center text-white text-xl font-bold"
        >
          {{ deal.student?.name?.charAt(0) || 'С' }}
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-telegram-text">
            {{ deal.student?.name || 'Студент' }}
          </h3>
          <p class="text-sm text-telegram-textSecondary">
            @{{ deal.student?.telegramUsername || 'username' }}
          </p>
        </div>
        <div class="text-right">
          <div class="text-2xl font-bold text-telegram-accent">
            {{ formatPrice(deal.price) }}
          </div>
        </div>
      </div>

      <!-- Deal details -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-sm text-telegram-textSecondary">Предмет:</span>
          <span class="font-medium text-telegram-text">
            {{ deal.subject?.name || 'Не указан' }}
          </span>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-sm text-telegram-textSecondary">Преподаватель:</span>
          <span class="font-medium text-telegram-text">
            {{ deal.teacher?.fullName || 'Не указан' }}
          </span>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-sm text-telegram-textSecondary">Статус:</span>
          <span
            v-if="statusConfig"
            :class="[
              'px-2 py-1 rounded-full text-xs font-medium',
              statusConfig.bgColor,
              statusConfig.color,
            ]"
          >
            {{ statusConfig.label }}
          </span>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-sm text-telegram-textSecondary">Создан:</span>
          <span class="text-telegram-text">{{ formatDate(deal.createdAt) }}</span>
        </div>

        <div v-if="deal.deadline" class="flex items-center justify-between">
          <span class="text-sm text-telegram-textSecondary">Дедлайн:</span>
          <span class="text-telegram-text">{{ formatDate(deal.deadline) }}</span>
        </div>
      </div>

      <!-- Description -->
      <div v-if="deal.serviceResponse?.message || deal.requestResponse?.message">
        <h4 class="font-medium text-telegram-text mb-2">Описание:</h4>
        <p class="text-sm text-telegram-textSecondary bg-telegram-secondary p-3 rounded-lg">
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
