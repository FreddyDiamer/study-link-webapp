<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import { PATHS } from '@/router/paths'
import type { Service } from '@/shared/types'

defineProps<{
  services: Service[]
  isLoading?: boolean
}>()

const router = useRouter()
const telegramStore = useTelegramStore()

const formatPrice = (price: number) => `${price} ₽`

const handleViewResponses = (serviceId: string) => {
  telegramStore.hapticFeedback('light')
  router.push(PATHS.TUTOR_SERVICE_RESPONSES.replace(':id', serviceId))
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-telegram-text">Активные услуги</h3>
      <Button variant="ghost" size="sm" @click="router.push(PATHS.TUTOR_SERVICES)">Все услуги</Button>
    </div>
    <div v-if="isLoading" class="space-y-4">
      <Card v-for="i in 3" :key="i" class="p-4">
        <div class="animate-pulse">
          <div class="h-4 bg-telegram-secondary rounded mb-2"></div>
          <div class="h-3 bg-telegram-secondary rounded w-2/3"></div>
        </div>
      </Card>
    </div>
    <div v-else-if="services.length > 0" class="space-y-3">
      <Card v-for="service in services" :key="service.id" class="p-4" @click="handleViewResponses(service.id)">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-2">
              <h3 class="font-medium text-telegram-text">{{ service.subject?.name }}</h3>
              <span class="px-2 py-1 bg-telegram-success/10 text-telegram-success text-xs rounded-full">Активно</span>
            </div>
            <p class="text-sm text-telegram-textSecondary mt-1">{{ service.teacher?.fullName }}</p>
            <div class="flex items-center space-x-4 mt-2">
              <span class="text-sm font-medium text-telegram-text">{{ formatPrice(service.price) }}</span>
              <span class="text-xs text-telegram-textSecondary">{{ (service as any).responses?.length ?? 0 }} откликов</span>
            </div>
          </div>
          <svg class="w-5 h-5 text-telegram-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Card>
    </div>
    <div v-else class="text-center py-8">
      <div class="w-16 h-16 bg-telegram-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
        <svg class="w-8 h-8 text-telegram-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h4 class="text-lg font-medium text-telegram-text mb-2">Нет активных услуг</h4>
      <p class="text-telegram-textSecondary mb-4">Создайте свою первую услугу, чтобы начать получать заявки</p>
    </div>
  </div>
</template>
