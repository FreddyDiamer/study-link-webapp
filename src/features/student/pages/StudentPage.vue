<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useTelegramStore } from '@/stores/telegram'
import Button from '@/shared/components/ui/Button.vue'
import Card from '@/shared/components/ui/Card.vue'
import Input from '@/shared/components/ui/Input.vue'

const router = useRouter()
const appStore = useAppStore()
const telegramStore = useTelegramStore()

const searchQuery = ref('')

// Персонализированные предметы студента с статистикой
const mySubjects = ref([
  {
    id: 1,
    name: 'Математика',
    tutorsCount: 24,
    servicesCount: 68,
    icon: '📐',
    level: 'ЕГЭ',
    lastActivity: '2024-01-15',
    averagePrice: 2200,
    isActive: true,
  },
  {
    id: 2,
    name: 'Физика',
    tutorsCount: 18,
    servicesCount: 42,
    icon: '⚛️',
    level: 'Олимпиада',
    lastActivity: '2024-01-10',
    averagePrice: 2500,
    isActive: true,
  },
  {
    id: 3,
    name: 'Химия',
    tutorsCount: 15,
    servicesCount: 31,
    icon: '🧪',
    level: 'Школьная программа',
    lastActivity: null,
    averagePrice: 2000,
    isActive: false,
  },
])

// Рекомендуемые предметы
const recommendedSubjects = ref([
  { name: 'Английский', tutorsCount: 32, servicesCount: 89, icon: '🇬🇧', averagePrice: 1800 },
  { name: 'История', tutorsCount: 12, servicesCount: 28, icon: '📚', averagePrice: 1600 },
  { name: 'Биология', tutorsCount: 9, servicesCount: 24, icon: '🧬', averagePrice: 2100 },
])

// Статистика
const totalStats = computed(() => ({
  totalTutors: mySubjects.value.reduce((sum, subject) => sum + subject.tutorsCount, 0),
  totalServices: mySubjects.value.reduce((sum, subject) => sum + subject.servicesCount, 0),
  activeSubjects: mySubjects.value.filter((s) => s.isActive).length,
}))

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
  router.push({
    path: '/student/tutors',
    query: searchQuery.value.trim() ? { search: searchQuery.value.trim() } : {},
  })
}

const findTutorsForSubject = (subject: any) => {
  telegramStore.hapticFeedback('medium')
  router.push({
    path: '/student/tutors',
    query: { subject: subject.name },
  })
}

const addSubject = (subject: any) => {
  telegramStore.hapticFeedback('light')
  mySubjects.value.push({
    id: Date.now(),
    ...subject,
    level: 'Школьная программа',
    lastActivity: null,
    isActive: false,
  })
  console.log('Добавлен предмет:', subject.name)
}

const createOrder = () => {
  telegramStore.hapticFeedback('light')
  router.push('/student/orders/create')
}

const viewOrders = () => {
  telegramStore.hapticFeedback('light')
  router.push('/student/orders')
}
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <!-- Welcome section -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-telegram-text mb-2">Добро пожаловать!</h1>
      <p class="text-telegram-textSecondary">Управляйте обучением и находите лучших репетиторов</p>
    </div>

    <!-- Stats overview -->
    <div class="grid grid-cols-3 gap-3 mb-6">
      <Card class="p-4 text-center">
        <div class="text-2xl font-bold text-telegram-accent">{{ totalStats.activeSubjects }}</div>
        <div class="text-telegram-textSecondary text-xs">Активных предметов</div>
      </Card>
      <Card class="p-4 text-center">
        <div class="text-2xl font-bold text-telegram-success">{{ totalStats.totalTutors }}</div>
        <div class="text-telegram-textSecondary text-xs">Репетиторов</div>
      </Card>
      <Card class="p-4 text-center">
        <div class="text-2xl font-bold text-telegram-text">{{ totalStats.totalServices }}</div>
        <div class="text-telegram-textSecondary text-xs">Услуг</div>
      </Card>
    </div>

    <!-- Search -->
    <Card class="p-4 mb-6">
      <div class="space-y-3">
        <Input v-model="searchQuery" placeholder="Поиск репетиторов, предметов..." class="w-full">
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
        <Button @click="search" class="w-full" size="sm"> Найти репетиторов </Button>
      </div>
    </Card>

    <!-- My subjects -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-telegram-text">Мои предметы</h2>
        <Button variant="secondary" size="sm" @click="createOrder">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
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
              <div class="text-2xl">{{ subject.icon }}</div>
              <div class="flex-1">
                <div class="flex items-center space-x-2">
                  <h3 class="text-telegram-text font-semibold">{{ subject.name }}</h3>
                  <span
                    v-if="subject.isActive"
                    class="w-2 h-2 bg-telegram-success rounded-full"
                  ></span>
                </div>
                <p class="text-telegram-textSecondary text-sm">{{ subject.level }}</p>
                <div class="flex items-center space-x-4 mt-1">
                  <span class="text-telegram-success text-xs font-medium">
                    {{ subject.tutorsCount }} репетиторов
                  </span>
                  <span class="text-telegram-textSecondary text-xs">
                    {{ subject.servicesCount }} услуг
                  </span>
                  <span class="text-telegram-accent text-xs"> от {{ subject.averagePrice }}₽ </span>
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
    </div>

    <!-- Recommended subjects -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-telegram-text mb-4">Популярные предметы</h2>
      <div class="space-y-3">
        <Card
          v-for="subject in recommendedSubjects"
          :key="subject.name"
          @click="addSubject(subject)"
          class="p-4 cursor-pointer hover:border-telegram-accent transition-colors duration-200"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="text-2xl">{{ subject.icon }}</div>
              <div>
                <h3 class="text-telegram-text font-medium">{{ subject.name }}</h3>
                <div class="flex items-center space-x-4">
                  <span class="text-telegram-success text-xs">
                    {{ subject.tutorsCount }} репетиторов
                  </span>
                  <span class="text-telegram-textSecondary text-xs">
                    {{ subject.servicesCount }} услуг
                  </span>
                  <span class="text-telegram-accent text-xs"> от {{ subject.averagePrice }}₽ </span>
                </div>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Добавить
            </Button>
          </div>
        </Card>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="space-y-3">
      <h2 class="text-xl font-semibold text-telegram-text mb-4">Быстрые действия</h2>

      <Card
        @click="createOrder"
        class="p-4 cursor-pointer hover:border-telegram-accent transition-colors duration-200"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-telegram-button rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-telegram-text font-medium">Создать заявку</h3>
              <p class="text-telegram-textSecondary text-sm">Опишите что вам нужно изучить</p>
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
      </Card>

      <Card
        @click="viewOrders"
        class="p-4 cursor-pointer hover:border-telegram-accent transition-colors duration-200"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-telegram-success rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-telegram-text font-medium">Мои заявки</h3>
              <p class="text-telegram-textSecondary text-sm">Посмотреть активные заказы</p>
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
      </Card>
    </div>
  </div>
</template>
