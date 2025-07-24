<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { Card, Button } from '@/shared/components/ui'

const router = useRouter()
const telegramStore = useTelegramStore()

// Моковые данные заявок студента (Request)
const myRequests = ref([
  {
    id: '1',
    studentId: 'student-1',
    subjectId: 'math-1',
    teacherId: 'teacher-1',
    description: 'Подготовка к ЕГЭ по математике, особенно задачи с параметрами',
    urgency: 'HIGH',
    budget: 200000, // в копейках (2000 рублей)
    status: 'OPEN',
    deadline: '2024-01-25T18:00:00',
    createdAt: '2024-01-18T10:30:00',
    updatedAt: '2024-01-18T10:30:00',
    // Связанные данные
    subject: {
      name: 'Математика',
    },
    teacher: {
      fullName: 'Подготовка к ЕГЭ',
    },
    // Подсчет откликов
    responsesCount: 5,
    newResponsesCount: 2,
  },
  {
    id: '2',
    studentId: 'student-1',
    subjectId: 'physics-1',
    teacherId: 'teacher-2',
    description: 'Подготовка к олимпиаде, нужна помощь с механикой и термодинамикой',
    urgency: 'HIGH',
    budget: 250000, // в копейках (2500 рублей)
    status: 'OPEN',
    deadline: '2024-01-22T16:00:00',
    createdAt: '2024-01-17T16:15:00',
    updatedAt: '2024-01-17T16:15:00',
    // Связанные данные
    subject: {
      name: 'Физика',
    },
    teacher: {
      fullName: 'Олимпиадная физика',
    },
    // Подсчет откликов
    responsesCount: 3,
    newResponsesCount: 1,
  },
  {
    id: '3',
    studentId: 'student-1',
    subjectId: 'chemistry-1',
    teacherId: 'teacher-3',
    description: 'Школьная программа 10 класс, органическая химия',
    urgency: 'MEDIUM',
    budget: 180000, // в копейках (1800 рублей)
    status: 'CLOSED',
    deadline: '2024-01-30T14:00:00',
    createdAt: '2024-01-15T14:20:00',
    updatedAt: '2024-01-18T18:00:00',
    // Связанные данные
    subject: {
      name: 'Химия',
    },
    teacher: {
      fullName: 'Органическая химия',
    },
    // Подсчет откликов
    responsesCount: 8,
    newResponsesCount: 0,
  },
])

const getRequestStatusInfo = (status: string) => {
  switch (status) {
    case 'OPEN':
      return { color: 'bg-telegram-success', text: 'Открыта' }
    case 'MATCHED':
      return { color: 'bg-blue-500', text: 'Найден репетитор' }
    case 'CLOSED':
      return { color: 'bg-telegram-textSecondary', text: 'Закрыта' }
    case 'CANCELLED':
      return { color: 'bg-red-500', text: 'Отменена' }
    default:
      return { color: 'bg-telegram-textSecondary', text: 'Неизвестно' }
  }
}

const getUrgencyText = (urgency: string) => {
  switch (urgency) {
    case 'LOW':
      return 'Низкая'
    case 'MEDIUM':
      return 'Средняя'
    case 'HIGH':
      return 'Высокая'
    default:
      return 'Не указана'
  }
}

const formatPrice = (priceInKopecks: number) => {
  return Math.round(priceInKopecks / 100)
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

const createRequest = () => {
  telegramStore.hapticFeedback('light')
  router.push('/student/orders/create')
}

const viewRequestDetails = (request: any) => {
  telegramStore.hapticFeedback('light')
  router.push(`/student/orders/${request.id}`)
}
</script>

<template>
  <div class="px-4">
    <!-- Empty State -->
    <div v-if="myRequests.length === 0" class="text-center py-16">
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
      <h2 class="text-xl font-semibold text-telegram-text mb-3">У вас пока нет заявок</h2>
      <p class="text-telegram-textSecondary mb-8 max-w-sm mx-auto">
        Создайте первую заявку на поиск репетитора и получайте отклики
      </p>
      <Button @click="createRequest" class="mx-auto">Создать заявку</Button>
    </div>

    <!-- Requests List -->
    <div v-else class="space-y-4">
      <Card
        v-for="request in myRequests"
        :key="request.id"
        @click="viewRequestDetails(request)"
        class="p-6 cursor-pointer hover:border-telegram-accent transition-colors duration-200"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-telegram-text font-semibold text-lg mb-1">
              {{ request.subject.name }} • {{ request.teacher.fullName }}
            </h3>
            <div class="flex items-center space-x-3">
              <div class="flex items-center space-x-2">
                <div
                  :class="[getRequestStatusInfo(request.status).color, 'w-2 h-2 rounded-full']"
                ></div>
                <span class="text-telegram-textSecondary text-sm">{{
                  getRequestStatusInfo(request.status).text
                }}</span>
              </div>
              <span class="text-telegram-textSecondary text-sm">
                {{ getUrgencyText(request.urgency) }}
              </span>
              <span class="text-telegram-success font-semibold"
                >до {{ formatPrice(request.budget) }}₽</span
              >
            </div>
          </div>
          <div class="text-right">
            <div class="text-telegram-textSecondary text-xs mb-1">Откликов</div>
            <div class="flex items-center space-x-1">
              <span class="text-telegram-text text-lg font-bold">{{ request.responsesCount }}</span>
              <div
                v-if="request.newResponsesCount > 0"
                class="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
              >
                {{ request.newResponsesCount }}
              </div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <p class="text-telegram-text text-sm mb-4">{{ request.description }}</p>

        <!-- Details -->
        <div class="flex items-center justify-between">
          <div>
            <p class="text-telegram-textSecondary text-xs mb-1">Создана</p>
            <p class="text-telegram-text text-sm">{{ formatDate(request.createdAt) }}</p>
          </div>
        </div>
      </Card>

      <!-- Create New Request Button -->
      <div class="pt-4">
        <Button @click="createRequest" class="w-full">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Создать новую заявку
        </Button>
      </div>
    </div>
  </div>
</template>
