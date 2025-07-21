<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import Input from '@/shared/components/ui/Input.vue'
import { Select, type SelectOption } from '@/shared/components/ui'

// Types
interface Order {
  id: string
  title: string
  description: string
  price: number
  priceType: 'hour' | 'task' | 'month'
  subject: string
  teacher: string
  student: {
    id: string
    name: string
    rating: number
    completedOrders: number
  }
  urgency: 'today' | 'this_week' | 'not_urgent'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  format: 'online' | 'offline' | 'both'
  deadline?: string
  createdAt: string
  tags: string[]
}

interface OrderFilters {
  search: string
  subject: string | null
  teacher: string | null
  status: 'all' | 'pending' | 'in_progress' | 'completed' | 'cancelled'
  urgency: 'all' | 'today' | 'this_week' | 'not_urgent'
  format: 'all' | 'online' | 'offline' | 'both'
  sortBy: 'price' | 'urgency' | 'date' | 'deadline'
  sortOrder: 'asc' | 'desc'
}

// Composables
const route = useRoute()
const router = useRouter()
const telegramStore = useTelegramStore()

// State
const isLoading = ref(false)
const error = ref<string | null>(null)
const orders = ref<Order[]>([])
const availableSubjects = ref<SelectOption[]>([])
const availableTeachers = ref<SelectOption[]>([])
const sortOptions = ref<SelectOption[]>([])
const sortOrderOptions = ref<SelectOption[]>([])
const showFilters = ref(false)

// Filters
const filters = ref<OrderFilters>({
  search: '',
  subject: null,
  teacher: null,
  status: 'all',
  urgency: 'all',
  format: 'all',
  sortBy: 'date',
  sortOrder: 'desc',
})

// Computed
const pageTitle = computed(() => {
  if (filters.value.subject) {
    return `Заказы по ${filters.value.subject.toLowerCase()}`
  }
  return 'Все заказы'
})

const filteredOrders = computed(() => {
  let result = [...orders.value]

  // Search filter
  if (filters.value.search.trim()) {
    const searchTerm = filters.value.search.trim().toLowerCase()
    result = result.filter(
      (order) =>
        order.title.toLowerCase().includes(searchTerm) ||
        order.description.toLowerCase().includes(searchTerm) ||
        order.student.name.toLowerCase().includes(searchTerm) ||
        order.subject.toLowerCase().includes(searchTerm),
    )
  }

  // Subject filter
  if (filters.value.subject) {
    result = result.filter((order) => order.subject === filters.value.subject)
  }

  // Teacher filter
  if (filters.value.teacher) {
    result = result.filter((order) => order.student.name === filters.value.teacher)
  }

  // Status filter
  if (filters.value.status !== 'all') {
    result = result.filter((order) => order.status === filters.value.status)
  }

  // Urgency filter
  if (filters.value.urgency !== 'all') {
    result = result.filter((order) => order.urgency === filters.value.urgency)
  }

  // Format filter
  if (filters.value.format !== 'all') {
    result = result.filter(
      (order) => order.format === filters.value.format || order.format === 'both',
    )
  }

  // Sorting
  result.sort((a, b) => {
    let comparison = 0

    switch (filters.value.sortBy) {
      case 'price':
        comparison = a.price - b.price
        break
      case 'urgency':
        const urgencyOrder = { today: 3, this_week: 2, not_urgent: 1 }
        comparison = urgencyOrder[a.urgency] - urgencyOrder[b.urgency]
        break
      case 'date':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        break
      case 'deadline':
        const aDeadline = a.deadline ? new Date(a.deadline).getTime() : Infinity
        const bDeadline = b.deadline ? new Date(b.deadline).getTime() : Infinity
        comparison = aDeadline - bDeadline
        break
    }

    return filters.value.sortOrder === 'asc' ? comparison : -comparison
  })

  return result
})

const resultStats = computed(() => ({
  total: filteredOrders.value.length,
  pending: filteredOrders.value.filter((o) => o.status === 'pending').length,
  inProgress: filteredOrders.value.filter((o) => o.status === 'in_progress').length,
  subjects: [...new Set(filteredOrders.value.map((o) => o.subject))].length,
  averagePrice:
    filteredOrders.value.length > 0
      ? Math.round(
          filteredOrders.value.reduce((sum, o) => sum + o.price, 0) / filteredOrders.value.length,
        )
      : 0,
}))

// Methods
const loadOrders = async () => {
  isLoading.value = true
  error.value = null

  try {
    await new Promise((resolve) => setTimeout(resolve, 800))

    orders.value = generateMockOrders()
    extractFiltersData()
  } catch (err: any) {
    error.value = err.message || 'Ошибка загрузки заказов'
  } finally {
    isLoading.value = false
  }
}

const extractFiltersData = () => {
  availableSubjects.value = [...orders.value.map((o) => ({ value: o.id, label: o.subject }))]
  availableTeachers.value = [...new Set(orders.value.map((o) => o.teacher))].map((teacher) => ({
    value: teacher,
    label: teacher,
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

const generateMockOrders = (): Order[] => {
  const subjects = ['Математика', 'Физика', 'Химия', 'Английский язык', 'История', 'Биология']
  const formats = ['online', 'offline', 'both'] as const
  const urgencies = ['today', 'this_week', 'not_urgent'] as const
  const statuses = ['pending', 'in_progress', 'completed', 'cancelled'] as const
  const teachers = [
    'Анна Петрова',
    'Елена Иванова',
    'Мария Сидорова',
    'Ксения Козлова',
    'Дарья Морозова',
    'София Волкова',
  ] as const

  return Array.from({ length: 32 }, (_, i) => {
    const createdDate = new Date()
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30))

    const hasDeadline = Math.random() > 0.3
    const deadline = hasDeadline
      ? new Date(createdDate.getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000)
      : undefined

    const priceTypes: ('hour' | 'task' | 'month')[] = ['hour', 'task', 'month']

    return {
      id: `order-${i + 1}`,
      title: `${['Помощь с ДЗ', 'Подготовка к экзамену', 'Разбор темы', 'Консультация'][i % 4]} по ${subjects[i % subjects.length]}`,
      description: `Требуется помощь с ${subjects[i % subjects.length].toLowerCase()}. ${['Срочное задание', 'Подготовка к контрольной', 'Разбор сложных задач', 'Объяснение теории'][i % 4]}.`,
      price: Math.floor(Math.random() * 3000) + 1000,
      priceType: priceTypes[i % 3],
      subject: subjects[i % subjects.length],
      teacher: teachers[i % teachers.length],
      student: {
        id: `student-${i + 1}`,
        name: `${['Анна', 'Елена', 'Мария', 'Ксения', 'Дарья', 'София'][i % 6]} ${['Петрова', 'Иванова', 'Сидорова', 'Козлова', 'Морозова', 'Волкова'][i % 6]}`,
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
        completedOrders: Math.floor(Math.random() * 20) + 1,
      },
      urgency: urgencies[i % urgencies.length],
      status: statuses[i % statuses.length],
      format: formats[i % formats.length],
      deadline: deadline?.toISOString(),
      createdAt: createdDate.toISOString(),
      tags: ['Срочно', 'ЕГЭ', 'ОГЭ', 'Контрольная', 'Олимпиада'].slice(
        0,
        Math.floor(Math.random() * 3) + 1,
      ),
    }
  })
}

const resetFilters = () => {
  filters.value = {
    search: '',
    subject: null,
    teacher: null,
    status: 'all',
    urgency: 'all',
    format: 'all',
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

const formatUrgency = (urgency: string) => {
  const map = {
    today: { text: 'Сегодня', color: 'text-red-500', bg: 'bg-red-100' },
    this_week: { text: 'На этой неделе', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    not_urgent: { text: 'Не срочно', color: 'text-telegram-success', bg: 'bg-green-100' },
  }
  return (
    map[urgency as keyof typeof map] || {
      text: 'Неизвестно',
      color: 'text-telegram-textSecondary',
      bg: 'bg-telegram-secondary',
    }
  )
}

const formatStatus = (status: string) => {
  const map = {
    pending: { text: 'Ожидание', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    in_progress: { text: 'В работе', color: 'text-blue-600', bg: 'bg-blue-100' },
    completed: { text: 'Завершен', color: 'text-telegram-success', bg: 'bg-green-100' },
    cancelled: { text: 'Отменен', color: 'text-red-500', bg: 'bg-red-100' },
  }
  return (
    map[status as keyof typeof map] || {
      text: 'Неизвестно',
      color: 'text-telegram-textSecondary',
      bg: 'bg-telegram-secondary',
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const respondToOrder = (order: Order) => {
  telegramStore.hapticFeedback('medium')
  console.log('Откликнуться на заказ:', order.title)
}

const viewOrderDetails = (order: Order) => {
  telegramStore.hapticFeedback('light')
  console.log('Просмотр деталей заказа:', order.title)
}

const contactStudent = (order: Order) => {
  telegramStore.hapticFeedback('medium')
  console.log('Связаться со студентом:', order.student.name)
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
        placeholder="Поиск заказов, предметов, студентов..."
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
              v-model="filters.subject"
              :options="availableSubjects"
              placeholder="Выберите предмет"
            />
          </div>

          <!-- Teacher Filter -->
          <div>
            <Select
              label="Преподаватель"
              v-model="filters.teacher"
              :options="availableTeachers"
              placeholder="Выберите преподавателя"
            />
          </div>

          <!-- Sort -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <Select
                label="Сортировать"
                v-model="filters.sortBy"
                :options="sortOptions"
                placeholder="Выберите сортировку"
              />
            </div>
            <div>
              <Select
                label="Порядок"
                v-model="filters.sortOrder"
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
      <Card
        v-for="order in filteredOrders"
        :key="order.id"
        class="p-4 hover:border-telegram-accent transition-colors cursor-pointer"
        @click="viewOrderDetails(order)"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <h3 class="font-semibold text-telegram-text mb-1">{{ order.subject }}</h3>
            <div class="flex items-center space-x-2 text-sm text-telegram-textSecondary">
              <span>{{ order.teacher }}</span>
            </div>
          </div>
          <div class="text-right">
            <div class="font-bold text-telegram-accent">
              {{ order.price }}
            </div>
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
              <span>{{ order.student.completedOrders }} заказов</span>
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
          <div class="text-right">
            <span
              :class="[formatStatus(order.status).color, formatStatus(order.status).bg]"
              class="text-xs px-2 py-1 rounded-full font-medium"
            >
              {{ formatStatus(order.status).text }}
            </span>
          </div>
        </div>

        <!-- Description -->
        <p class="text-telegram-textSecondary text-sm mb-3 line-clamp-2">
          {{ order.description }}
        </p>

        <!-- Meta Info -->
        <div class="flex items-center justify-between text-sm text-telegram-textSecondary mb-3">
          <span>Создан: {{ formatDate(order.createdAt) }}</span>
          <span v-if="order.deadline">Дедлайн: {{ formatDate(order.deadline) }}</span>
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap gap-2 mb-3">
          <span
            v-for="tag in order.tags"
            :key="tag"
            class="px-2 py-1 bg-telegram-secondary text-telegram-text text-xs rounded-lg"
          >
            {{ tag }}
          </span>
        </div>

        <!-- Actions -->
        <div class="flex space-x-2 pt-3 border-t border-telegram-border">
          <Button
            v-if="order.status === 'pending'"
            @click.stop="respondToOrder(order)"
            size="sm"
            class="flex-1"
          >
            Откликнуться
          </Button>
          <Button
            v-else
            @click.stop="contactStudent(order)"
            variant="secondary"
            size="sm"
            class="flex-1"
          >
            Связаться
          </Button>
          <Button
            @click.stop="viewOrderDetails(order)"
            variant="secondary"
            size="sm"
            class="flex-1"
          >
            Подробнее
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
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
