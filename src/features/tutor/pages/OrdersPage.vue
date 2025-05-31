<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTelegramStore } from '@/stores/telegram'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'

const telegramStore = useTelegramStore()

// Моковые данные заказов
const orders = ref([
  {
    id: 1,
    student: {
      name: 'Анна Петрова',
      avatar: 'АП',
    },
    subject: 'Математика',
    description: 'Подготовка к ЕГЭ по математике, разбор сложных задач',
    price: 2000,
    format: 'Онлайн',
    status: 'active',
    nextLesson: '2024-01-20T18:00:00',
    totalLessons: 8,
    completedLessons: 3,
  },
  {
    id: 2,
    student: {
      name: 'Максим Сидоров',
      avatar: 'МС',
    },
    subject: 'Физика',
    description: 'Подготовка к экзамену, электричество и магнетизм',
    price: 1800,
    format: 'Очно',
    status: 'active',
    nextLesson: '2024-01-22T16:00:00',
    totalLessons: 6,
    completedLessons: 1,
  },
  {
    id: 3,
    student: {
      name: 'Елена Козлова',
      avatar: 'ЕК',
    },
    subject: 'Химия',
    description: 'Органическая химия, подготовка к олимпиаде',
    price: 2500,
    format: 'Онлайн',
    status: 'completed',
    nextLesson: null,
    totalLessons: 12,
    completedLessons: 12,
  },
])

const activeOrders = computed(() => orders.value.filter((order) => order.status === 'active'))
const completedOrders = computed(() => orders.value.filter((order) => order.status === 'completed'))

const selectedTab = ref<'active' | 'completed'>('active')

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-telegram-success'
    case 'completed':
      return 'bg-telegram-textSecondary'
    default:
      return 'bg-telegram-textSecondary'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return 'Активный'
    case 'completed':
      return 'Завершен'
    default:
      return 'Неизвестно'
  }
}

const contactStudent = (order: any) => {
  telegramStore.hapticFeedback('light')
  console.log('Связаться со студентом:', order.student.name)
}

const viewDetails = (order: any) => {
  telegramStore.hapticFeedback('light')
  console.log('Подробности заказа:', order.id)
}
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-telegram-text mb-2">Мои заказы</h1>
      <p class="text-telegram-textSecondary">
        Управляйте активными заказами и просматривайте историю
      </p>
    </div>

    <!-- Tabs -->
    <div class="flex bg-telegram-secondary rounded-xl p-1 mb-6">
      <button
        @click="selectedTab = 'active'"
        class="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200"
        :class="{
          'bg-telegram-card text-telegram-text shadow-sm': selectedTab === 'active',
          'text-telegram-textSecondary': selectedTab !== 'active',
        }"
      >
        Активные ({{ activeOrders.length }})
      </button>
      <button
        @click="selectedTab = 'completed'"
        class="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200"
        :class="{
          'bg-telegram-card text-telegram-text shadow-sm': selectedTab === 'completed',
          'text-telegram-textSecondary': selectedTab !== 'completed',
        }"
      >
        Завершенные ({{ completedOrders.length }})
      </button>
    </div>

    <!-- Active Orders -->
    <div v-if="selectedTab === 'active'">
      <div v-if="activeOrders.length === 0" class="text-center py-16">
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-telegram-text mb-3">Нет активных заказов</h2>
        <p class="text-telegram-textSecondary">
          Когда студенты примут ваши предложения, заказы появятся здесь
        </p>
      </div>

      <div v-else class="space-y-4">
        <Card v-for="order in activeOrders" :key="order.id" class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div
                class="w-12 h-12 bg-telegram-accent rounded-full flex items-center justify-center text-white font-semibold"
              >
                {{ order.student.avatar }}
              </div>
              <div>
                <h3 class="text-telegram-text font-semibold">{{ order.student.name }}</h3>
                <p class="text-telegram-textSecondary text-sm">{{ order.subject }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <div :class="[getStatusColor(order.status), 'w-2 h-2 rounded-full']"></div>
              <span class="text-telegram-textSecondary text-sm">{{
                getStatusText(order.status)
              }}</span>
            </div>
          </div>

          <p class="text-telegram-text text-sm mb-4">{{ order.description }}</p>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p class="text-telegram-textSecondary text-xs mb-1">Стоимость</p>
              <p class="text-telegram-text font-semibold">{{ order.price }}₽/занятие</p>
            </div>
            <div>
              <p class="text-telegram-textSecondary text-xs mb-1">Формат</p>
              <p class="text-telegram-text font-semibold">{{ order.format }}</p>
            </div>
          </div>

          <div class="bg-telegram-secondary rounded-lg p-3 mb-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-telegram-textSecondary text-sm">Прогресс</span>
              <span class="text-telegram-text text-sm font-medium">
                {{ order.completedLessons }}/{{ order.totalLessons }} занятий
              </span>
            </div>
            <div class="w-full bg-telegram-border rounded-full h-2">
              <div
                class="bg-telegram-success h-2 rounded-full transition-all duration-300"
                :style="{ width: `${(order.completedLessons / order.totalLessons) * 100}%` }"
              ></div>
            </div>
          </div>

          <div
            v-if="order.nextLesson"
            class="bg-telegram-accent/10 border border-telegram-accent/20 rounded-lg p-3 mb-4"
          >
            <div class="flex items-center space-x-2">
              <svg
                class="w-4 h-4 text-telegram-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="text-telegram-accent font-medium text-sm">
                Следующее занятие: {{ formatDate(order.nextLesson) }}
              </span>
            </div>
          </div>

          <div class="flex space-x-3">
            <Button @click="contactStudent(order)" variant="secondary" class="flex-1">
              Связаться
            </Button>
            <Button @click="viewDetails(order)" variant="secondary" class="flex-1">
              Подробнее
            </Button>
          </div>
        </Card>
      </div>
    </div>

    <!-- Completed Orders -->
    <div v-if="selectedTab === 'completed'">
      <div v-if="completedOrders.length === 0" class="text-center py-16">
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-telegram-text mb-3">Нет завершенных заказов</h2>
        <p class="text-telegram-textSecondary">Завершенные заказы будут отображаться здесь</p>
      </div>

      <div v-else class="space-y-4">
        <Card v-for="order in completedOrders" :key="order.id" class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div
                class="w-12 h-12 bg-telegram-textSecondary rounded-full flex items-center justify-center text-white font-semibold"
              >
                {{ order.student.avatar }}
              </div>
              <div>
                <h3 class="text-telegram-text font-semibold">{{ order.student.name }}</h3>
                <p class="text-telegram-textSecondary text-sm">{{ order.subject }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <div :class="[getStatusColor(order.status), 'w-2 h-2 rounded-full']"></div>
              <span class="text-telegram-textSecondary text-sm">{{
                getStatusText(order.status)
              }}</span>
            </div>
          </div>

          <p class="text-telegram-text text-sm mb-4">{{ order.description }}</p>

          <div class="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p class="text-telegram-textSecondary text-xs mb-1">Стоимость</p>
              <p class="text-telegram-text font-semibold">{{ order.price }}₽</p>
            </div>
            <div>
              <p class="text-telegram-textSecondary text-xs mb-1">Занятий</p>
              <p class="text-telegram-text font-semibold">{{ order.totalLessons }}</p>
            </div>
            <div>
              <p class="text-telegram-textSecondary text-xs mb-1">Доход</p>
              <p class="text-telegram-success font-semibold">
                {{ order.price * order.totalLessons }}₽
              </p>
            </div>
          </div>

          <div class="flex space-x-3">
            <Button @click="contactStudent(order)" variant="secondary" class="flex-1">
              Связаться
            </Button>
            <Button @click="viewDetails(order)" variant="secondary" class="flex-1">
              Подробнее
            </Button>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>
