<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTelegramStore } from '@/stores/telegram'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'

const telegramStore = useTelegramStore()

// Моковые данные заявок от студентов
const requests = ref([
  {
    id: 1,
    student: {
      name: 'Мария Васильева',
      avatar: 'МВ',
      rating: 4.8,
    },
    subject: 'Математика',
    description:
      'Нужна помощь с подготовкой к ЕГЭ по математике. Особенно сложно даются задачи с параметрами и геометрия.',
    budget: 2000,
    format: 'Онлайн',
    urgency: 'normal',
    schedule: 'Вторник, четверг вечером',
    createdAt: '2024-01-18T14:30:00',
    status: 'new',
    teacherName: null,
  },
  {
    id: 2,
    student: {
      name: 'Алексей Козлов',
      avatar: 'АК',
      rating: 4.5,
    },
    subject: 'Физика',
    description:
      'Подготовка к экзамену в университете. Нужно разобрать электричество и магнетизм, оптику.',
    budget: 1800,
    format: 'Очно',
    urgency: 'urgent',
    schedule: 'Выходные днем',
    createdAt: '2024-01-18T16:15:00',
    status: 'viewed',
    teacherName: null,
  },
  {
    id: 3,
    student: {
      name: 'София Петрова',
      avatar: 'СП',
      rating: 5.0,
    },
    subject: 'Химия',
    description:
      'Помощь с органической химией для подготовки к олимпиаде. Нужны задачи повышенной сложности.',
    budget: 2500,
    format: 'Любой формат',
    urgency: 'normal',
    schedule: 'Будни вечером',
    createdAt: '2024-01-17T20:45:00',
    status: 'responded',
    teacherName: null,
  },
  {
    id: 4,
    student: {
      name: 'Денис Смирнов',
      avatar: 'ДС',
      rating: 4.2,
    },
    subject: 'Математика',
    description:
      'Подготовка к поступлению в технический вуз. Нужна помощь с алгеброй и началами анализа.',
    budget: 1500,
    format: 'Онлайн',
    urgency: 'normal',
    schedule: 'Гибкий график',
    createdAt: '2024-01-17T11:20:00',
    status: 'new',
    teacherName: 'Иванов И.И.',
  },
])

const selectedFilter = ref<'all' | 'new' | 'viewed' | 'responded'>('all')

const filteredRequests = computed(() => {
  if (selectedFilter.value === 'all') return requests.value
  return requests.value.filter((request) => request.status === selectedFilter.value)
})

const newRequestsCount = computed(() => requests.value.filter((r) => r.status === 'new').length)
const viewedRequestsCount = computed(
  () => requests.value.filter((r) => r.status === 'viewed').length,
)
const respondedRequestsCount = computed(
  () => requests.value.filter((r) => r.status === 'responded').length,
)

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

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'new':
      return { color: 'bg-telegram-accent', text: 'Новая' }
    case 'viewed':
      return { color: 'bg-orange-500', text: 'Просмотрена' }
    case 'responded':
      return { color: 'bg-telegram-success', text: 'Отклик отправлен' }
    default:
      return { color: 'bg-telegram-textSecondary', text: 'Неизвестно' }
  }
}

const getUrgencyInfo = (urgency: string) => {
  return urgency === 'urgent'
    ? { color: 'text-red-500', text: 'Срочно', icon: '🔥' }
    : { color: 'text-telegram-textSecondary', text: 'Обычная', icon: '⏰' }
}

const viewRequest = (request: any) => {
  telegramStore.hapticFeedback('light')
  if (request.status === 'new') {
    request.status = 'viewed'
  }
  console.log('Просмотр заявки:', request.id)
}

const respondToRequest = (request: any) => {
  telegramStore.hapticFeedback('medium')
  request.status = 'responded'
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
              {{ request.student.avatar }}
            </div>
            <div>
              <h3 class="text-telegram-text font-semibold">{{ request.student.name }}</h3>
              <div class="flex items-center space-x-2">
                <p class="text-telegram-textSecondary text-sm">{{ request.subject }}</p>
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
              <div :class="[getStatusInfo(request.status).color, 'w-2 h-2 rounded-full']"></div>
              <span class="text-telegram-textSecondary text-xs">{{
                getStatusInfo(request.status).text
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
            <p class="text-telegram-success font-semibold">{{ request.budget }}₽/занятие</p>
          </div>
          <div>
            <p class="text-telegram-textSecondary text-xs mb-1">Формат</p>
            <p class="text-telegram-text font-semibold">{{ request.format }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p class="text-telegram-textSecondary text-xs mb-1">График</p>
            <p class="text-telegram-text text-sm">{{ request.schedule }}</p>
          </div>
          <div>
            <p class="text-telegram-textSecondary text-xs mb-1">Опубликована</p>
            <p class="text-telegram-text text-sm">{{ formatDate(request.createdAt) }}</p>
          </div>
        </div>

        <!-- Teacher requirement -->
        <div
          v-if="request.teacherName"
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span class="text-telegram-accent font-medium text-sm">
              Нужен преподаватель: {{ request.teacherName }}
            </span>
          </div>
        </div>

        <!-- Urgency badge -->
        <div
          v-if="request.urgency === 'urgent'"
          class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4"
        >
          <div class="flex items-center space-x-2">
            <span class="text-lg">🔥</span>
            <span class="text-red-600 font-medium text-sm">Срочная заявка (+200₽)</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex space-x-3">
          <Button
            @click="viewRequest(request)"
            variant="secondary"
            class="flex-1"
            :disabled="request.status === 'responded'"
          >
            {{ request.status === 'responded' ? 'Просмотрено' : 'Подробнее' }}
          </Button>
          <Button
            @click="respondToRequest(request)"
            class="flex-1"
            :disabled="request.status === 'responded'"
          >
            {{ request.status === 'responded' ? 'Отклик отправлен' : 'Откликнуться' }}
          </Button>
        </div>
      </Card>
    </div>
  </div>
</template>
