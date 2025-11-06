<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Stores
import { useTelegramStore } from '@/stores/telegram'
import { serviceService } from '@/services/business'
import { useEducation } from '@/shared/composables'
import type { Service as ApiService, ServiceFilterDto } from '@/shared/types'

// Components
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import Input from '@/shared/components/ui/Input.vue'
import { ArrowIcon, FilterIcon, LoupeIcon } from '@/shared/components/icons'
import { Select, type SelectOption } from '@/shared/components/ui'
import RequestModal from '../components/RequestModal.vue'

// Types
interface Service {
  id: string
  title: string
  description: string
  price: number
  priceType: 'hour' | 'lesson' | 'month'
  subject: string
  teacher: {
    id: string
    name: string
    experience: number
    rating: number
    reviewsCount: number
  }
  format: 'online' | 'offline' | 'both'
  workingHours: string
  availability: 'available' | 'busy' | 'limited'
  tags: string[]
}

interface ServiceFilters {
  search: string
  subject: string
  teacher: string | null
  availability: 'all' | 'available' | 'busy' | 'limited'
  sortBy: 'price' | 'rating' | 'experience' | 'date'
  sortOrder: 'asc' | 'desc'
}

// Composables
const route = useRoute()
const router = useRouter()
const telegramStore = useTelegramStore()
const { activeSubjects, teachers, isInitialized, initialize } = useEducation()

// State
const isLoading = ref(false)
const error = ref<string | null>(null)
const services = ref<Service[]>([])
const availableSubjects = ref<SelectOption[]>([])
const availableTeachers = ref<SelectOption[]>([])
const sortOptions = ref<SelectOption[]>([])
const sortOrderOptions = ref<SelectOption[]>([])
const showFilters = ref(false)
const showRequestModal = ref(false)
const selectedService = ref<Service | null>(null)

// Filters
const filters = ref<ServiceFilters>({
  search: '',
  subject: '',
  teacher: null,
  availability: 'all',
  sortBy: 'rating',
  sortOrder: 'desc',
})

// Computed
const pageTitle = computed(() => {
  if (filters.value.subject) {
    return `Услуги по ${filters.value.subject.toLowerCase()}`
  }
  return 'Все услуги'
})

const filteredServices = computed(() => {
  let result = [...services.value]

  // Search filter (клиентская фильтрация, т.к. API может не поддерживать поиск по тексту)
  if (filters.value.search.trim()) {
    const searchTerm = filters.value.search.trim().toLowerCase()
    result = result.filter(
      (service) =>
        service.title.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm) ||
        service.teacher.name.toLowerCase().includes(searchTerm) ||
        service.subject.toLowerCase().includes(searchTerm),
    )
  }

  // Availability filter (клиентская фильтрация, т.к. API использует status)
  if (filters.value.availability !== 'all') {
    result = result.filter((service) => service.availability === filters.value.availability)
  }

  // Sorting (клиентская сортировка, т.к. API может не поддерживать все типы сортировки)
  result.sort((a, b) => {
    let comparison = 0

    switch (filters.value.sortBy) {
      case 'price':
        comparison = a.price - b.price
        break
      case 'rating':
        comparison = a.teacher.rating - b.teacher.rating
        break
      case 'experience':
        comparison = a.teacher.experience - b.teacher.experience
        break
      case 'date':
        comparison = new Date().getTime() - new Date().getTime()
        break
    }

    return filters.value.sortOrder === 'asc' ? comparison : -comparison
  })

  return result
})

const resultStats = computed(() => ({
  total: filteredServices.value.length,
  subjects: [...new Set(filteredServices.value.map((s) => s.subject))].length,
  teachers: [...new Set(filteredServices.value.map((s) => s.teacher.id))].length,
  averagePrice:
    filteredServices.value.length > 0
      ? Math.round(
          filteredServices.value.reduce((sum, s) => sum + s.price, 0) /
            filteredServices.value.length,
        )
      : 0,
}))

// Methods
const buildApiFilters = (): ServiceFilterDto => {
  const apiFilters: ServiceFilterDto = {}

  // Преобразуем subject (название) в subjectId
  if (filters.value.subject && activeSubjects.value.length > 0) {
    const subject = activeSubjects.value.find((s) => s.name === filters.value.subject)
    if (subject) {
      apiFilters.subjectId = subject.id
    }
  }

  // Преобразуем teacher (ID) в teacherId
  if (filters.value.teacher) {
    apiFilters.teacherId = filters.value.teacher
  }

  return apiFilters
}

const loadServices = async () => {
  isLoading.value = true
  error.value = null

  try {
    // Инициализируем образовательные данные если нужно
    if (!isInitialized.value) {
      await initialize()
    }

    // Строим фильтры для API
    const apiFilters = buildApiFilters()

    // Загружаем услуги с фильтрами с бэкенда
    const response = await serviceService.getServices(apiFilters)
    services.value = response.items.map(mapApiToViewModel)

    // Обновляем опции фильтров из education store
    extractFiltersData()
  } catch (err: any) {
    error.value = err.message || 'Ошибка загрузки услуг'
  } finally {
    isLoading.value = false
  }
}

const mapApiToViewModel = (api: ApiService): Service => {
  return {
    id: api.id,
    title: api.subject?.name || 'Услуга',
    description: api.description || '',
    price: api.price, // уже в рублях благодаря serviceService
    priceType: 'hour',
    subject: api.subject?.name || 'Предмет',
    teacher: {
      id: api.teacher?.id || '',
      name: api.teacher?.fullName || 'Преподаватель',
      experience: 0,
      rating: 0,
      reviewsCount: 0,
    },
    format: 'online',
    workingHours: '',
    availability: 'available',
    tags: [],
  }
}

const extractFiltersData = () => {
  // Используем предметы из education store
  availableSubjects.value = activeSubjects.value.map((subject) => ({
    value: subject.name,
    label: subject.name,
  }))

  // Используем преподавателей из education store
  availableTeachers.value = teachers.value.map((teacher) => ({
    value: teacher.id,
    label: teacher.fullName,
  }))

  sortOptions.value = [
    { value: 'rating', label: 'По рейтингу' },
    { value: 'price', label: 'По цене' },
    { value: 'experience', label: 'По опыту' },
    { value: 'date', label: 'По дате' },
  ]
  sortOrderOptions.value = [
    { value: 'asc', label: 'По возрастанию' },
    { value: 'desc', label: 'По убыванию' },
  ]
}

const resetFilters = () => {
  filters.value = {
    search: '',
    subject: '',
    teacher: null,
    availability: 'all',
    sortBy: 'rating',
    sortOrder: 'desc',
  }
  telegramStore.hapticFeedback('light')
  loadServices()
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
  telegramStore.hapticFeedback('light')
}

const goBack = () => {
  telegramStore.hapticFeedback('light')
  router.back()
}

const formatPrice = (price: number, type: string) => {
  return `${price.toLocaleString('ru-RU')} ₽/${type === 'hour' ? 'час' : type === 'lesson' ? 'урок' : 'мес'}`
}

const formatAvailability = (availability: string) => {
  const map = {
    available: { text: 'Свободен', color: 'text-telegram-success' },
    busy: { text: 'Занят', color: 'text-red-500' },
    limited: { text: 'Ограниченно', color: 'text-yellow-500' },
  }
  return (
    map[availability as keyof typeof map] || {
      text: 'Неизвестно',
      color: 'text-telegram-textSecondary',
    }
  )
}

const formatFormat = (format: string) => {
  const map = {
    online: '💻 Онлайн',
    offline: '🏫 Очно',
    both: '🔄 Любой формат',
  }
  return map[format as keyof typeof map] || format
}

const submitRequest = (service: Service) => {
  telegramStore.hapticFeedback('medium')
  selectedService.value = service
  showRequestModal.value = true
}

const handleRequestSubmit = async (requestData: any) => {
  try {
    // TODO: API call для отправки заявки
    console.log('Отправка заявки:', requestData)

    // Показать уведомление об успешной отправке
    telegramStore.showAlert('Заявка отправлена! Репетитор ответит в ближайшее время.')
  } catch (error) {
    console.error('Ошибка отправки заявки:', error)
    telegramStore.showAlert('Ошибка отправки заявки. Попробуйте еще раз.')
  }
}

const viewServiceDetails = (service: Service) => {
  telegramStore.hapticFeedback('light')
  console.log('Просмотр деталей услуги:', service.title)
}

// Watchers
let searchTimeout: number | null = null

watch(
  () => filters.value.search,
  () => {
    // Поиск остается клиентской фильтрацией, не перезагружаем данные
  },
)

// Автоматическая перезагрузка при изменении фильтров предмета и преподавателя
watch(
  () => [filters.value.subject, filters.value.teacher],
  () => {
    if (isInitialized.value) {
      loadServices()
    }
  },
  { deep: true },
)

// Lifecycle
onMounted(async () => {
  // Инициализируем образовательные данные
  if (!isInitialized.value) {
    await initialize()
  }

  // Получаем параметры из URL
  const subject = route.query.subject as string
  if (subject) {
    filters.value.subject = subject
  }

  const search = route.query.search as string
  if (search) {
    filters.value.search = search
  }

  // Загружаем услуги после установки фильтров из URL
  await loadServices()
})
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <Button variant="ghost" size="sm" @click="goBack" class="mr-3 p-2">
          <ArrowIcon direction="left" />
        </Button>
        <div>
          <h1 class="text-xl font-semibold text-telegram-text">{{ pageTitle }}</h1>
          <p class="text-telegram-textSecondary text-sm">{{ resultStats.total }} услуг найдено</p>
        </div>
      </div>

      <Button variant="ghost" size="sm" @click="toggleFilters" class="p-2">
        <FilterIcon />
      </Button>
    </div>

    <!-- Search -->
    <Card class="p-4 mb-4">
      <Input
        v-model="filters.search"
        placeholder="Поиск услуг, предметов, преподавателей..."
        class="w-full"
      >
        <template #prepend>
          <LoupeIcon />
        </template>
      </Input>
    </Card>

    <!-- Filters Panel -->
    <div v-if="showFilters" class="mb-6">
      <Card class="p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-telegram-text text-lg">Фильтры</h3>
          <Button variant="ghost" size="sm" @click="resetFilters">Сбросить</Button>
        </div>

        <div class="space-y-4">
          <!-- Subject Filter -->
          <div>
            <Select
              label="Предмет"
              v-model:value="filters.subject"
              :options="availableSubjects"
              placeholder="Выберите предмет"
            />
          </div>

          <!-- Teacher Filter -->
          <div>
            <Select
              label="Преподаватель"
              v-model:value="filters.teacher"
              :options="availableTeachers"
              placeholder="Выберите преподавателя"
            />
          </div>

          <!-- Sort -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <Select
                label="Сортировать"
                v-model:value="filters.sortBy"
                :options="sortOptions"
                placeholder="Выберите сортировку"
              />
            </div>
            <div>
              <Select
                label="Порядок"
                v-model:value="filters.sortOrder"
                :options="sortOrderOptions"
                placeholder="Выберите порядок"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="text-center py-8">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-telegram-accent"
      ></div>
      <p class="text-telegram-textSecondary mt-2">Загрузка услуг...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-8">
      <div class="text-red-500 mb-2">{{ error }}</div>
      <Button @click="loadServices" size="sm">Попробовать снова</Button>
    </div>

    <!-- Services List -->
    <div v-else-if="filteredServices.length > 0" class="space-y-4">
      <Card
        v-for="service in filteredServices"
        :key="service.id"
        class="p-4 hover:border-telegram-accent transition-colors cursor-pointer"
        @click="viewServiceDetails(service)"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <h3 class="font-semibold text-telegram-text mb-1">{{ service.subject }}</h3>
            <div class="flex items-center space-x-2 text-sm text-telegram-textSecondary">
              <span>{{ service.teacher.name }}</span>
            </div>
          </div>
          <div class="text-right">
            <div class="font-bold text-telegram-accent">{{ service.price }} ₽</div>
          </div>
        </div>

        <!-- Teacher Info -->
        <div class="flex items-center space-x-3 mb-3">
          <div
            class="w-10 h-10 bg-telegram-accent rounded-full flex items-center justify-center text-white font-semibold text-sm"
          >
            {{
              service.teacher.name
                .split(' ')
                .map((n) => n[0])
                .join('')
            }}
          </div>
          <div class="flex-1">
            <div class="font-medium text-telegram-text">{{ service.teacher.name }}</div>
            <div class="flex items-center space-x-2 text-sm text-telegram-textSecondary">
              <span>{{ service.teacher.experience }} услуг</span>
              <span>•</span>
              <div class="flex items-center space-x-1">
                <svg class="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <span>{{ service.teacher.rating }}</span>
                <span>({{ service.teacher.reviewsCount }})</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <p class="text-telegram-textSecondary text-sm mb-3 line-clamp-5">
          {{ service.description }}
        </p>

        <!-- Actions -->
        <div class="pt-3">
          <Button @click.stop="submitRequest(service)" size="sm" class="w-full">
            Оставить заявку
          </Button>
        </div>
      </Card>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 flex flex-col items-center justify-center">
      <div
        class="w-16 h-16 bg-telegram-secondary rounded-full mx-auto mb-4 flex items-center justify-center"
      >
        <svg
          class="w-8 h-8 text-telegram-textSecondary"
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
      <h3 class="text-telegram-text font-semibold mb-2">Услуги не найдены</h3>
      <p class="text-telegram-textSecondary mb-4">Попробуйте изменить параметры поиска</p>
      <Button @click="resetFilters" variant="secondary">Сбросить фильтры</Button>
    </div>

    <!-- Request Modal -->
    <RequestModal
      v-model="showRequestModal"
      :service="selectedService"
      @submit="handleRequestSubmit"
    />
  </div>
</template>
