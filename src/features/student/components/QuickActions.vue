<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import Card from '@/shared/components/ui/Card.vue'
import { PATHS } from '@/router/paths'
import { PlusIcon, LoupeIcon, OrderIcon } from '@components/icons'

const router = useRouter()
const telegramStore = useTelegramStore()

const actions = [
  {
    title: 'Создать заявку',
    description: 'Разместить запрос на помощь',
    icon: PlusIcon,
    color: 'bg-telegram-button',
    path: PATHS.STUDENT_CREATE_ORDER,
  },
  {
    title: 'Найти репетиторов',
    description: 'Просмотреть доступных преподавателей',
    icon: LoupeIcon,
    color: 'bg-telegram-success',
    path: PATHS.STUDENT_TUTORS,
  },
  {
    title: 'Мои заявки',
    description: 'Управление заявками и откликами',
    icon: OrderIcon,
    color: 'bg-purple-500',
    path: PATHS.STUDENT_ORDERS,
  },
]

const handleAction = (path: string) => {
  telegramStore.hapticFeedback('light')
  router.push(path)
}
</script>

<template>
  <div class="space-y-3">
    <Card
      v-for="action in actions"
      :key="action.title"
      @click="handleAction(action.path)"
      class="p-4 cursor-pointer hover:border-telegram-accent transition-colors duration-200"
    >
      <div class="flex items-center space-x-4">
        <div :class="[action.color, 'w-12 h-12 rounded-xl flex items-center justify-center']">
          <component :is="action.icon" class="w-6 h-6" />
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
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Card>
  </div>
</template>
