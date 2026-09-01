<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'

const route = useRoute()
const router = useRouter()
const telegramStore = useTelegramStore()

const serviceId = ref(Number(route.params.id))
const activeTab = ref<'new' | 'active' | 'completed'>('new')

// Данные услуги (Service)
const service = ref({
  id: '1',
  tutorId: 'tutor-1',
  subjectId: 'math-1',
  teacherId: 'teacher-1',
  price: 220000, // в копейках (2200 рублей)
  description: 'Подготовка к ЕГЭ по математике',
  workingHours: 'Пн-Пт 18:00-22:00',
  status: 'ACTIVE',
  deadline: null,
  createdAt: '2024-01-10T10:00:00',
  updatedAt: '2024-01-18T10:00:00',
  // Связанные данные
  subject: {
    name: 'Математика',
  },
  teacher: {
    fullName: 'Подготовка к ЕГЭ',
  },
})

// Отклики студентов на услугу (ServiceResponse)
const responses = ref([
  {
    id: '1',
    studentId: 'student-1',
    serviceId: 'service-1',
    message:
      'Здравствуйте! Мне нужна помощь в подготовке к ЕГЭ по математике. Особенно сложно даются задания по геометрии.',
    price: 220000, // студент согласен с ценой услуги
    proposedDeadline: '2024-01-22T18:00:00',
    status: 'PENDING',
    createdAt: '2024-01-15T10:30:00',
    updatedAt: '2024-01-15T10:30:00',
    // Связанные данные
    student: {
      name: 'Анна Петрова',
      rating: 4.5,
    },
    service: {
      price: 220000,
      subject: {
        name: 'Математика',
      },
      teacher: {
        fullName: 'Подготовка к ЕГЭ',
      },
    },
  },
  {
    id: '2',
    studentId: 'student-2',
    serviceId: 'service-1',
    message:
      'Нужна помощь с алгеброй, готовлюсь к ЕГЭ заранее. Хотелось бы заниматься 2 раза в неделю.',
    price: 200000, // студент предложил меньше
    proposedDeadline: '2024-01-20T16:00:00',
    status: 'ACCEPTED',
    createdAt: '2024-01-14T15:20:00',
    updatedAt: '2024-01-15T09:30:00',
    // Связанные данные
    student: {
      name: 'Максим Иванов',
      rating: 4.8,
    },
    service: {
      price: 220000,
      subject: {
        name: 'Математика',
      },
      teacher: {
        fullName: 'Подготовка к ЕГЭ',
      },
    },
  },
  {
    id: '3',
    studentId: 'student-3',
    serviceId: 'service-1',
    message: 'Мне нужна интенсивная подготовка к ЕГЭ, до экзамена осталось 3 месяца.',
    price: 250000, // студент предложил больше
    proposedDeadline: '2024-01-25T19:00:00',
    status: 'PENDING',
    createdAt: '2024-01-13T18:45:00',
    updatedAt: '2024-01-13T18:45:00',
    // Связанные данные
    student: {
      name: 'Дмитрий Волков',
      rating: 4.6,
    },
    service: {
      price: 220000,
      subject: {
        name: 'Математика',
      },
      teacher: {
        fullName: 'Подготовка к ЕГЭ',
      },
    },
  },
])

const filteredResponses = computed(() => {
  switch (activeTab.value) {
    case 'new':
      return responses.value.filter((response) => response.status === 'PENDING')
    case 'active':
      return responses.value.filter((response) => response.status === 'ACCEPTED')
    case 'completed':
      return responses.value.filter(
        (response) => response.status === 'REJECTED' || response.status === 'EXPIRED',
      )
    default:
      return responses.value
  }
})

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'new':
      return 'Новый'
    case 'active':
      return 'Активный'
    case 'completed':
      return 'Завершен'
    default:
      return status
  }
}

const getUrgencyClass = (urgency: string): string => {
  switch (urgency) {
    case 'Срочно':
      return 'bg-red-500/20 text-red-600'
    case 'В течение недели':
      return 'bg-yellow-500/20 text-yellow-600'
    case 'В течение месяца':
      return 'bg-green-500/20 text-green-600'
    default:
      return 'bg-telegram-secondary text-telegram-text-secondary'
  }
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

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
        color: 'bg-telegram-text-secondary',
        text: 'Истек',
        textColor: 'text-telegram-text-secondary',
      }
    default:
      return {
        color: 'bg-telegram-text-secondary',
        text: 'Неизвестно',
        textColor: 'text-telegram-text-secondary',
      }
  }
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

const goBack = () => {
  telegramStore.hapticFeedback('light')
  router.back()
}

const acceptResponse = (response: any) => {
  telegramStore.hapticFeedback('medium')
  response.status = 'ACCEPTED'
  response.updatedAt = new Date().toISOString()
  console.log('Отклик принят:', response.student.name)
  // TODO: API call для создания Deal
}

const rejectResponse = (response: any) => {
  telegramStore.hapticFeedback('heavy')
  response.status = 'REJECTED'
  response.updatedAt = new Date().toISOString()
  console.log('Отклик отклонен:', response.student.name)
  // TODO: API call
}

const contactStudent = (response: any) => {
  telegramStore.hapticFeedback('light')
  console.log('Связаться с учеником:', response.student.name)
  // TODO: Открыть чат или переход к контактам
}

const completeLessons = (response: any) => {
  telegramStore.hapticFeedback('light')
  response.status = 'completed'
  console.log('Уроки завершены:', response.student.name)
  // TODO: API call
}

onMounted(() => {
  // TODO: Загрузить данные услуги и откликов по serviceId
})
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <!-- Header -->
    <div class="flex items-center mb-6">
      <button
        @click="goBack"
        class="p-2 -ml-2 rounded-lg hover:bg-telegram-secondary transition-colors mr-3"
      >
        <svg
          class="w-5 h-5 text-telegram-text"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <div class="flex-1">
        <h1 class="text-xl font-bold text-telegram-text mb-1">
          {{ service.subject.name }} • {{ service.teacher.fullName }}
        </h1>
        <p class="text-telegram-text-secondary text-sm">
          {{ service.description }} • {{ service.price }}₽
        </p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex space-x-1 mb-6 bg-telegram-secondary rounded-lg p-1">
      <button
        @click="activeTab = 'new'"
        :class="[
          'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
          activeTab === 'new'
            ? 'bg-telegram-accent text-white shadow-xs'
            : 'text-telegram-text-secondary hover:text-telegram-text',
        ]"
      >
        Новые отклики
        <span
          v-if="responses.filter((r) => r.status === 'PENDING').length > 0"
          class="ml-2 px-2 py-0.5 rounded-full text-xs"
          :class="activeTab === 'new' ? 'bg-white/20' : 'bg-telegram-accent text-white'"
        >
          {{ responses.filter((r) => r.status === 'PENDING').length }}
        </span>
      </button>
      <button
        @click="activeTab = 'active'"
        :class="[
          'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
          activeTab === 'active'
            ? 'bg-telegram-accent text-white shadow-xs'
            : 'text-telegram-text-secondary hover:text-telegram-text',
        ]"
      >
        Активные
        <span
          v-if="responses.filter((r) => r.status === 'ACCEPTED').length > 0"
          class="ml-2 px-2 py-0.5 rounded-full text-xs"
          :class="activeTab === 'active' ? 'bg-white/20' : 'bg-telegram-accent text-white'"
        >
          {{ responses.filter((r) => r.status === 'ACCEPTED').length }}
        </span>
      </button>
      <button
        @click="activeTab = 'completed'"
        :class="[
          'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
          activeTab === 'completed'
            ? 'bg-telegram-accent text-white shadow-xs'
            : 'text-telegram-text-secondary hover:text-telegram-text',
        ]"
      >
        Завершенные
        <span
          v-if="
            responses.filter((r) => r.status === 'REJECTED' || r.status === 'EXPIRED').length > 0
          "
          class="ml-2 px-2 py-0.5 rounded-full text-xs"
          :class="activeTab === 'completed' ? 'bg-white/20' : 'bg-telegram-accent text-white'"
        >
          {{ responses.filter((r) => r.status === 'REJECTED' || r.status === 'EXPIRED').length }}
        </span>
      </button>
    </div>

    <!-- Responses List -->
    <div v-if="filteredResponses.length > 0" class="space-y-4">
      <Card v-for="response in filteredResponses" :key="response.id" class="p-6">
        <!-- Student Info -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div
              class="w-12 h-12 bg-telegram-accent/20 rounded-full flex items-center justify-center"
            >
              <span class="text-telegram-accent font-semibold">
                {{
                  response.student.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                }}
              </span>
            </div>
            <div>
              <h3 class="font-semibold text-telegram-text">{{ response.student.name }}</h3>
              <div class="flex items-center space-x-2 text-sm text-telegram-text-secondary">
                <svg class="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <span>{{ response.student.rating }}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col items-end space-y-2">
            <span class="text-xs text-telegram-text-secondary">{{
              formatDate(response.createdAt)
            }}</span>
            <div
              :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                getResponseStatusInfo(response.status).color,
                'text-white',
              ]"
            >
              {{ getResponseStatusInfo(response.status).text }}
            </div>
          </div>
        </div>

        <!-- Message -->
        <div class="mb-4">
          <p class="text-telegram-text text-sm">{{ response.message }}</p>
        </div>

        <!-- Price Details -->
        <div class="grid grid-cols-2 gap-4 mb-4 p-3 bg-telegram-secondary/50 rounded-lg">
          <div>
            <span class="text-xs text-telegram-text-secondary">Предложенная цена:</span>
            <div class="text-sm font-medium text-telegram-success">{{ response.price }}₽</div>
          </div>
          <div>
            <span class="text-xs text-telegram-text-secondary">Цена услуги:</span>
            <div class="text-sm font-medium text-telegram-text">{{ response.service.price }}₽</div>
          </div>
        </div>

        <!-- Deadline -->
        <div v-if="response.proposedDeadline" class="mb-4 p-3 bg-telegram-secondary/30 rounded-lg">
          <div class="flex items-center justify-between">
            <span class="text-sm text-telegram-text-secondary">Предложенный дедлайн:</span>
            <span class="text-sm font-medium text-telegram-text">
              {{ formatDeadline(response.proposedDeadline) }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex space-x-3">
          <!-- Pending Response Actions -->
          <template v-if="response.status === 'PENDING'">
            <Button @click="acceptResponse(response)" class="flex-1">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Принять
            </Button>
            <Button @click="rejectResponse(response)" variant="secondary" class="flex-1">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Отклонить
            </Button>
          </template>

          <!-- Active Response Actions -->
          <template v-else-if="response.status === 'active'">
            <Button @click="contactStudent(response)" variant="secondary" class="flex-1">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Связаться
            </Button>
            <Button @click="completeLessons(response)" class="flex-1">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Завершить
            </Button>
          </template>

          <!-- Completed Response Actions -->
          <template v-else-if="response.status === 'completed'">
            <Button @click="contactStudent(response)" variant="secondary" class="flex-1">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Написать
            </Button>
          </template>
        </div>
      </Card>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <div
        class="w-20 h-20 bg-telegram-secondary rounded-full mx-auto mb-6 flex items-center justify-center"
      >
        <svg
          class="w-10 h-10 text-telegram-text-secondary"
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
        {{
          activeTab === 'new'
            ? 'Пока нет новых откликов'
            : activeTab === 'active'
              ? 'Нет активных откликов'
              : 'Нет завершенных откликов'
        }}
      </h2>

      <p class="text-telegram-text-secondary max-w-sm mx-auto">
        {{
          activeTab === 'new'
            ? 'Когда ученики начнут откликаться на вашу услугу, они появятся здесь'
            : activeTab === 'active'
              ? 'Принятые отклики будут отображаться в этом разделе'
              : 'Завершенные уроки с учениками будут показаны здесь'
        }}
      </p>
    </div>
  </div>
</template>
