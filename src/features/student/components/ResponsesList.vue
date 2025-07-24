<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { Card, Button } from '@/shared/components/ui'

const router = useRouter()
const telegramStore = useTelegramStore()

// Моковые данные откликов студента на услуги (ServiceResponse)
const myResponses = ref([
  {
    id: '1',
    studentId: 'student-1',
    serviceId: 'service-1',
    message: 'Здравствуйте! Нужна подготовка к ЕГЭ по математике. Особенно профильная часть.',
    price: 120000, // в копейках (1200 рублей) - предложенная цена студента
    proposedDeadline: '2024-01-25T18:00:00',
    status: 'PENDING',
    createdAt: '2024-01-18T14:30:00',
    updatedAt: '2024-01-18T14:30:00',
    // Связанные данные
    service: {
      price: 120000, // цена услуги репетитора в копейках
      description: 'Подготовка к ЕГЭ по математике',
      tutor: {
        name: 'Иван Петров',
        rating: 4.8,
      },
      subject: {
        name: 'Математика',
      },
      teacher: {
        fullName: 'ЕГЭ математика',
      },
    },
  },
  {
    id: '2',
    studentId: 'student-1',
    serviceId: 'service-2',
    message: 'Нужна помощь с механикой и электричеством для олимпиады.',
    price: 110000, // в копейках (1100 рублей) - студент предложил дороже
    proposedDeadline: '2024-01-20T16:00:00',
    status: 'ACCEPTED',
    createdAt: '2024-01-17T11:20:00',
    updatedAt: '2024-01-17T18:30:00',
    // Связанные данные
    service: {
      price: 100000, // цена услуги репетитора в копейках
      description: 'Физика 10-11 класс',
      tutor: {
        name: 'Анна Сидорова',
        rating: 4.9,
      },
      subject: {
        name: 'Физика',
      },
      teacher: {
        fullName: 'Олимпиадная физика',
      },
    },
  },
  {
    id: '3',
    studentId: 'student-1',
    serviceId: 'service-3',
    message: 'Сложности с органической химией, нужна помощь с решением задач.',
    price: 90000, // в копейках (900 рублей) - цена услуги
    proposedDeadline: '2024-01-22T14:00:00',
    status: 'REJECTED',
    createdAt: '2024-01-16T09:45:00',
    updatedAt: '2024-01-16T20:15:00',
    // Связанные данные
    service: {
      price: 90000, // цена услуги репетитора в копейках
      description: 'Химия органическая',
      tutor: {
        name: 'Мария Козлова',
        rating: 4.7,
      },
      subject: {
        name: 'Химия',
      },
      teacher: {
        fullName: 'Органическая химия',
      },
    },
  },
])

const getResponseStatusInfo = (status: string) => {
  switch (status) {
    case 'PENDING':
      return { color: 'bg-orange-500', text: 'Ожидает ответа', textColor: 'text-orange-600' }
    case 'ACCEPTED':
      return { color: 'bg-telegram-success', text: 'Принят', textColor: 'text-telegram-success' }
    case 'REJECTED':
      return { color: 'bg-red-500', text: 'Отклонен', textColor: 'text-red-600' }
    case 'EXPIRED':
      return {
        color: 'bg-telegram-textSecondary',
        text: 'Истек',
        textColor: 'text-telegram-textSecondary',
      }
    default:
      return {
        color: 'bg-telegram-textSecondary',
        text: 'Неизвестно',
        textColor: 'text-telegram-textSecondary',
      }
  }
}

const formatPrice = (priceInKopecks: number) => {
  return Math.round(priceInKopecks / 100)
}

const formatDeadline = (dateString: string | null) => {
  if (!dateString) return null

  const date = new Date(dateString)
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffMs < 0) return 'Просрочен'
  if (diffHours < 1) return 'Скоро'
  if (diffHours < 24) return `Через ${diffHours} ч.`
  if (diffDays === 1) return 'Завтра'
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
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

const findServices = () => {
  telegramStore.hapticFeedback('light')
  router.push('/student/services')
}

const viewResponseDetails = (response: any) => {
  telegramStore.hapticFeedback('light')
  // TODO: Открыть детали отклика или перейти к чату с репетитором
  console.log('Просмотр отклика:', response.id)
}
</script>

<template>
  <div class="px-4">
    <!-- Empty State -->
    <div v-if="myResponses.length === 0" class="text-center py-16">
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
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-telegram-text mb-3">У вас пока нет откликов</h2>
      <p class="text-telegram-textSecondary mb-8 max-w-sm mx-auto">
        Найдите интересные услуги и оставляйте заявки репетиторам
      </p>
      <Button @click="findServices" class="mx-auto">Найти услуги</Button>
    </div>

    <!-- Responses List -->
    <div v-else class="space-y-4">
      <Card
        v-for="response in myResponses"
        :key="response.id"
        @click="viewResponseDetails(response)"
        class="p-6 cursor-pointer hover:border-telegram-accent transition-colors duration-200"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h3 class="text-telegram-text font-semibold text-lg mb-1">
              {{ response.service.subject.name }} • {{ response.service.teacher.fullName }}
            </h3>
            <div class="flex items-center space-x-2 mb-2">
              <span class="text-telegram-textSecondary text-sm">{{
                response.service.tutor.name
              }}</span>
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <span class="text-telegram-textSecondary text-sm">{{
                  response.service.tutor.rating
                }}</span>
              </div>
            </div>
          </div>
          <div class="text-right">
            <div
              :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                getResponseStatusInfo(response.status).color,
                'text-white mb-2',
              ]"
            >
              {{ getResponseStatusInfo(response.status).text }}
            </div>
            <div class="text-telegram-textSecondary text-xs">
              {{ formatDate(response.createdAt) }}
            </div>
          </div>
        </div>

        <!-- Message Preview -->
        <div class="mb-4">
          <p class="text-telegram-text text-sm mb-2">{{ response.message }}</p>
        </div>

        <!-- Details -->
        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center space-x-4">
            <div>
              <span class="text-telegram-textSecondary">Моя цена: </span>
              <span class="text-telegram-text">{{ formatPrice(response.price) }}₽</span>
            </div>
            <div>
              <span class="text-telegram-textSecondary">Цена услуги: </span>
              <span class="text-telegram-text">{{ formatPrice(response.service.price) }}₽</span>
            </div>
            <div v-if="response.proposedDeadline">
              <span class="text-telegram-textSecondary">Дедлайн: </span>
              <span class="text-telegram-text">{{
                formatDeadline(response.proposedDeadline)
              }}</span>
            </div>
          </div>
        </div>
      </Card>

      <!-- Find Services Button -->
      <div class="pt-4">
        <Button @click="findServices" variant="ghost" class="w-full">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Найти еще услуги
        </Button>
      </div>
    </div>
  </div>
</template>
