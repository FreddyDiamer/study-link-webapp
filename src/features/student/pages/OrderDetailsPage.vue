<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import Card from '@/shared/components/ui/Card.vue'
import OrderResponseCard from '../components/OrderResponseCard.vue'
import { ArrowIcon } from '@/shared/components/icons'

const router = useRouter()
const telegramStore = useTelegramStore()

// Данные заказа
const order = ref({
  id: 1,
  subject: 'Математика',
  description: 'Подготовка к ЕГЭ по математике, особенно задачи с параметрами',
  budget: 2000,
  urgency: 'normal',
  schedule: 'Вторник, четверг вечером',
  createdAt: '2024-01-18T10:30:00',
  status: 'active',
})

// Отклики на заказ
const responses = ref([
  {
    id: 1,
    tutor: {
      name: 'Анна Петрова',
      avatar: 'АП',
      rating: 4.9,
      experience: 8,
      education: 'МГУ, механико-математический факультет',
      completedLessons: 156,
      subjects: ['Математика', 'Алгебра', 'Геометрия'],
    },
    message:
      'Здравствуйте! Готова помочь с подготовкой к ЕГЭ по математике. Специализируюсь на параметрах и планиметрии. Занимаюсь подготовкой к ЕГЭ 8 лет, мои ученики набирают 80+ баллов. Провожу бесплатное пробное занятие для знакомства.',
    price: 2200,
    isRead: false,
    respondedAt: '2024-01-18T14:30:00',
    status: 'pending',
    availability: 'Вторник, четверг 18:00-21:00',
  },
  {
    id: 2,
    tutor: {
      name: 'Дмитрий Иванов',
      avatar: 'ДИ',
      rating: 4.7,
      experience: 5,
      education: 'МФТИ, факультет прикладной математики',
      completedLessons: 89,
      subjects: ['Математика', 'Физика'],
    },
    message:
      'Добрый день! Помогу подготовиться к ЕГЭ на высокий балл. Работаю с C1-C6, у меня есть авторские методики решения параметров. Готов предоставить материалы и план подготовки.',
    price: 2500,
    isRead: false,
    respondedAt: '2024-01-18T16:45:00',
    status: 'pending',
    availability: 'Понедельник-пятница 19:00-22:00',
  },
  {
    id: 3,
    tutor: {
      name: 'Елена Сидорова',
      avatar: 'ЕС',
      rating: 5.0,
      experience: 12,
      education: 'МГУ, физический факультет',
      completedLessons: 234,
      subjects: ['Математика', 'Физика', 'Астрономия'],
    },
    message:
      'Здравствуйте! Работаю с учениками разного уровня подготовки уже 12 лет. Гарантирую индивидуальный подход и качественную подготовку. Мои ученики поступают в ведущие вузы страны.',
    price: 3000,
    isRead: true,
    respondedAt: '2024-01-17T20:15:00',
    status: 'accepted',
    availability: 'Гибкий график',
  },
  {
    id: 4,
    tutor: {
      name: 'Михаил Козлов',
      avatar: 'МК',
      rating: 4.8,
      experience: 6,
      education: 'СПбГУ, математико-механический факультет',
      completedLessons: 112,
      subjects: ['Математика', 'Информатика'],
    },
    message:
      'Приветствую! Помогу качественно подготовиться к ЕГЭ. Использую современные методики и интерактивные материалы. Занятия проходят интересно и эффективно.',
    price: 1800,
    isRead: true,
    respondedAt: '2024-01-17T12:30:00',
    status: 'declined',
    availability: 'Выходные, будни вечером',
  },
])

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

const goBack = () => {
  telegramStore.hapticFeedback('light')
  router.back()
}

const acceptService = (response: any) => {
  responses.value = responses.value.map((r) => {
    if (r.id === response.id) {
      r.status = 'in_progress'
    } else {
      r.status = 'declined'
    }

    return r
  })
}

onMounted(() => {
  // TODO: Загрузить данные заказа и откликов по orderId
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
        <ArrowIcon direction="left" />
      </button>
      <div class="flex-1">
        <h1 class="text-xl font-bold text-telegram-text mb-1">{{ order.subject }}</h1>
        <p class="text-telegram-textSecondary text-sm">{{ order.budget }}₽</p>
      </div>
    </div>

    <!-- Order Info -->
    <Card class="p-6 mb-6">
      <h2 class="text-lg font-semibold text-telegram-text mb-3">Описание заказа</h2>
      <p class="text-telegram-text text-sm mb-4">{{ order.description }}</p>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <span class="text-xs text-telegram-textSecondary">Создана:</span>
          <div class="text-sm font-medium text-telegram-text">
            {{ formatDate(order.createdAt) }}
          </div>
        </div>
      </div>
    </Card>

    <!-- Responses -->
    <div class="mb-4">
      <h2 class="text-lg font-semibold text-telegram-text mb-4">
        Отклики ({{ responses.length }})
      </h2>
    </div>

    <div v-if="responses.length > 0" class="space-y-4">
      <OrderResponseCard
        v-for="response in responses"
        :key="response.id"
        :response="response"
        @acceptService="acceptService"
      />
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

      <h2 class="text-xl font-semibold text-telegram-text mb-3">Пока нет откликов</h2>

      <p class="text-telegram-textSecondary max-w-sm mx-auto">
        Когда репетиторы откликнутся на ваш заказ, они появятся здесь
      </p>
    </div>
  </div>
</template>
