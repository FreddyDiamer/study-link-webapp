<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import type { Service } from '@/shared/types'

interface Props {
  service: Service
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
  })
}

const getStatusConfig = (status: string) => {
  const configs = {
    ACTIVE: {
      label: 'Активно',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    INACTIVE: {
      label: 'Неактивно',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    SUSPENDED: {
      label: 'Приостановлено',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  }
  return configs[status as keyof typeof configs] || configs.INACTIVE
}

const handleEditService = () => {
  telegramStore.hapticFeedback('light')
  router.push(`/tutor/services/${props.service.id}/edit`)
}

const handleViewResponses = () => {
  telegramStore.hapticFeedback('light')
  router.push(`/tutor/services/${props.service.id}/responses`)
}

const handleToggleStatus = () => {
  telegramStore.hapticFeedback('light')
  // TODO: Добавить логику переключения статуса
  console.log('Переключить статус:', props.service.id)
}
</script>

<template>
  <Card class="p-4 mb-4 hover:shadow-lg transition-shadow">
    <!-- Header -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <div class="flex items-center space-x-2 mb-1">
          <h3 class="font-semibold text-telegram-text">
            {{ service.subject?.name || 'Предмет не указан' }}
          </h3>
          <span
            :class="[
              'px-2 py-1 rounded-full text-xs font-medium',
              getStatusConfig(service.status).bgColor,
              getStatusConfig(service.status).color,
            ]"
          >
            {{ getStatusConfig(service.status).label }}
          </span>
        </div>
        <p class="text-sm text-telegram-text-secondary">
          {{ service.teacher?.fullName || 'Преподаватель не указан' }}
        </p>
      </div>

      <div class="text-right">
        <div class="font-bold text-telegram-accent text-lg">
          {{ formatPrice(service.price) }}
        </div>
        <div v-if="service.deadline" class="text-xs text-telegram-text-secondary">
          До {{ formatDate(service.deadline) }}
        </div>
      </div>
    </div>

    <!-- Description -->
    <div v-if="service.description" class="mb-4">
      <p class="text-sm text-telegram-text line-clamp-2">
        {{ service.description }}
      </p>
    </div>

    <!-- Stats -->
    <div class="flex items-center justify-between mb-4 text-sm text-telegram-text-secondary">
      <span>Создано: {{ formatDate(service.createdAt) }}</span>
      <span v-if="service.responses?.length"> {{ service.responses.length }} откликов </span>
    </div>

    <!-- Actions -->
    <div v-if="showActions" class="flex space-x-2">
      <Button @click="handleEditService" size="sm" class="flex-1"> Редактировать </Button>

      <Button
        v-if="service.responses?.length"
        @click="handleViewResponses"
        variant="ghost"
        size="sm"
        class="text-telegram-button"
      >
        Отклики
      </Button>

      <Button
        @click="handleToggleStatus"
        variant="ghost"
        size="sm"
        :class="service.status === 'ACTIVE' ? 'text-red-600' : 'text-green-600'"
      >
        {{ service.status === 'ACTIVE' ? 'Деактивировать' : 'Активировать' }}
      </Button>
    </div>
  </Card>
</template>
