<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'

const router = useRouter()
const telegramStore = useTelegramStore()

// Типы табов
type Tab = 'services' | 'responses' | 'deals'
const activeTab = ref<Tab>('services')

// Типы состояний услуг
type ServiceStatus = 'active' | 'frozen' | 'deleted'

interface Service {
  id: number
  title: string
  subject: string
  teacher: string
  level: string
  description: string
  price: number
  duration: number
  format: string[]
  status: ServiceStatus
  studentsCount: number
  rating: number
  reviewsCount: number
  features: string[]
  responsesCount: number
  newResponsesCount: number
  activeResponsesCount: number
  hasActiveDeals: boolean
}

// Типы для активных сделок
interface ActiveDeal {
  id: number
  studentId: string
  studentName: string
  studentAvatar?: string
  serviceTitle: string
  subject: string
  teacher: string
  taskDescription: string
  tutorComment?: string
  price: number
  deadline?: Date
  status: 'pending' | 'accepted' | 'in_progress' | 'completed'
  createdAt: Date
  lastActivity: Date
}

// Типы для откликов репетитора на заявки студентов
interface RequestResponse {
  id: number
  tutorId: string
  requestId: number
  studentName: string
  studentAvatar?: string
  requestTitle: string
  requestDescription: string
  message?: string
  price?: number
  proposedDeadline?: Date
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  createdAt: Date
  budget?: number
  urgency?: 'low' | 'medium' | 'high'
}

const tabs = [
  { id: 'services', label: 'Заявки', icon: '📋' },
  { id: 'responses', label: 'Отклики', icon: '📤' },
  { id: 'deals', label: 'Активные', icon: '🟢' },
] as const

// Примеры услуг репетитора
const services = ref<Service[]>([
  {
    id: 1,
    title: 'Подготовка к ЕГЭ по математике',
    subject: 'Математика',
    teacher: 'Иван Иванов',
    level: 'ЕГЭ',
    description:
      'Комплексная подготовка к ЕГЭ по математике профильного уровня. Разбор всех типов заданий, работа с ошибками, решение вариантов.',
    price: 2200,
    duration: 90,
    format: ['Онлайн', 'Очно'],
    status: 'active',
    studentsCount: 15,
    rating: 4.9,
    reviewsCount: 43,
    responsesCount: 12,
    newResponsesCount: 3,
    activeResponsesCount: 8,
    hasActiveDeals: true,
    features: [
      'Индивидуальный план подготовки',
      'Домашние задания с проверкой',
      'Пробные тесты ЕГЭ',
      'Разбор типичных ошибок',
    ],
  },
  {
    id: 2,
    title: 'Алгебра для 8-9 классов',
    subject: 'Математика',
    teacher: 'Иван Иванов',
    level: 'ОГЭ',
    description:
      'Помощь с изучением алгебры в 8-9 классах, подготовка к ОГЭ. Работа с уравнениями, неравенствами, функциями.',
    price: 1800,
    duration: 60,
    format: ['Онлайн'],
    status: 'frozen',
    studentsCount: 8,
    rating: 4.8,
    reviewsCount: 21,
    responsesCount: 5,
    newResponsesCount: 0,
    activeResponsesCount: 2,
    hasActiveDeals: false,
    features: [
      'Объяснение сложных тем',
      'Практические задания',
      'Подготовка к контрольным',
      'Регулярная обратная связь',
    ],
  },
  {
    id: 3,
    title: 'Геометрия с нуля',
    subject: 'Математика',
    teacher: 'Иван Иванов',
    level: 'Школьная программа',
    description:
      'Изучение геометрии с основ. Подходит для учеников 7-11 классов, которые хотят разобраться в предмете.',
    price: 2000,
    duration: 75,
    format: ['Очно'],
    status: 'active',
    studentsCount: 3,
    rating: 4.7,
    reviewsCount: 12,
    responsesCount: 8,
    newResponsesCount: 1,
    activeResponsesCount: 4,
    hasActiveDeals: false,
    features: [
      'Основы планиметрии',
      'Стереометрия',
      'Решение задач разной сложности',
      'Визуализация теорем',
    ],
  },
  {
    id: 4,
    title: 'Олимпиадная математика',
    subject: 'Математика',
    teacher: 'Иван Иванов',
    level: 'Олимпиады',
    description:
      'Подготовка к математическим олимпиадам различного уровня. Нестандартные задачи, развитие логического мышления.',
    price: 3000,
    duration: 120,
    format: ['Онлайн', 'Очно'],
    status: 'deleted',
    studentsCount: 5,
    rating: 5.0,
    reviewsCount: 8,
    responsesCount: 2,
    newResponsesCount: 0,
    activeResponsesCount: 0,
    hasActiveDeals: false,
    features: [
      'Нестандартные задачи',
      'Развитие логики',
      'Подготовка к конкурсам',
      'Индивидуальный подход',
    ],
  },
])

// Примеры активных сделок
const activeDeals = ref<ActiveDeal[]>([
  {
    id: 1,
    studentId: 'student3',
    studentName: 'София Иванова',
    studentAvatar: undefined,
    serviceTitle: 'Геометрия с нуля',
    subject: 'Математика',
    teacher: 'Иванов Петр Сергеевич',
    taskDescription:
      'Совсем не понимаю геометрию, нужна помощь с основами. Особенно сложно с теоремами и доказательствами.',
    tutorComment:
      'Готов помочь разобраться с геометрией пошагово. Начнем с основных понятий и постепенно перейдем к более сложным темам.',
    price: 2000,
    deadline: new Date('2024-03-15'),
    status: 'in_progress',
    createdAt: new Date('2024-01-13T12:00:00'),
    lastActivity: new Date('2024-01-20T16:30:00'),
  },
  {
    id: 2,
    studentId: 'student4',
    studentName: 'Алексей Кузнецов',
    studentAvatar: undefined,
    serviceTitle: 'Алгебра для 8-9 классов',
    subject: 'Математика',
    teacher: 'Смирнова Анна Владимировна',
    taskDescription:
      'Нужна подготовка к ОГЭ по алгебре. Сложности с решением уравнений и неравенств.',
    tutorComment: 'Занятия будут включать разбор типовых заданий ОГЭ и практические упражнения.',
    price: 1800,
    deadline: new Date('2024-02-28'),
    status: 'accepted',
    createdAt: new Date('2024-01-10T14:20:00'),
    lastActivity: new Date('2024-01-19T10:15:00'),
  },
])

// Примеры откликов репетитора на заявки студентов
const requestResponses = ref<RequestResponse[]>([
  {
    id: 1,
    tutorId: 'current-tutor',
    requestId: 1,
    studentName: 'Анна Смирнова',
    studentAvatar: undefined,
    requestTitle: 'Подготовка к ЕГЭ по математике',
    requestDescription:
      'Нужна помощь с подготовкой к ЕГЭ по математике, особенно с алгеброй и геометрией.',
    message:
      'Здравствуйте! Готов помочь с подготовкой к ЕГЭ. У меня большой опыт подготовки учеников к экзаменам.',
    price: 2200,
    proposedDeadline: new Date('2024-05-15'),
    status: 'pending',
    createdAt: new Date('2024-01-15T10:30:00'),
    budget: 2500,
    urgency: 'high',
  },
  {
    id: 2,
    tutorId: 'current-tutor',
    requestId: 2,
    studentName: 'Михаил Петров',
    studentAvatar: undefined,
    requestTitle: 'Алгебра 9 класс',
    requestDescription: 'Помощь с алгеброй в 9 классе, подготовка к ОГЭ.',
    message: 'Могу помочь с алгеброй и подготовкой к ОГЭ. Предлагаю индивидуальный подход.',
    price: 1800,
    proposedDeadline: new Date('2024-04-20'),
    status: 'accepted',
    createdAt: new Date('2024-01-14T15:20:00'),
    budget: 2000,
    urgency: 'medium',
  },
  {
    id: 3,
    tutorId: 'current-tutor',
    requestId: 3,
    studentName: 'София Иванова',
    studentAvatar: undefined,
    requestTitle: 'Геометрия с нуля',
    requestDescription: 'Совсем не понимаю геометрию, нужна помощь с основами.',
    message: 'Специализируюсь на объяснении геометрии с нуля. Использую наглядные методы.',
    price: 2000,
    proposedDeadline: undefined,
    status: 'rejected',
    createdAt: new Date('2024-01-13T09:15:00'),
    budget: 1800,
    urgency: 'low',
  },
])

// Функции для работы с услугами
const getStatusLabel = (status: ServiceStatus): string => {
  switch (status) {
    case 'active':
      return 'Активна'
    case 'frozen':
      return 'Заморожена'
    case 'deleted':
      return 'Удалена'
  }
}

const getStatusClass = (status: ServiceStatus): string => {
  switch (status) {
    case 'active':
      return 'bg-telegram-success/20 text-telegram-success'
    case 'frozen':
      return 'bg-yellow-500/20 text-yellow-600'
    case 'deleted':
      return 'bg-red-500/20 text-red-600'
  }
}

// Функции для работы с откликами
const getResponseStatusLabel = (status: RequestResponse['status']): string => {
  switch (status) {
    case 'pending':
      return 'Ожидает ответа'
    case 'accepted':
      return 'Принят'
    case 'rejected':
      return 'Отклонен'
    case 'expired':
      return 'Истек срок'
  }
}

const getResponseStatusClass = (status: RequestResponse['status']): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-600'
    case 'accepted':
      return 'bg-telegram-success/20 text-telegram-success'
    case 'rejected':
      return 'bg-red-500/20 text-red-600'
    case 'expired':
      return 'bg-gray-500/20 text-gray-600'
  }
}

const getUrgencyLabel = (urgency?: RequestResponse['urgency']): string => {
  switch (urgency) {
    case 'high':
      return 'Срочно'
    case 'medium':
      return 'Средняя'
    case 'low':
      return 'Не срочно'
    default:
      return ''
  }
}

const getUrgencyClass = (urgency?: RequestResponse['urgency']): string => {
  switch (urgency) {
    case 'high':
      return 'text-red-600'
    case 'medium':
      return 'text-yellow-600'
    case 'low':
      return 'text-green-600'
    default:
      return 'text-telegram-textSecondary'
  }
}

// Функции для работы с активными сделками
const getDealStatusLabel = (status: ActiveDeal['status']): string => {
  switch (status) {
    case 'pending':
      return 'Ожидает подтверждения'
    case 'accepted':
      return 'Принята'
    case 'in_progress':
      return 'В процессе'
    case 'completed':
      return 'Завершена'
  }
}

const getDealStatusClass = (status: ActiveDeal['status']): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-600'
    case 'accepted':
      return 'bg-blue-500/20 text-blue-600'
    case 'in_progress':
      return 'bg-telegram-accent/20 text-telegram-accent'
    case 'completed':
      return 'bg-telegram-success/20 text-telegram-success'
  }
}

// Основные действия
const createService = () => {
  telegramStore.hapticFeedback('light')
  router.push('/tutor/services/create')
}

const viewService = (service: Service) => {
  if (service.status === 'deleted') return

  telegramStore.hapticFeedback('light')
  router.push(`/tutor/services/${service.id}/responses`)
}

const editService = (service: Service) => {
  telegramStore.hapticFeedback('light')
  router.push(`/tutor/services/${service.id}/edit`)
}

// Действия с активными сделками
const viewDealDetails = (deal: ActiveDeal) => {
  telegramStore.hapticFeedback('light')
  console.log('Просмотр сделки:', deal.id)
  // TODO: Перейти к деталям сделки
}

const completeDeal = (deal: ActiveDeal) => {
  telegramStore.hapticFeedback('medium')
  deal.status = 'completed'
  console.log('Сделка завершена:', deal.id)
}

// Действия с откликами
const withdrawResponse = (response: RequestResponse) => {
  telegramStore.hapticFeedback('medium')
  console.log('Отозвать отклик:', response.requestTitle)
  // TODO: Отозвать отклик
}

// Переключение табов
const switchTab = (tab: Tab) => {
  telegramStore.hapticFeedback('light')
  activeTab.value = tab
}

// Фильтруем неудаленные услуги для основного списка
const activeServices = ref(services.value.filter((s) => s.status !== 'deleted'))

// Подсчет количества для табов
const pendingResponsesCount = ref(
  requestResponses.value.filter((r) => r.status === 'pending').length,
)
const activeDealsCount = ref(
  activeDeals.value.filter((d) => d.status === 'in_progress' || d.status === 'accepted').length,
)
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-telegram-text mb-2">Управление услугами</h1>
        <p class="text-telegram-textSecondary">Услуги, отклики и активные занятия</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex bg-telegram-secondary rounded-xl p-1 mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="switchTab(tab.id as Tab)"
        :class="[
          'flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200',
          activeTab === tab.id
            ? 'bg-telegram-card text-telegram-text shadow-sm'
            : 'text-telegram-textSecondary hover:text-telegram-text',
        ]"
      >
        <span class="text-base">{{ tab.icon }}</span>
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <!-- Services Tab -->
    <div v-if="activeTab === 'services'">
      <!-- Empty State when no services -->
      <div v-if="activeServices.length === 0" class="text-center py-16">
        <div
          class="w-24 h-24 bg-gradient-to-br from-telegram-accent/20 to-telegram-accent/10 rounded-full mx-auto mb-6 flex items-center justify-center"
        >
          <svg
            class="w-12 h-12 text-telegram-accent"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>

        <h2 class="text-2xl font-bold text-telegram-text mb-3">Создайте свои услуги</h2>

        <p class="text-telegram-textSecondary mb-12 max-w-md mx-auto leading-relaxed">
          Добавьте описания ваших услуг репетиторства с указанием предметов, стоимости и условий.
          Студенты смогут найти и выбрать подходящие занятия.
        </p>

        <div class="flex justify-center">
          <Button
            @click="createService"
            class="bg-gradient-to-r from-telegram-accent to-telegram-accent/80 hover:from-telegram-accent/90 hover:to-telegram-accent/70 text-white px-8 py-3 font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/20"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Создать услугу
          </Button>
        </div>
      </div>

      <!-- Services List when has services -->
      <div v-else class="space-y-4">
        <!-- Create Service Card -->
        <Card
          class="p-4 cursor-pointer hover:bg-telegram-accent/5 transition-colors border-2 border-dashed border-telegram-accent/30 hover:border-telegram-accent/50"
          @click="createService"
        >
          <div class="flex items-center space-x-4">
            <div
              class="w-10 h-10 bg-telegram-accent/10 rounded-full flex items-center justify-center flex-shrink-0"
            >
              <svg
                class="w-5 h-5 text-telegram-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-semibold text-telegram-accent">Добавить услугу</h3>
              <p class="text-telegram-textSecondary text-sm">Создайте новую услугу для студентов</p>
            </div>
          </div>
        </Card>

        <!-- Existing Services -->
        <template v-if="activeServices.length > 0">
          <Card
            v-for="service in activeServices"
            :key="service.id"
            class="p-6 cursor-pointer hover:bg-telegram-secondary/50 transition-colors"
            :class="{ 'opacity-60': service.status === 'frozen' }"
            @click="viewService(service)"
          >
            <!-- Header -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <div class="flex items-start justify-between">
                  <h3 class="text-xl font-semibold text-telegram-text">{{ service.title }}</h3>
                  <button
                    @click.stop="editService(service)"
                    class="-mr-5 flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-telegram-secondary transition-colors text-telegram-textSecondary text-sm"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span>Настроить</span>
                  </button>
                </div>

                <p class="text-telegram-textSecondary text-sm mb-3">
                  {{ service.teacher }}
                </p>

                <div class="flex items-center flex-wrap gap-2 mb-3">
                  <span
                    :class="[
                      'px-2 py-1 text-xs font-medium rounded-full',
                      getStatusClass(service.status),
                    ]"
                  >
                    {{ getStatusLabel(service.status) }}
                  </span>
                  <span
                    class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium"
                  >
                    {{ service.price }}₽
                  </span>
                  <span
                    v-if="service.newResponsesCount > 0"
                    class="px-2 py-1 text-xs font-medium rounded-full bg-telegram-accent text-white animate-pulse"
                  >
                    +{{ service.newResponsesCount }} новых
                  </span>
                </div>
              </div>
            </div>

            <!-- Description -->
            <p class="text-telegram-text text-sm mb-4">{{ service.description }}</p>

            <!-- Responses Info -->
            <div class="mb-4 p-3 bg-telegram-secondary/50 rounded-lg">
              <div class="flex items-center justify-between">
                <div class="text-center">
                  <div class="text-lg font-semibold text-telegram-text">
                    {{ service.responsesCount }}
                  </div>
                  <div class="text-xs text-telegram-textSecondary">Всего откликов</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-semibold text-telegram-accent">
                    {{ service.activeResponsesCount }}
                  </div>
                  <div class="text-xs text-telegram-textSecondary">Активных</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-semibold text-telegram-success">
                    {{ service.newResponsesCount }}
                  </div>
                  <div class="text-xs text-telegram-textSecondary">Новых</div>
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
            </div>
          </Card>
        </template>
      </div>
    </div>

    <!-- Responses Tab -->
    <div v-if="activeTab === 'responses'">
      <div v-if="requestResponses.length > 0" class="space-y-4">
        <Card v-for="response in requestResponses" :key="response.id" class="p-4">
          <!-- Header -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-telegram-text mb-1">
                {{ response.requestTitle }}
              </h3>
              <p class="text-telegram-textSecondary text-sm mb-2">{{ response.studentName }}</p>
            </div>
            <div class="flex items-center space-x-2">
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  getResponseStatusClass(response.status),
                ]"
              >
                {{ getResponseStatusLabel(response.status) }}
              </span>
            </div>
          </div>

          <!-- Description -->
          <p class="text-telegram-text text-sm mb-3 leading-relaxed">
            {{ response.requestDescription }}
          </p>

          <!-- Response Info -->
          <div
            class="flex items-center justify-between p-3 bg-telegram-secondary/20 rounded-lg mb-3"
          >
            <div class="flex items-center space-x-4">
              <div v-if="response.price" class="text-center">
                <div class="text-telegram-success font-semibold">{{ response.price }}₽</div>
                <div class="text-xs text-telegram-textSecondary">Моя цена</div>
              </div>
              <div v-if="response.budget" class="text-center">
                <div class="text-telegram-text font-semibold">{{ response.budget }}₽</div>
                <div class="text-xs text-telegram-textSecondary">Бюджет</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-telegram-textSecondary text-xs">
                отправлен {{ response.createdAt.toLocaleDateString('ru-RU') }}
              </div>
            </div>
          </div>

          <!-- My Response -->
          <div class="border-l-4 border-telegram-accent/30 pl-3 mb-4">
            <p class="text-telegram-text text-sm italic">"{{ response.message }}"</p>
          </div>

          <!-- Action -->
          <div
            v-if="response.status === 'pending'"
            class="pt-2 border-t border-telegram-secondary/30 text-center"
          >
            <button
              @click="withdrawResponse(response)"
              class="text-xs text-red-500 hover:underline transition-colors"
            >
              отозвать отклик
            </button>
          </div>
        </Card>
      </div>

      <!-- Empty state для откликов -->
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
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>

        <h2 class="text-xl font-semibold text-telegram-text mb-3">Нет откликов на заявки</h2>

        <p class="text-telegram-textSecondary mb-8 max-w-sm mx-auto">
          Вы еще не откликались на заявки студентов. Ищите подходящие заказы в разделе "Заявки"
        </p>
      </div>
    </div>

    <!-- Active Tab -->
    <div v-if="activeTab === 'deals'">
      <div v-if="activeDeals.length > 0" class="space-y-4">
        <Card
          v-for="deal in activeDeals"
          :key="deal.id"
          class="p-6 cursor-pointer hover:bg-telegram-secondary/50 transition-colors"
          @click="viewDealDetails(deal)"
        >
          <div class="mb-4">
            <div class="flex items-start space-x-4">
              <div
                class="w-12 h-12 bg-telegram-accent/20 rounded-full flex items-center justify-center"
              >
                <span class="text-telegram-accent font-semibold text-lg">
                  {{ deal.studentName.charAt(0) }}
                </span>
              </div>
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <h3 class="text-lg font-semibold text-telegram-text">{{ deal.studentName }}</h3>
                  <span
                    :class="[
                      'px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap',
                      getDealStatusClass(deal.status),
                    ]"
                  >
                    {{ getDealStatusLabel(deal.status) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="space-y-1">
              <h4 class="text-lg font-semibold text-telegram-accent">
                {{ deal.subject }}
              </h4>
              <p class="text-telegram-textSecondary text-sm">
                {{ deal.teacher }}
              </p>
            </div>
          </div>

          <!-- Task Description -->
          <div class="mb-4">
            <div class="flex items-center mb-2">
              <svg
                class="w-4 h-4 text-blue-600 mr-2"
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
              <span class="text-telegram-textSecondary text-xs font-medium uppercase tracking-wide"
                >Задача студента</span
              >
            </div>
            <p class="text-telegram-text text-sm leading-relaxed pl-6">
              {{ deal.taskDescription }}
            </p>
          </div>

          <!-- Tutor Comment -->
          <div v-if="deal.tutorComment" class="mb-4">
            <div class="flex items-center mb-2">
              <svg
                class="w-4 h-4 text-telegram-accent mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <span class="text-telegram-textSecondary text-xs font-medium uppercase tracking-wide"
                >Мой комментарий</span
              >
            </div>
            <div class="border-l-4 border-telegram-accent/30 pl-3 ml-3">
              <p class="text-telegram-text text-sm leading-relaxed">
                {{ deal.tutorComment }}
              </p>
            </div>
          </div>

          <!-- Deal Info -->
          <div
            class="bg-telegram-success/10 border-telegram-success text-telegram-success font-bold text-xl px-4 py-2 rounded-lg text-center mb-3"
          >
            {{ deal.price }}₽
          </div>
          <div
            class="flex items-center justify-around mb-4 p-3 bg-telegram-secondary/30 rounded-lg"
          >
            <div v-if="deal.deadline" class="text-center">
              <div class="text-telegram-text font-medium">
                {{ deal.deadline.toLocaleDateString('ru-RU') }}
              </div>
              <div class="text-telegram-textSecondary text-xs">крайний срок</div>
            </div>
            <div v-if="deal.deadline" class="w-px h-8 bg-telegram-secondary"></div>
            <div class="text-center">
              <div class="text-telegram-text font-medium">
                {{ deal.createdAt.toLocaleDateString('ru-RU') }}
              </div>
              <div class="text-telegram-textSecondary text-xs">начато</div>
            </div>
          </div>

          <div v-if="deal.status === 'in_progress'" class="flex space-x-3">
            <Button @click.stop="completeDeal(deal)" size="sm" class="flex-1">
              Завершить занятие
            </Button>
          </div>
        </Card>
      </div>

      <!-- Empty state для активных сделок -->
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
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>

        <h2 class="text-xl font-semibold text-telegram-text mb-3">Нет активных занятий</h2>

        <p class="text-telegram-textSecondary mb-8 max-w-sm mx-auto">
          У вас пока нет активных занятий. Принимайте отклики студентов, чтобы начать заниматься
        </p>
      </div>
    </div>
  </div>
</template>
