<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import { StatusBadge } from '@/shared/components/ui'
import { PATHS } from '@/router/paths'
import type { Service } from '@/shared/types'

interface Props {
  services: Service[]
  isLoading?: boolean
}

withDefaults(defineProps<Props>(), {
  isLoading: false,
})

const router = useRouter()
const telegramStore = useTelegramStore()

const formatPrice = (price: number) => {
  return `${price} ₽`
}

const handleViewResponses = (serviceId: string) => {
  telegramStore.hapticFeedback('light')
  router.push(`${PATHS.TUTOR_SERVICE_RESPONSES.replace(':id', serviceId)}`)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-title-m font-semibold text-d-text">Активные услуги</h3>
      <Button variant="ghost" size="sm" @click="router.push(PATHS.TUTOR_SERVICES)">
        Все услуги
      </Button>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="space-y-4">
      <Card v-for="i in 3" :key="i" class="p-4">
        <div class="animate-pulse">
          <div class="h-4 bg-d-surface rounded mb-2"></div>
          <div class="h-3 bg-d-surface rounded w-2/3"></div>
        </div>
      </Card>
    </div>

    <!-- Services list -->
    <div v-else-if="services.length > 0" class="space-y-3">
      <Card
        v-for="service in services"
        :key="service.id"
        class="p-4"
        @click="handleViewResponses(service.id)"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-2">
              <h3 class="font-medium text-d-text">{{ service.subject.name }}</h3>
              <StatusBadge :service="service.status" />
            </div>
            <p class="text-subhead text-d-text-second mt-1">
              {{ service.teacher.fullName }}
            </p>
            <div class="flex items-center space-x-4 mt-2">
              <span class="text-subhead font-medium text-d-text tnum">{{
                formatPrice(service.price)
              }}</span>
              <span class="text-caption text-d-text-second tnum">
                {{ service.responses?.length ?? 0 }} откликов
              </span>
            </div>
          </div>
          <svg
            class="w-5 h-5 text-d-text-second"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Card>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-8">
      <div
        class="w-16 h-16 bg-d-surface rounded-full mx-auto mb-4 flex items-center justify-center"
      >
        <svg
          class="w-8 h-8 text-d-text-second"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>

      <h4 class="text-title-m font-medium text-d-text mb-2">Нет активных услуг</h4>
      <p class="text-d-text-second mb-4">
        Создайте свою первую услугу, чтобы начать получать заявки
      </p>
    </div>
  </div>
</template>
