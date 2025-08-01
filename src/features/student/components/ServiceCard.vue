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

const handleViewService = () => {
  telegramStore.hapticFeedback('light')
  router.push(`/student/services/${props.service.id}`)
}

const handleCreateRequest = () => {
  telegramStore.hapticFeedback('light')
  router.push(`/student/orders/create?serviceId=${props.service.id}`)
}

const handleAddToFavorites = () => {
  telegramStore.hapticFeedback('light')
  // TODO: Добавить логику добавления в избранное
  console.log('Добавить в избранное:', props.service.id)
}
</script>

<template>
  <Card
    class="p-4 mb-4 hover:shadow-lg transition-shadow cursor-pointer"
    @click="handleViewService"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <h3 class="font-semibold text-telegram-text mb-1">
          {{ service.subject?.name || 'Предмет не указан' }}
        </h3>
        <p class="text-sm text-telegram-textSecondary">
          {{ service.teacher?.fullName || 'Преподаватель не указан' }}
        </p>
      </div>

      <div class="text-right">
        <div class="font-bold text-telegram-accent text-lg">
          {{ formatPrice(service.price) }}
        </div>
        <div v-if="service.deadline" class="text-xs text-telegram-textSecondary">
          До {{ formatDate(service.deadline) }}
        </div>
      </div>
    </div>

    <!-- Tutor info -->
    <div class="flex items-center space-x-3 mb-4">
      <div
        class="w-12 h-12 bg-telegram-accent rounded-full flex items-center justify-center text-white font-bold"
      >
        {{ service.tutor?.name?.charAt(0) || 'Р' }}
      </div>
      <div class="flex-1">
        <div class="font-medium text-telegram-text">{{ service.tutor?.name || 'Репетитор' }}</div>
        <div class="flex items-center space-x-2 text-sm text-telegram-textSecondary">
          <span>⭐ {{ (service.tutor as any)?.rating || 5.0 }}</span>
          <span>•</span>
          <span>{{ (service.tutor as any)?.reviewsCount || 0 }} отзывов</span>
        </div>
      </div>
    </div>

    <!-- Description -->
    <div v-if="service.description" class="mb-4">
      <p class="text-sm text-telegram-text line-clamp-2">
        {{ service.description }}
      </p>
    </div>

    <!-- Actions -->
    <div v-if="showActions" class="flex space-x-2" @click.stop>
      <Button @click="handleCreateRequest" size="sm" class="flex-1"> Создать заявку </Button>

      <Button @click="handleAddToFavorites" variant="ghost" size="sm" class="text-telegram-accent">
        ❤️
      </Button>
    </div>
  </Card>
</template>
