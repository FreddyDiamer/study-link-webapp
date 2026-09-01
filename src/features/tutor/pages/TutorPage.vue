<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTelegramStore } from '@/stores/telegram'
import { useRouter } from 'vue-router'
import { useService } from '@/shared/composables'
import { Card, Input, Button } from '@components/ui'
import { LoupeIcon } from '@/shared/components/icons'
import ActiveServicesList from '../components/ActiveServicesList.vue'
import type { Service } from '@/shared/types'
import { PATHS } from '@/router/paths'

const telegramStore = useTelegramStore()
const router = useRouter()
const { getMyServices } = useService()

const searchQuery = ref('')
const isLoading = ref(false)
const activeServices = ref<Service[]>([])

const quickActions = [
  {
    title: 'Добавить услугу',
    description: 'Создать новое предложение',
    icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
    color: 'bg-telegram-button',
    action: () => {
      telegramStore.hapticFeedback('light')
      router.push('/tutor/services/create')
    },
  },
  // TODO вернуть
  // {
  //   title: 'Просмотреть заявки по моим предметам',
  //   description: 'Новые запросы студентов',
  //   icon: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4',
  //   color: 'bg-telegram-success',
  //   action: () => {
  //     telegramStore.hapticFeedback('light')
  //     router.push('/tutor/requests')
  //   },
  // },
  {
    title: 'Мои услуги',
    description: 'Управление предложениями',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    color: 'bg-purple-500',
    action: () => {
      telegramStore.hapticFeedback('light')
      router.push('/tutor/services')
    },
  },
]

const loadData = async () => {
  isLoading.value = true
  try {
    // Загружаем активные услуги
    const servicesResponse = await getMyServices()
    activeServices.value = servicesResponse.items
      .filter((service) => service.status === 'ACTIVE')
      .slice(0, 3)
  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
  } finally {
    isLoading.value = false
  }
}

const formatPrice = (price: number) => {
  return `${price} ₽`
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <!-- Search -->
    <Card class="p-4 mb-6">
      <div class="space-y-3">
        <Input
          v-model="searchQuery"
          placeholder="Поиск заказов по предметам, преподователям..."
          class="w-full"
        >
          <template #prepend>
            <LoupeIcon />
          </template>
        </Input>
        <Button class="w-full" size="sm" @click="router.push(PATHS.TUTOR_ORDERS)">
          Найти заказ
        </Button>
      </div>
    </Card>

    <!-- Quick actions -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold text-telegram-text mb-3">Быстрые действия</h2>

      <div class="space-y-3">
        <Card
          v-for="action in quickActions"
          :key="action.title"
          @click="action.action"
          class="p-4 cursor-pointer hover:border-telegram-accent transition-colors duration-200"
        >
          <div class="flex items-center space-x-4">
            <div :class="[action.color, 'w-12 h-12 rounded-xl flex items-center justify-center']">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  :d="action.icon"
                />
              </svg>
            </div>

            <div class="flex-1">
              <h3 class="text-telegram-text font-medium">{{ action.title }}</h3>
              <p class="text-telegram-text-secondary text-sm">{{ action.description }}</p>
            </div>

            <svg
              class="w-5 h-5 text-telegram-text-secondary"
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
    </div>

    <!-- Active Services -->
    <div class="mb-6">
      <ActiveServicesList :services="activeServices" :is-loading="isLoading" />
    </div>
  </div>
</template>
