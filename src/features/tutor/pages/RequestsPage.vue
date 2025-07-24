<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTelegramStore } from '@/stores/telegram'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'

const telegramStore = useTelegramStore()

// Моковые данные заявок студентов (Request)
const requests = ref([
  {
    id: '1',
    studentId: 'student-1',
    subjectId: 'math-1',
    teacherId: 'teacher-1',
    description:
      'Нужна помощь с подготовкой к ЕГЭ по математике. Особенно сложно даются задачи с параметрами и геометрия.',
    urgency: 'HIGH',
    budget: 200000, // в копейках (2000 рублей)
    status: 'OPEN',
    deadline: '2024-01-25T18:00:00',
    createdAt: '2024-01-18T14:30:00',
    updatedAt: '2024-01-18T14:30:00',
    // Связанные данные
    student: {
      name: 'Мария Васильева',
      rating: 4.8,
    },
    subject: {
      name: 'Математика',
    },
    teacher: {
      fullName: 'Подготовка к ЕГЭ',
    },
    // Для репетитора - есть ли его отклик
    myResponseId: null,
    responsesCount: 3,
  },
  {
    id: '2',
    studentId: 'student-2',
    subjectId: 'physics-1',
    teacherId: 'teacher-2',
    description:
      'Подготовка к экзамену в университете. Нужно разобрать электричество и магнетизм, оптику.',
    urgency: 'HIGH',
    budget: 180000, // в копейках (1800 рублей)
    status: 'OPEN',
    deadline: '2024-01-22T16:00:00',
    createdAt: '2024-01-18T16:15:00',
    updatedAt: '2024-01-18T16:15:00',
    // Связанные данные
    student: {
      name: 'Алексей Козлов',
      rating: 4.5,
    },
    subject: {
      name: 'Физика',
    },
    teacher: {
      fullName: 'Университетская физика',
    },
    // Для репетитора - есть ли его отклик (просмотрено)
    myResponseId: null,
    responsesCount: 5,
    viewedByMe: true,
  },
  {
    id: '3',
    studentId: 'student-3',
    subjectId: 'chemistry-1',
    teacherId: 'teacher-3',
    description:
      'Помощь с органической химией для подготовки к олимпиаде. Нужны задачи повышенной сложности.',
    urgency: 'MEDIUM',
    budget: 250000, // в копейках (2500 рублей)
    status: 'MATCHED',
    deadline: '2024-01-30T14:00:00',
    createdAt: '2024-01-17T20:45:00',
    updatedAt: '2024-01-18T10:30:00',
    // Связанные данные
    student: {
      name: 'София Петрова',
      rating: 5.0,
    },
    subject: {
      name: 'Химия',
    },
    teacher: {
      fullName: 'Олимпиадная химия',
    },
    // Для репетитора - есть ли его отклик (отправлен)
    myResponseId: 'response-2',
    responsesCount: 8,
    viewedByMe: true,
  },
  {
    id: '4',
    studentId: 'student-4',
    subjectId: 'math-1',
    teacherId: 'teacher-4',
    description:
      'Подготовка к поступлению в технический вуз. Нужна помощь с алгеброй и началами анализа.',
    urgency: 'MEDIUM',
    budget: 150000, // в копейках (1500 рублей)
    status: 'OPEN',
    deadline: '2024-01-28T12:00:00',
    createdAt: '2024-01-17T11:20:00',
    updatedAt: '2024-01-17T11:20:00',
    // Связанные данные
    student: {
      name: 'Денис Смирнов',
      rating: 4.2,
    },
    subject: {
      name: 'Математика',
    },
    teacher: {
      fullName: 'Высшая математика',
    },
    // Для репетитора - есть ли его отклик
    myResponseId: null,
    responsesCount: 2,
  },
])

const selectedFilter = ref<'all' | 'new' | 'viewed' | 'responded'>('all')

const filteredRequests = computed(() => {
  if (selectedFilter.value === 'all') return requests.value

  return requests.value.filter((request) => {
    switch (selectedFilter.value) {
      case 'new':
        return !request.myResponseId && !request.viewedByMe
      case 'viewed':
        return !request.myResponseId && request.viewedByMe
      case 'responded':
        return !!request.myResponseId
      default:
        return true
    }
  })
})

const newRequestsCount = computed(
  () => requests.value.filter((r) => !r.myResponseId && !r.viewedByMe).length,
)
const viewedRequestsCount = computed(
  () => requests.value.filter((r) => !r.myResponseId && r.viewedByMe).length,
)
const respondedRequestsCount = computed(() => requests.value.filter((r) => !!r.myResponseId).length)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) return 'Только что'
  if (diffHours < 24) return `${diffHours} ч. назад`
  if (diffDays === 1) return 'Вчера'
  return `${diffDays} дн. назад`
}

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

const getMyStatusInfo = (request: any) => {
  if (request.myResponseId) {
    return { color: 'bg-telegram-success', text: 'Отклик отправлен' }
  } else if (request.viewedByMe) {
    return { color: 'bg-orange-500', text: 'Просмотрена' }
  } else {
    return { color: 'bg-telegram-accent', text: 'Новая' }
  }
}

const getUrgencyInfo = (urgency: string) => {
  switch (urgency) {
    case 'HIGH':
      return { color: 'text-red-500', text: 'Высокая', icon: '🔥' }
    case 'MEDIUM':
      return { color: 'text-orange-500', text: 'Средняя', icon: '⚡' }
    case 'LOW':
      return { color: 'text-telegram-textSecondary', text: 'Низкая', icon: '⏰' }
    default:
      return { color: 'text-telegram-textSecondary', text: 'Не указана', icon: '⏰' }
  }
}

const formatPrice = (priceInKopecks: number) => {
  return Math.round(priceInKopecks / 100)
}

const viewRequest = (request: any) => {
  telegramStore.hapticFeedback('light')
  if (!request.viewedByMe) {
    request.viewedByMe = true
  }
  console.log('Просмотр заявки:', request.id)
}

const respondToRequest = (request: any) => {
  telegramStore.hapticFeedback('medium')
  // Создаем RequestResponse
  request.myResponseId = `response-${Date.now()}`
  request.viewedByMe = true
  console.log('Отклик на заявку:', request.id)
}

const contactStudent = (request: any) => {
  telegramStore.hapticFeedback('light')
  console.log('Связаться со студентом:', request.student.name)
}
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-telegram-text mb-2">Заявки студентов</h1>
      <p class="text-telegram-textSecondary">
        Просматривайте и откликайтесь на заявки по вашим предметам
      </p>
    </div>

    <!-- Filters -->
    <div class="flex space-x-2 mb-6 overflow-x-auto">
      <button
        @click="selectedFilter = 'all'"
        class="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
        :class="{
          'bg-telegram-accent text-white': selectedFilter === 'all',
          'bg-telegram-secondary text-telegram-textSecondary': selectedFilter !== 'all',
        }"
      >
        Все ({{ requests.length }})
      </button>
      <button
        @click="selectedFilter = 'new'"
        class="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 relative"
        :class="{
          'bg-telegram-accent text-white': selectedFilter === 'new',
          'bg-telegram-secondary text-telegram-textSecondary': selectedFilter !== 'new',
        }"
      >
        Новые ({{ newRequestsCount }})
        <div
          v-if="newRequestsCount > 0 && selectedFilter !== 'new'"
          class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
        ></div>
      </button>
      <button
        @click="selectedFilter = 'viewed'"
        class="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
        :class="{
          'bg-telegram-accent text-white': selectedFilter === 'viewed',
          'bg-telegram-secondary text-telegram-textSecondary': selectedFilter !== 'viewed',
        }"
      >
        Просмотренные ({{ viewedRequestsCount }})
      </button>
      <button
        @click="selectedFilter = 'responded'"
        class="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
        :class="{
          'bg-telegram-accent text-white': selectedFilter === 'responded',
          'bg-telegram-secondary text-telegram-textSecondary': selectedFilter !== 'responded',
        }"
      >
        Откликнулся ({{ respondedRequestsCount }})
      </button>
    </div>

    <!-- Requests List -->
    <div v-if="filteredRequests.length === 0" class="text-center py-16">
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
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-telegram-text mb-3">
        {{ selectedFilter === 'all' ? 'Пока нет заявок' : 'Нет заявок в этой категории' }}
      </h2>
      <p class="text-telegram-textSecondary">
        {{
          selectedFilter === 'all'
            ? 'Когда студенты создадут заявки по вашим предметам, вы увидите их здесь'
            : 'Попробуйте выбрать другую категорию или проверьте позже'
        }}
      </p>
    </div>

    <div v-else class="space-y-4">
      <Card v-for="request in filteredRequests" :key="request.id" class="p-6">
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div
              class="w-12 h-12 bg-telegram-accent rounded-full flex items-center justify-center text-white font-semibold"
            >
              {{ request.student.name.charAt(0) }}
            </div>
            <div>
              <h3 class="text-telegram-text font-semibold">{{ request.student.name }}</h3>
              <div class="flex items-center space-x-2">
                <p class="text-telegram-textSecondary text-sm">
                  {{ request.subject.name }} • {{ request.teacher.fullName }}
                </p>
                <div class="flex items-center space-x-1">
                  <svg class="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                  <span class="text-telegram-textSecondary text-xs">{{
                    request.student.rating
                  }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col items-end space-y-2">
            <div class="flex items-center space-x-2">
              <div :class="[getMyStatusInfo(request).color, 'w-2 h-2 rounded-full']"></div>
              <span class="text-telegram-textSecondary text-xs">{{
                getMyStatusInfo(request).text
              }}</span>
            </div>
            <div class="flex items-center space-x-1">
              <span class="text-xs">{{ getUrgencyInfo(request.urgency).icon }}</span>
              <span :class="[getUrgencyInfo(request.urgency).color, 'text-xs font-medium']">
                {{ getUrgencyInfo(request.urgency).text }}
              </span>
            </div>
          </div>
        </div>

        <!-- Description -->
        <p class="text-telegram-text text-sm mb-4">{{ request.description }}</p>

        <!-- Details -->
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p class="text-telegram-textSecondary text-xs mb-1">Бюджет</p>
            <p class="text-telegram-success font-semibold">до {{ formatPrice(request.budget) }}₽</p>
          </div>
          <div>
            <p class="text-telegram-textSecondary text-xs mb-1">Статус заявки</p>
            <div class="flex items-center space-x-2">
              <div
                :class="[getRequestStatusInfo(request.status).color, 'w-2 h-2 rounded-full']"
              ></div>
              <span class="text-telegram-text text-sm">{{
                getRequestStatusInfo(request.status).text
              }}</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p class="text-telegram-textSecondary text-xs mb-1">Откликов</p>
            <p class="text-telegram-text text-sm">{{ request.responsesCount }}</p>
          </div>
          <div>
            <p class="text-telegram-textSecondary text-xs mb-1">Опубликована</p>
            <p class="text-telegram-text text-sm">{{ formatDate(request.createdAt) }}</p>
          </div>
        </div>

        <!-- Urgency badge -->
        <div
          v-if="request.urgency === 'HIGH'"
          class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4"
        >
          <div class="flex items-center space-x-2">
            <span class="text-lg">🔥</span>
            <span class="text-red-600 font-medium text-sm">Высокая срочность</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex space-x-3">
          <Button
            @click="viewRequest(request)"
            variant="secondary"
            class="flex-1"
            :disabled="!!request.myResponseId"
          >
            {{ request.myResponseId ? 'Просмотрено' : 'Подробнее' }}
          </Button>
          <Button
            @click="respondToRequest(request)"
            class="flex-1"
            :disabled="!!request.myResponseId || request.status !== 'OPEN'"
          >
            {{ request.myResponseId ? 'Отклик отправлен' : 'Откликнуться' }}
          </Button>
        </div>
      </Card>
    </div>
  </div>
</template>
