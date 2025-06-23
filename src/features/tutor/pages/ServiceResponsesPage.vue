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

// Тестовые данные услуги
const service = ref({
  id: 1,
  title: 'Подготовка к ЕГЭ по математике',
  subject: 'Математика',
  level: 'ЕГЭ',
  price: 2200,
})

// Тестовые данные откликов
const responses = ref([
  {
    id: 1,
    student: {
      name: 'Анна Петрова',
      avatar: null,
      grade: '11 класс',
      location: 'Москва',
    },
    message:
      'Здравствуйте! Мне нужна помощь в подготовке к ЕГЭ по математике. Особенно сложно даются задания по геометрии.',
    requestedFormat: 'Онлайн',
    budget: 2200,
    urgency: 'В течение недели',
    createdAt: '2024-01-15T10:30:00Z',
    status: 'new',
    rating: null,
    completedLessons: 0,
  },
  {
    id: 2,
    student: {
      name: 'Максим Иванов',
      avatar: null,
      grade: '10 класс',
      location: 'Санкт-Петербург',
    },
    message:
      'Нужна помощь с алгеброй, готовлюсь к ЕГЭ заранее. Хотелось бы заниматься 2 раза в неделю.',
    requestedFormat: 'Онлайн',
    budget: 2000,
    urgency: 'Срочно',
    createdAt: '2024-01-14T15:20:00Z',
    status: 'active',
    rating: 4.8,
    completedLessons: 5,
  },
  {
    id: 3,
    student: {
      name: 'София Козлова',
      avatar: null,
      grade: '11 класс',
      location: 'Екатеринбург',
    },
    message: 'Занимались 3 месяца, очень довольна результатом! Спасибо за качественную подготовку.',
    requestedFormat: 'Онлайн',
    budget: 2200,
    urgency: 'В течение месяца',
    createdAt: '2024-01-10T09:15:00Z',
    status: 'completed',
    rating: 5.0,
    completedLessons: 12,
  },
  {
    id: 4,
    student: {
      name: 'Дмитрий Волков',
      avatar: null,
      grade: '11 класс',
      location: 'Новосибирск',
    },
    message: 'Мне нужна интенсивная подготовка к ЕГЭ, до экзамена осталось 3 месяца.',
    requestedFormat: 'Онлайн',
    budget: 2500,
    urgency: 'Срочно',
    createdAt: '2024-01-13T18:45:00Z',
    status: 'new',
    rating: null,
    completedLessons: 0,
  },
])

const filteredResponses = computed(() => {
  return responses.value.filter((response) => response.status === activeTab.value)
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
      return 'bg-telegram-secondary text-telegram-textSecondary'
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

const goBack = () => {
  telegramStore.hapticFeedback('light')
  router.back()
}

const acceptResponse = (response: any) => {
  telegramStore.hapticFeedback('medium')
  response.status = 'active'
  console.log('Отклик принят:', response.student.name)
  // TODO: API call
}

const rejectResponse = (response: any) => {
  telegramStore.hapticFeedback('heavy')
  console.log('Отклик отклонен:', response.student.name)
  // TODO: API call и удаление из списка
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
        <h1 class="text-xl font-bold text-telegram-text mb-1">{{ service.title }}</h1>
        <p class="text-telegram-textSecondary text-sm">
          {{ service.subject }} • {{ service.price }}₽
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
            ? 'bg-telegram-accent text-white shadow-sm'
            : 'text-telegram-textSecondary hover:text-telegram-text',
        ]"
      >
        Новые отклики
        <span
          v-if="responses.filter((r) => r.status === 'new').length > 0"
          class="ml-2 px-2 py-0.5 rounded-full text-xs"
          :class="activeTab === 'new' ? 'bg-white/20' : 'bg-telegram-accent text-white'"
        >
          {{ responses.filter((r) => r.status === 'new').length }}
        </span>
      </button>
      <button
        @click="activeTab = 'active'"
        :class="[
          'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
          activeTab === 'active'
            ? 'bg-telegram-accent text-white shadow-sm'
            : 'text-telegram-textSecondary hover:text-telegram-text',
        ]"
      >
        Активные
        <span
          v-if="responses.filter((r) => r.status === 'active').length > 0"
          class="ml-2 px-2 py-0.5 rounded-full text-xs"
          :class="activeTab === 'active' ? 'bg-white/20' : 'bg-telegram-accent text-white'"
        >
          {{ responses.filter((r) => r.status === 'active').length }}
        </span>
      </button>
      <button
        @click="activeTab = 'completed'"
        :class="[
          'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
          activeTab === 'completed'
            ? 'bg-telegram-accent text-white shadow-sm'
            : 'text-telegram-textSecondary hover:text-telegram-text',
        ]"
      >
        Завершенные
        <span
          v-if="responses.filter((r) => r.status === 'completed').length > 0"
          class="ml-2 px-2 py-0.5 rounded-full text-xs"
          :class="activeTab === 'completed' ? 'bg-white/20' : 'bg-telegram-accent text-white'"
        >
          {{ responses.filter((r) => r.status === 'completed').length }}
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
              <div class="flex items-center space-x-2 text-sm text-telegram-textSecondary">
                <span>{{ response.student.grade }}</span>
                <span>•</span>
                <span>{{ response.student.location }}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col items-end space-y-2">
            <span class="text-xs text-telegram-textSecondary">{{
              formatDate(response.createdAt)
            }}</span>
            <span
              :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                getUrgencyClass(response.urgency),
              ]"
            >
              {{ response.urgency }}
            </span>
          </div>
        </div>

        <!-- Message -->
        <div class="mb-4">
          <p class="text-telegram-text text-sm">{{ response.message }}</p>
        </div>

        <!-- Request Details -->
        <div class="grid grid-cols-2 gap-4 mb-4 p-3 bg-telegram-secondary/50 rounded-lg">
          <div>
            <span class="text-xs text-telegram-textSecondary">Формат:</span>
            <div class="text-sm font-medium text-telegram-text">{{ response.requestedFormat }}</div>
          </div>
          <div>
            <span class="text-xs text-telegram-textSecondary">Бюджет:</span>
            <div class="text-sm font-medium text-telegram-success">{{ response.budget }}₽</div>
          </div>
        </div>

        <!-- Progress (for active and completed) -->
        <div v-if="response.status !== 'new'" class="mb-4 p-3 bg-telegram-secondary/30 rounded-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-telegram-textSecondary">Прогресс</span>
            <span v-if="response.rating" class="flex items-center space-x-1">
              <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
              <span class="text-sm font-medium text-telegram-text">{{ response.rating }}</span>
            </span>
          </div>
          <div class="text-sm text-telegram-text">
            Проведено уроков: <span class="font-medium">{{ response.completedLessons }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex space-x-3">
          <!-- New Response Actions -->
          <template v-if="response.status === 'new'">
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
        {{
          activeTab === 'new'
            ? 'Пока нет новых откликов'
            : activeTab === 'active'
              ? 'Нет активных откликов'
              : 'Нет завершенных откликов'
        }}
      </h2>

      <p class="text-telegram-textSecondary max-w-sm mx-auto">
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
