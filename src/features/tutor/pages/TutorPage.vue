<script setup lang="ts">
import { useTelegramStore } from '@/stores/telegram'
import { useRouter } from 'vue-router'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'

const telegramStore = useTelegramStore()
const router = useRouter()

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
    title: 'Редактировать профиль',
    description: 'Обновить информацию',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    color: 'bg-telegram-secondary',
    action: () => {
      telegramStore.hapticFeedback('light')
      router.push('/tutor/profile')
    },
  },
]
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <!-- Quick actions -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-telegram-text mb-4">Быстрые действия</h2>

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

    <!-- Tips -->
    <Card class="p-6 bg-telegram-success/5 border-telegram-success/20">
      <div class="flex items-start space-x-3">
        <div
          class="w-8 h-8 bg-telegram-success rounded-full flex items-center justify-center flex-shrink-0"
        >
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div>
          <h3 class="text-telegram-success font-semibold mb-2">Совет для начала работы</h3>
          <p class="text-telegram-text text-sm leading-relaxed">
            Добавьте подробное описание ваших услуг с указанием предметов, опыта и стоимости.
            Студенты чаще выбирают репетиторов с полной информацией о себе.
          </p>
        </div>
      </div>
    </Card>
  </div>
</template>
