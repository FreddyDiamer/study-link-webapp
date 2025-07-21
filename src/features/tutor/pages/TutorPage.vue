<script setup lang="ts">
import { ref } from 'vue'
import { useTelegramStore } from '@/stores/telegram'
import { useRouter } from 'vue-router'
import { Card, Input, Button } from '@components/ui'
import { LoupeIcon } from '@/shared/components/icons'

const telegramStore = useTelegramStore()
const router = useRouter()

const searchQuery = ref('')

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
  {
    title: 'Просмотреть заявки',
    description: 'Новые запросы студентов',
    icon: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4',
    color: 'bg-telegram-success',
    action: () => {
      telegramStore.hapticFeedback('light')
      router.push('/tutor/requests')
    },
  },
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

const activeServices = [
  {
    id: 1,
    subject: 'Математика',
    teacher: 'ЕГЭ подготовка',
    price: '1000₽/час',
    responses: 3,
    status: 'active',
  },
  {
    id: 2,
    subject: 'Физика',
    teacher: 'Школьная программа',
    price: '800₽/час',
    responses: 5,
    status: 'active',
  },
]

const recentActivity = [
  { text: 'Новый отклик на услугу "Математика ЕГЭ"', time: '10 мин', isNew: true },
  { text: 'Студент принял ваше предложение', time: '1 час', isNew: false },
  { text: 'Заявка "Помощь с алгеброй" требует ответа', time: '2 часа', isNew: true },
]
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <!-- Search -->
    <Card class="p-4 mb-6">
      <div class="space-y-3">
        <Input
          v-model="searchQuery"
          placeholder="Поиск заявок по предметам, преподователям..."
          class="w-full"
        >
          <template #prepend>
            <LoupeIcon />
          </template>
        </Input>
        <Button class="w-full" size="sm" @click="router.push('/tutor/requests')">
          Найти заявки
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
              <p class="text-telegram-textSecondary text-sm">{{ action.description }}</p>
            </div>

            <svg
              class="w-5 h-5 text-telegram-textSecondary"
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
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold text-telegram-text">Активные услуги</h2>
        <button
          @click="router.push('/tutor/services')"
          class="text-telegram-accent text-sm font-medium"
        >
          Все услуги
        </button>
      </div>

      <div class="space-y-3">
        <Card v-for="service in activeServices" :key="service.id" class="p-4">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-2">
                <h3 class="font-medium text-telegram-text">{{ service.subject }}</h3>
                <span
                  class="px-2 py-1 bg-telegram-success/10 text-telegram-success text-xs rounded-full"
                >
                  Активно
                </span>
              </div>
              <p class="text-sm text-telegram-textSecondary mt-1">{{ service.teacher }}</p>
              <div class="flex items-center space-x-4 mt-2">
                <span class="text-sm font-medium text-telegram-text">{{ service.price }}</span>
                <span class="text-xs text-telegram-textSecondary">
                  {{ service.responses }} откликов
                </span>
              </div>
            </div>
            <svg
              class="w-5 h-5 text-telegram-textSecondary"
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
  </div>
</template>
