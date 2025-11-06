<script setup lang="ts">
// Vue
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Stores
import { useAppStore, useAuthStore, useTelegramStore } from '@/stores'

// Composables
import { useEducation } from '@/shared/composables'

// Components
import { PlusIcon } from '@components/icons'
import { Button, Card, Input } from '@components/ui'
import QuickActions from '../components/QuickActions.vue'
import SelectGroupCard from '../components/SelectGroupCard.vue'
import { PATHS } from '@/router/paths'

// Composables
const router = useRouter()
const telegramStore = useTelegramStore()
const appStore = useAppStore()
const authStore = useAuthStore()

const {
  activeSubjects,
  isLoading: educationLoading,
  error: educationError,
  isInitialized,
  initialize,
} = useEducation()

// Data
const searchQuery = ref('')

// Вычисляемые свойства для предметов
const mySubjects = computed(() =>
  activeSubjects.value.map((subject) => ({
    id: subject.id,
    name: subject.name,
    tutorsCount: Math.floor(Math.random() * 30) + 10, // Мок данные
    servicesCount: Math.floor(Math.random() * 50) + 20, // Мок данные
    lastActivity: getRandomDate(),
    averagePrice: Math.floor(Math.random() * 1000) + 1500, // Мок данные
    isActive: subject.isActive,
  })),
)

// Computed
const getRandomDate = (): string | null => {
  const dates = [
    '2024-01-15',
    '2024-01-10',
    '2024-01-05',
    '2023-12-20',
    null, // Для неактивных предметов
  ]
  return dates[Math.floor(Math.random() * dates.length)]
}

// Methods
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Никогда'
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Сегодня'
  if (diffDays === 1) return 'Вчера'
  if (diffDays < 7) return `${diffDays} дн. назад`
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

const search = () => {
  telegramStore.hapticFeedback('light')
  const searchValue = searchQuery.value.trim()
  router.push({
    path: PATHS.STUDENT_SERVICES,
    query: searchValue ? { search: searchValue } : {},
  })
}

const findTutorsForSubject = (subject: any) => {
  telegramStore.hapticFeedback('medium')
  router.push({
    path: '/student/tutors',
    query: { subject: subject.name },
  })
}

const createOrder = () => {
  telegramStore.hapticFeedback('light')
  router.push('/student/orders/create')
}

const viewOrders = () => {
  telegramStore.hapticFeedback('light')
  router.push('/student/orders')
}

// Инициализация образовательных данных
onMounted(async () => {
  if (!isInitialized.value) {
    await initialize()
  }
})
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 flex flex-col gap-6">
    <!-- Group Number Input -->
    <SelectGroupCard v-if="appStore.showGroupCard || !authStore.user?.group" />

    <!-- Загрузка образовательных данных -->
    <div v-if="educationLoading" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"
        ></div>
        <p class="text-gray-600">Загрузка данных...</p>
      </div>
    </div>

    <!-- Ошибка образовательных данных -->
    <div v-else-if="educationError" class="text-center py-12">
      <div class="text-red-600 mb-4">{{ educationError }}</div>
      <button
        @click="initialize"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Попробовать снова
      </button>
    </div>

    <!-- Основной контент -->
    <div class="space-y-5" v-else>
      <!-- Search -->
      <Card class="p-4">
        <div class="space-y-3">
          <Input
            v-model="searchQuery"
            placeholder="Поиск репетиторов, предметов..."
            class="w-full"
          />
          <Button @click="search" class="w-full" size="sm">Найти услугу</Button>
        </div>
      </Card>

      <!-- Quick actions -->
      <div class="space-y-3">
        <h2 class="text-xl font-semibold text-telegram-text mb-4">Быстрые действия</h2>
        <QuickActions />
      </div>

      <!-- My subjects -->
      <!-- TODO: Добавить мои предметы -->
      <!-- <div></div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-telegram-text">Мои предметы</h2>
          <Button variant="secondary" size="sm" @click="createOrder">
            <PlusIcon class="w-4 h-4 mr-1" />
            Добавить
          </Button>
        </div>

        <div v-if="mySubjects.length === 0" class="text-center py-8">
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <p class="text-telegram-textSecondary mb-4">У вас пока нет предметов</p>
          <Button @click="createOrder">Добавить первый предмет</Button>
        </div>

        <div v-else class="space-y-3">
          <Card
            v-for="subject in mySubjects"
            :key="subject.id"
            @click="findTutorsForSubject(subject)"
            class="p-4 cursor-pointer hover:border-telegram-accent transition-all duration-200"
            :class="{ 'border-telegram-accent bg-telegram-accent/5': subject.isActive }"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="text-2xl">{{ subject.name[0] }}</div>
                <div class="flex-1">
                  <div class="flex items-center space-x-2">
                    <h3 class="text-telegram-text font-semibold">{{ subject.name }}</h3>
                    <span
                      v-if="subject.isActive"
                      class="w-2 h-2 bg-telegram-success rounded-full"
                    ></span>
                  </div>
                  <p class="text-telegram-textSecondary text-sm">{{ subject.name }}</p>
                  <div class="flex items-center space-x-4 mt-1">
                    <span class="text-telegram-success text-xs font-medium">
                      {{ subject.tutorsCount }} репетиторов
                    </span>
                    <span class="text-telegram-textSecondary text-xs">
                      {{ subject.servicesCount }} услуг
                    </span>
                    <span class="text-telegram-accent text-xs">
                      от {{ subject.averagePrice }}₽
                    </span>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-telegram-textSecondary text-xs mb-1">Последняя активность</div>
                <div class="text-telegram-text text-sm font-medium">
                  {{ formatDate(subject.lastActivity) }}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div> -->
    </div>
  </div>
</template>
