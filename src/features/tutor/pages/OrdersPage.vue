<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import Input from '@/shared/components/ui/Input.vue'
import { Select, type SelectOption, Modal } from '@/shared/components/ui'

// Types based on Prisma Deal model
interface TutorDeal {
  id: string
  studentId: string
  tutorId: string
  subjectId: string
  teacherId: string
  price: number // в копейках
  deadline: string | null
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  serviceResponseId: string | null
  requestResponseId: string | null
  description: string
  createdAt: string
  updatedAt: string
  // Связанные данные
  student: {
    name: string
    rating: number
    ordersCount: number
  }
  subject: {
    name: string
  }
  teacher: {
    fullName: string
  }
}

interface DealFilters {
  search: string
  subject: string | null
  teacher: string | null
  status: 'all' | 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  source: 'all' | 'request' | 'service'
  sortBy: 'price' | 'date' | 'deadline' | 'updated'
  sortOrder: 'asc' | 'desc'
}

// Composables
const route = useRoute()
const router = useRouter()
const telegramStore = useTelegramStore()

// State
const isLoading = ref(false)
const error = ref<string | null>(null)
const showFilters = ref(false)
const showAcceptModal = ref(false)
const selectedDeal = ref<TutorDeal | null>(null)
const isAccepting = ref(false)
const tutorComment = ref('')
const proposedDate = ref('')
const proposedPrice = ref<number | null>(null)

// Mock data - активные сделки репетитора (Deal)
const deals = ref<TutorDeal[]>([
  {
    id: '1',
    studentId: 'student-1',
    tutorId: 'tutor-1',
    subjectId: 'math-1',
    teacherId: 'teacher-1',
    price: 120000, // в копейках (1200 рублей)
    deadline: '2024-01-25T18:00:00',
    status: 'IN_PROGRESS',
    serviceResponseId: null,
    requestResponseId: 'req-resp-1',
    description:
      'Нужна помощь в подготовке к ЕГЭ по математике. Особенно сложно даются задачи с параметрами и стереометрия. Хотелось бы разобрать типовые задания и научиться решать их самостоятельно.',
    createdAt: '2024-01-15T10:30:00',
    updatedAt: '2024-01-18T14:30:00',
    // Связанные данные
    student: {
      name: 'Мария Васильева',
      rating: 4.8,
      ordersCount: 10,
    },
    subject: {
      name: 'Математика',
    },
    teacher: {
      fullName: 'Анна Петрова',
    },
  },
  {
    id: '2',
    studentId: 'student-2',
    tutorId: 'tutor-1',
    subjectId: 'physics-1',
    teacherId: 'teacher-2',
    price: 150000, // в копейках (1500 рублей)
    deadline: '2024-01-22T16:00:00',
    status: 'ACCEPTED',
    serviceResponseId: 'srv-resp-1',
    requestResponseId: null,
    description:
      'Готовлюсь к поступлению в технический университет. Нужно подтянуть механику и термодинамику, а также разобрать задачи из сборника Чертова.',
    createdAt: '2024-01-17T09:15:00',
    updatedAt: '2024-01-17T14:20:00',
    // Связанные данные
    student: {
      name: 'Алексей Козлов',
      rating: 4.5,
      ordersCount: 10,
    },
    subject: {
      name: 'Физика',
    },
    teacher: {
      fullName: 'Университетская физика',
    },
  },
  {
    id: '3',
    studentId: 'student-3',
    tutorId: 'tutor-1',
    subjectId: 'chemistry-1',
    teacherId: 'teacher-3',
    price: 100000, // в копейках (1000 рублей)
    deadline: null,
    status: 'COMPLETED',
    serviceResponseId: null,
    requestResponseId: 'req-resp-2',
    description:
      'Изучаю органическую химию в 10 классе. Нужна помощь с механизмами реакций и номенклатурой органических соединений.',
    createdAt: '2024-01-10T14:20:00',
    updatedAt: '2024-01-18T18:30:00',
    // Связанные данные
    student: {
      name: 'София Петрова',
      rating: 5.0,
      ordersCount: 10,
    },
    subject: {
      name: 'Химия',
    },
    teacher: {
      fullName: 'Органическая химия',
    },
  },
])

// Filters
const filters = ref<DealFilters>({
  search: '',
  subject: null,
  teacher: null,
  status: 'all',
  source: 'all',
  sortBy: 'date',
  sortOrder: 'desc',
})

// Filter options
const availableSubjects = ref<SelectOption[]>([])
const availableTeachers = ref<SelectOption[]>([])
const sortOptions = ref<SelectOption[]>([
  { value: 'price', label: 'По цене' },
  { value: 'date', label: 'По дате создания' },
  { value: 'deadline', label: 'По дедлайну' },
  { value: 'updated', label: 'По обновлению' },
])
const sortOrderOptions = ref<SelectOption[]>([
  { value: 'asc', label: 'По возрастанию' },
  { value: 'desc', label: 'По убыванию' },
])

// Simple filtering
const activeTab = ref<'all' | 'active' | 'completed'>('all')

const filteredDeals = computed(() => {
  let result = [...deals.value]

  // Tab filter
  switch (activeTab.value) {
    case 'active':
      result = result.filter(
        (deal) =>
          deal.status === 'PENDING' || deal.status === 'ACCEPTED' || deal.status === 'IN_PROGRESS',
      )
      break
    case 'completed':
      result = result.filter((deal) => deal.status === 'COMPLETED' || deal.status === 'CANCELLED')
      break
  }

  // Search filter
  if (filters.value.search.trim()) {
    const searchTerm = filters.value.search.trim().toLowerCase()
    result = result.filter(
      (deal) =>
        deal.subject.name.toLowerCase().includes(searchTerm) ||
        deal.teacher.fullName.toLowerCase().includes(searchTerm) ||
        deal.student.name.toLowerCase().includes(searchTerm) ||
        deal.description.toLowerCase().includes(searchTerm),
    )
  }

  // Subject filter
  if (filters.value.subject) {
    result = result.filter((deal) => deal.subject.name === filters.value.subject)
  }

  // Teacher filter
  if (filters.value.teacher) {
    result = result.filter((deal) => deal.teacher.fullName === filters.value.teacher)
  }

  // Status filter
  if (filters.value.status !== 'all') {
    result = result.filter((deal) => deal.status === filters.value.status)
  }

  // Source filter
  if (filters.value.source !== 'all') {
    if (filters.value.source === 'request') {
      result = result.filter((deal) => deal.requestResponseId !== null)
    } else if (filters.value.source === 'service') {
      result = result.filter((deal) => deal.serviceResponseId !== null)
    }
  }

  // Sorting
  result.sort((a, b) => {
    let comparison = 0

    switch (filters.value.sortBy) {
      case 'price':
        comparison = a.price - b.price
        break
      case 'date':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        break
      case 'deadline':
        const aDeadline = a.deadline ? new Date(a.deadline).getTime() : Infinity
        const bDeadline = b.deadline ? new Date(b.deadline).getTime() : Infinity
        comparison = aDeadline - bDeadline
        break
      case 'updated':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        break
    }

    return filters.value.sortOrder === 'asc' ? comparison : -comparison
  })

  return result
})

// Utility functions
const formatPrice = (priceInKopecks: number) => {
  return Math.round(priceInKopecks / 100)
}

const getDealStatusInfo = (status: string) => {
  switch (status) {
    case 'PENDING':
      return {
        color: 'bg-orange-500',
        text: 'Ожидает подтверждения',
        textColor: 'text-orange-600',
        bg: 'bg-orange-100',
      }
    case 'ACCEPTED':
      return {
        color: 'bg-blue-500',
        text: 'Принята',
        textColor: 'text-blue-600',
        bg: 'bg-blue-100',
      }
    case 'IN_PROGRESS':
      return {
        color: 'bg-telegram-success',
        text: 'В процессе',
        textColor: 'text-telegram-success',
        bg: 'bg-green-100',
      }
    case 'COMPLETED':
      return {
        color: 'bg-telegram-textSecondary',
        text: 'Завершена',
        textColor: 'text-telegram-textSecondary',
        bg: 'bg-gray-100',
      }
    case 'CANCELLED':
      return { color: 'bg-red-500', text: 'Отменена', textColor: 'text-red-600', bg: 'bg-red-100' }
    default:
      return {
        color: 'bg-telegram-textSecondary',
        text: 'Неизвестно',
        textColor: 'text-telegram-textSecondary',
        bg: 'bg-gray-100',
      }
  }
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

// Computed
const pageTitle = computed(() => {
  if (filters.value.subject) {
    return `Заказы по ${filters.value.subject.toLowerCase()}`
  }
  return 'Все заказы'
})

const filteredOrders = computed(() => filteredDeals.value)

const resultStats = computed(() => ({
  total: filteredDeals.value.length,
  pending: filteredDeals.value.filter((d) => d.status === 'PENDING').length,
  inProgress: filteredDeals.value.filter((d) => d.status === 'IN_PROGRESS').length,
  subjects: [...new Set(filteredDeals.value.map((d) => d.subject.name))].length,
  averagePrice:
    filteredDeals.value.length > 0
      ? Math.round(
          filteredDeals.value.reduce((sum, d) => sum + formatPrice(d.price), 0) /
            filteredDeals.value.length,
        )
      : 0,
}))

// Methods
const loadOrders = async () => {
  isLoading.value = true
  error.value = null

  try {
    await new Promise((resolve) => setTimeout(resolve, 800))
    extractFiltersData()
  } catch (err: any) {
    error.value = err.message || 'Ошибка загрузки заказов'
  } finally {
    isLoading.value = false
  }
}

const extractFiltersData = () => {
  availableSubjects.value = [...new Set(deals.value.map((d) => d.subject.name))].map((subject) => ({
    value: subject,
    label: subject,
  }))
  availableTeachers.value = [...new Set(deals.value.map((d) => d.teacher.fullName))].map(
    (teacher) => ({
      value: teacher,
      label: teacher,
    }),
  )
}

const resetFilters = () => {
  filters.value = {
    search: '',
    subject: null,
    teacher: null,
    status: 'all',
    source: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  }
  telegramStore.hapticFeedback('light')
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
  telegramStore.hapticFeedback('light')
}

const goBack = () => {
  telegramStore.hapticFeedback('light')
  router.back()
}

const formatStatus = (status: string) => {
  return getDealStatusInfo(status)
}

const respondToOrder = (deal: TutorDeal) => {
  telegramStore.hapticFeedback('medium')
  selectedDeal.value = deal

  // Auto-set proposed date from deal deadline
  if (deal.deadline) {
    const date = new Date(deal.deadline)
    proposedDate.value = date.toISOString().slice(0, 16) // Format for datetime-local
  } else {
    // Set to next day if no deadline
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(18, 0) // Default to 6 PM
    proposedDate.value = tomorrow.toISOString().slice(0, 16)
  }

  // Auto-set proposed price from deal
  proposedPrice.value = formatPrice(deal.price)

  showAcceptModal.value = true
}

const handleAcceptDeal = async () => {
  if (!selectedDeal.value) return

  // Validate required fields
  if (!proposedDate.value.trim()) {
    telegramStore.hapticFeedback('error')
    telegramStore.showAlert('Пожалуйста, укажите дату и время проведения занятия')
    return
  }

  isAccepting.value = true
  telegramStore.hapticFeedback('medium')

  try {
    // Simulate API call with tutor response
    const responseData = {
      dealId: selectedDeal.value.id,
      tutorComment: tutorComment.value.trim(),
      proposedDate: proposedDate.value,
      proposedPrice: proposedPrice.value,
    }

    console.log('Отклик репетитора:', responseData)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update deal status in mock data
    const dealIndex = deals.value.findIndex((d) => d.id === selectedDeal.value!.id)
    if (dealIndex !== -1) {
      deals.value[dealIndex].status = 'ACCEPTED'
      deals.value[dealIndex].updatedAt = new Date().toISOString()
    }

    telegramStore.hapticFeedback('success')
    showAcceptModal.value = false
    selectedDeal.value = null
    tutorComment.value = ''
    proposedDate.value = ''
    proposedPrice.value = null

    // Show success message
    telegramStore.showAlert('Отклик отправлен! Студент получит уведомление.')
  } catch (error) {
    console.error('Ошибка отправки отклика:', error)
    telegramStore.hapticFeedback('error')
  } finally {
    isAccepting.value = false
  }
}

const handleCloseAcceptModal = () => {
  if (!isAccepting.value) {
    showAcceptModal.value = false
    selectedDeal.value = null
    tutorComment.value = ''
    proposedDate.value = ''
    proposedPrice.value = null
  }
}

// Watchers
let searchTimeout: number | null = null

watch(
  () => filters.value.search,
  () => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      // В реальном проекте здесь может быть API call для дебаунса
    }, 300)
  },
)

// Reset selected deal when modal closes
watch(showAcceptModal, (isOpen) => {
  if (!isOpen) {
    selectedDeal.value = null
    tutorComment.value = ''
    proposedDate.value = ''
    proposedPrice.value = null
  }
})

// Lifecycle
onMounted(() => {
  const subject = route.query.subject as string
  if (subject) {
    filters.value.subject = subject
  }

  const search = route.query.search as string
  if (search) {
    filters.value.search = search
  }

  loadOrders()
})
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <Button variant="ghost" size="sm" @click="goBack" class="mr-3 p-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Button>
        <div>
          <h1 class="text-xl font-semibold text-telegram-text">{{ pageTitle }}</h1>
          <p class="text-telegram-textSecondary text-sm">{{ resultStats.total }} заказов найдено</p>
        </div>
      </div>

      <Button variant="ghost" size="sm" @click="toggleFilters" class="p-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
          />
        </svg>
      </Button>
    </div>

    <!-- Search -->
    <Card class="p-4 mb-4">
      <Input
        v-model="filters.search"
        placeholder="Поиск заказов по предметам, студентам, описанию..."
        class="w-full"
      >
        <template #prepend>
          <svg
            class="w-4 h-4 text-telegram-textSecondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </template>
      </Input>
    </Card>

    <!-- Filters Panel -->
    <div v-if="showFilters" class="mb-6">
      <Card class="p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-telegram-text">Фильтры</h3>
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
      <p class="text-telegram-textSecondary mt-2">Загрузка заказов...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-8">
      <div class="text-red-500 mb-2">{{ error }}</div>
      <Button @click="loadOrders" size="sm">Попробовать снова</Button>
    </div>

    <!-- Orders List -->
    <div v-else-if="filteredOrders.length > 0" class="space-y-4">
      <Card v-for="order in filteredOrders" :key="order.id" class="p-4">
        <!-- Header -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <h3 class="font-semibold text-telegram-text mb-1">{{ order.subject.name }}</h3>
            <div class="flex items-center space-x-2 text-sm text-telegram-textSecondary mb-2">
              <span>{{ order.teacher.fullName }}</span>
            </div>
          </div>
          <div class="text-right">
            <div class="font-bold text-telegram-accent">{{ formatPrice(order.price) }} ₽</div>
          </div>
        </div>

        <!-- Student Info -->
        <div class="flex items-center space-x-3 mb-3">
          <div
            class="w-10 h-10 bg-telegram-accent rounded-full flex items-center justify-center text-white font-semibold text-sm"
          >
            {{
              order.student.name
                .split(' ')
                .map((n) => n[0])
                .join('')
            }}
          </div>
          <div class="flex-1">
            <div class="font-medium text-telegram-text">{{ order.student.name }}</div>
            <div class="flex items-center space-x-2 text-sm text-telegram-textSecondary">
              <span>{{ order.student.ordersCount }} заказов</span>
              <span>•</span>
              <div class="flex items-center space-x-1">
                <svg class="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <span>{{ order.student.rating }}</span>
              </div>
            </div>
          </div>
        </div>

        <p class="text-sm line-clamp-5 leading-relaxed mb-3">
          {{ order.description }}
        </p>

        <!-- Meta Info -->
        <div class="flex items-center justify-between text-sm text-telegram-textSecondary mb-3">
          <span>Создан: {{ formatDate(order.createdAt) }}</span>
          <span v-if="order.deadline">Дедлайн: {{ formatDate(order.deadline) }}</span>
        </div>

        <!-- Actions -->
        <div class="pt-3">
          <Button @click.stop="respondToOrder(order)" size="sm" class="w-full">
            Откликнуться
          </Button>
        </div>
      </Card>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <h3 class="text-telegram-text font-semibold mb-2">Заказы не найдены</h3>
      <p class="text-telegram-textSecondary mb-4">Попробуйте изменить параметры поиска</p>
      <Button @click="resetFilters" variant="secondary">Сбросить фильтры</Button>
    </div>

    <!-- Accept Modal -->
    <Modal v-model="showAcceptModal" title="Откликнуться на заказ" max-width="lg">
      <div v-if="selectedDeal" class="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
        <div class="space-y-3 mb-7 mt-2">
          <!-- Student Info -->
          <div class="flex items-center space-x-3 bg-telegram-secondary/20 rounded-xl">
            <div
              class="w-12 h-12 bg-telegram-accent rounded-full flex items-center justify-center text-white font-semibold"
            >
              {{
                selectedDeal.student.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
              }}
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-telegram-text">{{ selectedDeal.student.name }}</h3>
            </div>
            <div class="text-right">
              <div class="font-bold text-telegram-accent text-lg">
                {{ formatPrice(selectedDeal.price) }} ₽
              </div>
            </div>
          </div>
          <!-- Order Description -->
          <div class="bg-telegram-bg/50 border-l-4 border-telegram-accent p-4 rounded-r-lg">
            <p class="text-telegram-text leading-relaxed italic">
              {{ selectedDeal.description }}
            </p>
          </div>
          <!-- Meta Info -->
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-telegram-accent rounded-full"></div>
              <span class="text-telegram-textSecondary">
                Дедлайн:
                <span class="text-telegram-text">{{
                  selectedDeal.deadline ? formatDate(selectedDeal.deadline) : 'Не установлен'
                }}</span>
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-telegram-textSecondary rounded-full"></div>
              <span class="text-telegram-textSecondary">
                Создан:
                <span class="text-telegram-text">{{ formatDate(selectedDeal.createdAt) }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Proposed Date and Price -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-telegram-text mb-2">
              Предложить дату и время *
            </label>
            <input
              v-model="proposedDate"
              type="datetime-local"
              required
              class="w-full px-4 py-3 bg-telegram-secondary border border-telegram-border rounded-xl text-telegram-text focus:outline-none focus:border-telegram-accent transition-colors"
            />
            <p class="text-xs text-telegram-textSecondary mt-1">Когда вы готовы провести занятие</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-telegram-text mb-2">
              Ваша цена <span class="text-telegram-textSecondary">(необязательно)</span>
            </label>
            <div class="relative">
              <input
                v-model="proposedPrice"
                type="number"
                min="0"
                step="50"
                placeholder="₽"
                class="w-full px-4 py-3 bg-telegram-secondary border border-telegram-border rounded-xl text-telegram-text placeholder-telegram-textSecondary focus:outline-none focus:border-telegram-accent transition-colors"
              />
              <span
                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-telegram-textSecondary text-sm"
                >₽</span
              >
            </div>
            <p class="text-xs text-telegram-textSecondary mt-1">
              Оставьте пустым, если согласны с указанной ценой
            </p>
          </div>
        </div>

        <!-- Tutor Comment -->
        <div>
          <label class="block text-sm font-medium text-telegram-text mb-2">
            Ваш комментарий <span class="text-telegram-textSecondary">(необязательно)</span>
          </label>
          <textarea
            v-model="tutorComment"
            rows="3"
            placeholder="Напишите ваши предложения, условия или дополнительную информацию..."
            class="w-full px-4 py-3 bg-telegram-secondary border border-telegram-border rounded-xl text-telegram-text placeholder-telegram-textSecondary focus:outline-none focus:border-telegram-accent transition-colors resize-none"
          />
          <p class="text-xs text-telegram-textSecondary mt-1">
            Студент увидит ваш комментарий вместе с откликом
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex space-x-3">
          <Button
            variant="secondary"
            @click="handleCloseAcceptModal"
            class="flex-1"
            :disabled="isAccepting"
          >
            Отмена
          </Button>
          <Button :loading="isAccepting" @click="handleAcceptDeal" class="flex-1">
            Отправить отклик
          </Button>
        </div>
      </template>
    </Modal>
  </div>
</template>
