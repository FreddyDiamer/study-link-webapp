<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'

const router = useRouter()
const telegramStore = useTelegramStore()

// Моковые данные заказов студента
const myOrders = ref([
  {
    id: 1,
    subject: 'Математика',
    description: 'Подготовка к ЕГЭ по математике, особенно задачи с параметрами',
    budget: 2000,
    format: 'Онлайн',
    urgency: 'normal',
    schedule: 'Вторник, четверг вечером',
    createdAt: '2024-01-18T10:30:00',
    status: 'active',
    responsesCount: 5,
    newResponsesCount: 2,
  },
  {
    id: 2,
    subject: 'Физика',
    description: 'Подготовка к олимпиаде, нужна помощь с механикой и термодинамикой',
    budget: 2500,
    format: 'Очно',
    urgency: 'urgent',
    schedule: 'Выходные',
    createdAt: '2024-01-17T16:15:00',
    status: 'active',
    responsesCount: 3,
    newResponsesCount: 1,
  },
  {
    id: 3,
    subject: 'Химия',
    description: 'Школьная программа 10 класс, органическая химия',
    budget: 1800,
    format: 'Любой',
    urgency: 'normal',
    schedule: 'Будни вечером',
    createdAt: '2024-01-15T14:20:00',
    status: 'paused',
    responsesCount: 8,
    newResponsesCount: 0,
  },
])

const getOrderStatusInfo = (status: string) => {
  switch (status) {
    case 'active':
      return { color: 'bg-telegram-success', text: 'Активна' }
    case 'paused':
      return { color: 'bg-orange-500', text: 'Приостановлена' }
    case 'completed':
      return { color: 'bg-telegram-textSecondary', text: 'Завершена' }
    default:
      return { color: 'bg-telegram-textSecondary', text: 'Неизвестно' }
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) return 'Только что'
  if (diffHours < 24) return `${diffHours} ч. назад`
  if (diffDays === 1) return 'Вчера'
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

const createOrder = () => {
  telegramStore.hapticFeedback('light')
  router.push('/student/orders/create')
}

const viewOrderDetails = (order: any) => {
  telegramStore.hapticFeedback('light')
  router.push(`/student/orders/${order.id}`)
}
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-telegram-text mb-2">Мои заказы</h1>
      <p class="text-telegram-textSecondary">
        Управляйте заказами и просматривайте отклики репетиторов
      </p>
    </div>

    <!-- Orders List -->
    <div v-if="myOrders.length === 0" class="text-center py-16">
      <div
        class="w-20 h-20 bg-telegram-secondary rounded-full mx-auto mb-6 flex items-center justify-center"
      >
        <svg
          class="w-10 h-10 text-telegram-textSecondary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-telegram-text mb-3">У вас пока нет заказов</h2>
      <p class="text-telegram-textSecondary mb-8 max-w-sm mx-auto">
        Создайте первый заказ на поиск репетитора и мы найдем подходящих кандидатов
      </p>
      <Button @click="createOrder" class="mx-auto">Создать заказ</Button>
    </div>

    <div v-else class="space-y-4">
      <Card
        v-for="order in myOrders"
        :key="order.id"
        @click="viewOrderDetails(order)"
        class="p-6 cursor-pointer hover:border-telegram-accent transition-colors duration-200"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-telegram-text font-semibold text-lg mb-1">{{ order.subject }}</h3>
            <div class="flex items-center space-x-3">
              <div class="flex items-center space-x-2">
                <div
                  :class="[getOrderStatusInfo(order.status).color, 'w-2 h-2 rounded-full']"
                ></div>
                <span class="text-telegram-textSecondary text-sm">{{
                  getOrderStatusInfo(order.status).text
                }}</span>
              </div>
              <span class="text-telegram-success font-semibold">{{ order.budget }}₽/занятие</span>
            </div>
          </div>
          <div class="text-right">
            <div class="text-telegram-textSecondary text-xs mb-1">Откликов</div>
            <div class="flex items-center space-x-1">
              <span class="text-telegram-text text-lg font-bold">{{ order.responsesCount }}</span>
              <div
                v-if="order.newResponsesCount > 0"
                class="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
              >
                {{ order.newResponsesCount }}
              </div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <p class="text-telegram-text text-sm mb-4">{{ order.description }}</p>

        <!-- Details -->
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p class="text-telegram-textSecondary text-xs mb-1">Формат</p>
            <p class="text-telegram-text font-medium">{{ order.format }}</p>
          </div>
          <div>
            <p class="text-telegram-textSecondary text-xs mb-1">График</p>
            <p class="text-telegram-text font-medium">{{ order.schedule }}</p>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <p class="text-telegram-textSecondary text-xs mb-1">Создана</p>
            <p class="text-telegram-text text-sm">{{ formatDate(order.createdAt) }}</p>
          </div>
          <div v-if="order.urgency === 'urgent'" class="flex items-center space-x-1">
            <span class="text-red-500 text-sm">🔥</span>
            <span class="text-red-500 text-sm font-medium">Срочно</span>
          </div>
        </div>
      </Card>

      <div class="pt-4">
        <Button @click="createOrder" class="w-full">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Создать новый заказ
        </Button>
      </div>
    </div>
  </div>
</template>
