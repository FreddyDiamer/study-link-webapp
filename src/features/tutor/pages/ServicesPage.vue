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
  console.log('Редактировать услугу:', service.title)
  // TODO: Навигация к форме редактирования
}

const toggleServiceStatus = (service: Service) => {
  telegramStore.hapticFeedback('medium')

  if (service.status === 'active') {
    service.status = 'frozen'
  } else if (service.status === 'frozen') {
    service.status = 'active'
  }

  console.log(
    `Услуга "${service.title}" ${service.status === 'active' ? 'активирована' : 'заморожена'}`,
  )
}

const deleteService = (service: Service) => {
  if (service.hasActiveDeals) {
    telegramStore.hapticFeedback('error')
    // TODO: Показать уведомление о невозможности удаления
    console.log('Нельзя удалить услугу с активными делами')
    return
  }

  telegramStore.hapticFeedback('heavy')
  service.status = 'deleted'
  console.log('Услуга удалена и все отклики отклонены:', service.title)
  // TODO: Подтверждение удаления
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
      <Button v-if="activeTab === 'services'" @click="createService" size="sm">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Добавить
      </Button>
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
      <div v-if="activeServices.length > 0" class="space-y-4">
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
              <div class="flex items-center space-x-3 mb-2">
                <h3 class="text-lg font-semibold text-telegram-text">{{ service.title }}</h3>
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    getStatusClass(service.status),
                  ]"
                >
                  {{ getStatusLabel(service.status) }}
                </span>
                <span
                  v-if="service.newResponsesCount > 0"
                  class="px-2 py-1 text-xs font-medium rounded-full bg-telegram-accent text-white"
                >
                  {{ service.newResponsesCount }} новых
                </span>
              </div>
              <div class="flex items-center space-x-4 mb-3">
                <span class="text-telegram-accent font-medium">{{ service.subject }}</span>
                <span class="text-telegram-textSecondary">{{ service.level }}</span>
                <span class="text-telegram-success font-semibold">{{ service.price }}₽</span>
                <span class="text-telegram-textSecondary text-sm">{{ service.duration }} мин</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center space-x-2" @click.stop>
              <button
                v-if="service.status !== 'deleted'"
                @click="toggleServiceStatus(service)"
                class="p-2 rounded-lg hover:bg-telegram-secondary transition-colors"
                :title="service.status === 'active' ? 'Заморозить' : 'Активировать'"
              >
                <svg
                  class="w-4 h-4"
                  :class="{
                    'text-telegram-success': service.status === 'active',
                    'text-yellow-600': service.status === 'frozen',
                  }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    v-if="service.status === 'active'"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                  <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 9v6l4-2-4-2z"
                  />
                </svg>
              </button>
              <button
                @click="editService(service)"
                class="p-2 rounded-lg hover:bg-telegram-secondary transition-colors text-telegram-textSecondary"
                title="Редактировать"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                @click="deleteService(service)"
                class="p-2 rounded-lg hover:bg-red-100 transition-colors"
                :class="{
                  'text-red-500': !service.hasActiveDeals,
                  'text-red-300 cursor-not-allowed': service.hasActiveDeals,
                }"
                :title="service.hasActiveDeals ? 'Нельзя удалить - есть активные дела' : 'Удалить'"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Description -->
          <p class="text-telegram-text text-sm mb-4">{{ service.description }}</p>

          <!-- Responses Info -->
          <div class="mb-4 p-3 bg-telegram-secondary/50 rounded-lg">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
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
                <div v-if="service.newResponsesCount > 0" class="text-center">
                  <div class="text-lg font-semibold text-telegram-success">
                    {{ service.newResponsesCount }}
                  </div>
                  <div class="text-xs text-telegram-textSecondary">Новых</div>
                </div>
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

          <!-- Features -->
          <div class="mb-4">
            <h4 class="text-telegram-text font-medium mb-2">Что включено:</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div
                v-for="feature in service.features"
                :key="feature"
                class="flex items-center space-x-2"
              >
                <svg
                  class="w-4 h-4 text-telegram-success flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="text-telegram-textSecondary text-sm">{{ feature }}</span>
              </div>
            </div>
          </div>

          <!-- Format & Stats -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div>
                <span class="text-telegram-textSecondary text-xs">Формат:</span>
                <span class="text-telegram-text text-sm ml-1">{{ service.format.join(', ') }}</span>
              </div>
              <div>
                <span class="text-telegram-textSecondary text-xs">Учеников:</span>
                <span class="text-telegram-text text-sm ml-1">{{ service.studentsCount }}</span>
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <span class="text-telegram-text font-medium">{{ service.rating }}</span>
                <span class="text-telegram-textSecondary text-sm"
                  >({{ service.reviewsCount }})</span
                >
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Empty state для услуг -->
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>

        <h2 class="text-xl font-semibold text-telegram-text mb-3">Добавьте первую услугу</h2>

        <p class="text-telegram-textSecondary mb-8 max-w-sm mx-auto">
          Создайте описание ваших услуг репетиторства с указанием предметов и стоимости
        </p>

        <Button @click="createService" class="mx-auto">Добавить услугу</Button>
      </div>
    </div>

    <!-- Responses Tab -->
    <div v-if="activeTab === 'responses'">
      <div v-if="requestResponses.length > 0" class="space-y-4">
        <Card v-for="response in requestResponses" :key="response.id" class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-start space-x-4">
              <div
                class="w-12 h-12 bg-telegram-accent/20 rounded-full flex items-center justify-center"
              >
                <span class="text-telegram-accent font-semibold text-lg">
                  {{ response.studentName.charAt(0) }}
                </span>
              </div>
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <h3 class="text-lg font-semibold text-telegram-text">
                    {{ response.studentName }}
                  </h3>
                  <span
                    :class="[
                      'px-2 py-1 text-xs font-medium rounded-full',
                      getResponseStatusClass(response.status),
                    ]"
                  >
                    {{ getResponseStatusLabel(response.status) }}
                  </span>
                  <span
                    v-if="response.urgency"
                    :class="[
                      'px-2 py-1 text-xs font-medium rounded-full',
                      getUrgencyClass(response.urgency),
                    ]"
                  >
                    {{ getUrgencyLabel(response.urgency) }}
                  </span>
                </div>
                <p class="text-telegram-textSecondary text-sm mb-2">{{ response.requestTitle }}</p>
                <p class="text-telegram-text text-sm mb-2 italic">
                  {{ response.requestDescription }}
                </p>
                <p class="text-telegram-text text-sm font-medium">
                  Мой отклик: {{ response.message }}
                </p>
              </div>
            </div>
          </div>

          <div class="mb-4 p-3 bg-telegram-secondary/30 rounded-lg">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div v-if="response.price">
                <div class="text-telegram-textSecondary text-xs mb-1">Моя цена</div>
                <div class="text-telegram-success font-semibold">{{ response.price }}₽</div>
              </div>
              <div v-if="response.budget">
                <div class="text-telegram-textSecondary text-xs mb-1">Бюджет студента</div>
                <div class="text-telegram-text font-semibold">{{ response.budget }}₽</div>
              </div>
              <div v-if="response.proposedDeadline">
                <div class="text-telegram-textSecondary text-xs mb-1">Предложенный срок</div>
                <div class="text-telegram-text text-sm">
                  {{ response.proposedDeadline.toLocaleDateString() }}
                </div>
              </div>
            </div>
            <div class="mt-3 pt-3 border-t border-telegram-secondary/50">
              <span class="text-telegram-textSecondary text-xs">
                Отклик отправлен: {{ response.createdAt.toLocaleDateString() }}
              </span>
            </div>
          </div>

          <div v-if="response.status === 'pending'" class="flex justify-center">
            <Button @click="withdrawResponse(response)" variant="destructive" size="sm">
              Отозвать отклик
            </Button>
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
          <div class="flex items-start justify-between mb-4">
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
                      'px-2 py-1 text-xs font-medium rounded-full',
                      getDealStatusClass(deal.status),
                    ]"
                  >
                    {{ getDealStatusLabel(deal.status) }}
                  </span>
                </div>
                <p class="text-telegram-textSecondary text-sm mb-1">{{ deal.serviceTitle }}</p>
                <p class="text-telegram-accent text-sm">{{ deal.subject }}</p>
              </div>
            </div>
          </div>

          <!-- Deal Info Grid -->
          <div class="grid grid-cols-2 gap-4 mb-4 p-3 bg-telegram-secondary/30 rounded-lg">
            <div>
              <div class="text-telegram-textSecondary text-xs mb-1">Стоимость занятия</div>
              <div class="text-telegram-success font-semibold">{{ deal.price }}₽</div>
            </div>
            <div v-if="deal.deadline">
              <div class="text-telegram-textSecondary text-xs mb-1">Крайний срок</div>
              <div class="text-telegram-text text-sm">{{ deal.deadline.toLocaleDateString() }}</div>
            </div>
            <div>
              <div class="text-telegram-textSecondary text-xs mb-1">Начато</div>
              <div class="text-telegram-text text-sm">
                {{ deal.createdAt.toLocaleDateString() }}
              </div>
            </div>
            <div>
              <div class="text-telegram-textSecondary text-xs mb-1">Активность</div>
              <div class="text-telegram-text text-sm">
                {{ deal.lastActivity.toLocaleDateString() }}
              </div>
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
