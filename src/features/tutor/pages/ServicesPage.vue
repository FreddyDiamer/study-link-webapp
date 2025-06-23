<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'

const router = useRouter()
const telegramStore = useTelegramStore()

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

const viewStats = (service: Service) => {
  telegramStore.hapticFeedback('light')
  console.log('Статистика услуги:', service.title)
  // TODO: Показать детальную статистику
}

// Фильтруем неудаленные услуги для основного списка
const activeServices = ref(services.value.filter((s) => s.status !== 'deleted'))
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-telegram-text mb-2">Мои услуги</h1>
        <p class="text-telegram-textSecondary">Управляйте своими предложениями и тарифами</p>
      </div>
      <Button @click="createService" size="sm">
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

    <!-- Services List -->
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
              <span class="text-telegram-textSecondary text-sm">({{ service.reviewsCount }})</span>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- Empty state -->
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
</template>
