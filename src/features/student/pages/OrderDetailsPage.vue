<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'

const route = useRoute()
const router = useRouter()
const telegramStore = useTelegramStore()

const orderId = ref(Number(route.params.id))

// Данные заказа
const order = ref({
  id: 1,
  subject: 'Математика',
  description: 'Подготовка к ЕГЭ по математике, особенно задачи с параметрами',
  budget: 2000,
  format: 'Онлайн',
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

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'pending':
      return {
        color: 'bg-telegram-accent',
        text: 'Ожидает ответа',
        textColor: 'text-telegram-accent',
      }
    case 'accepted':
      return { color: 'bg-orange-500', text: 'Отклик принят', textColor: 'text-orange-600' }
    case 'in_progress':
      return { color: 'bg-telegram-success', text: 'В работе', textColor: 'text-telegram-success' }
    case 'declined':
      return {
        color: 'bg-telegram-textSecondary',
        text: 'Отклонен',
        textColor: 'text-telegram-textSecondary',
      }
    default:
      return {
        color: 'bg-telegram-textSecondary',
        text: 'Неизвестно',
        textColor: 'text-telegram-textSecondary',
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

const goBack = () => {
  telegramStore.hapticFeedback('light')
  router.back()
}

const viewResponse = (response: any) => {
  telegramStore.hapticFeedback('light')
  if (!response.isRead) {
    response.isRead = true
  }
  console.log('Просмотр отклика:', response.id)
}

const acceptResponse = (response: any) => {
  telegramStore.hapticFeedback('medium')

  // Принимаем выбранный отклик
  response.status = 'accepted'

  // Автоматически отклоняем все остальные отклики
  responses.value.forEach((r) => {
    if (r.id !== response.id && r.status === 'pending') {
      r.status = 'declined'
    }
  })

  console.log('Принят отклик от:', response.tutor.name)
  console.log('Остальные отклики автоматически отклонены')
  // TODO: API call
}

const declineResponse = (response: any) => {
  telegramStore.hapticFeedback('light')
  response.status = 'declined'
  console.log('Отклонен отклик от:', response.tutor.name)
  // TODO: API call
}

const contactTutor = (response: any) => {
  telegramStore.hapticFeedback('light')
  console.log('Связаться с репетитором:', response.tutor.name)
  // TODO: Открыть чат или переход к контактам
}

const acceptService = (response: any) => {
  telegramStore.hapticFeedback('medium')
  response.status = 'in_progress'
  console.log('Принята услуга репетитора:', response.tutor.name)
  // TODO: API call - начать работу с репетитором
}

const declineService = (response: any) => {
  telegramStore.hapticFeedback('heavy')
  response.status = 'declined'
  console.log('Отклонена услуга репетитора:', response.tutor.name)
  // TODO: API call - отклонить услугу после принятия отклика
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
        <svg
          class="w-5 h-5 text-telegram-text"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <div class="flex-1">
        <h1 class="text-xl font-bold text-telegram-text mb-1">{{ order.subject }}</h1>
        <p class="text-telegram-textSecondary text-sm">{{ order.budget }}₽ • {{ order.format }}</p>
      </div>
    </div>

    <!-- Order Info -->
    <Card class="p-6 mb-6">
      <h2 class="text-lg font-semibold text-telegram-text mb-3">Описание заказа</h2>
      <p class="text-telegram-text text-sm mb-4">{{ order.description }}</p>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <span class="text-xs text-telegram-textSecondary">График:</span>
          <div class="text-sm font-medium text-telegram-text">{{ order.schedule }}</div>
        </div>
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
      <Card
        v-for="response in responses"
        :key="response.id"
        class="p-6"
        :class="{
          'border-telegram-accent bg-telegram-accent/5': !response.isRead,
          'border-orange-500 bg-orange-500/10': response.status === 'accepted',
          'border-telegram-success bg-telegram-success/10': response.status === 'in_progress',
        }"
      >
        <!-- Tutor Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div
              class="w-12 h-12 bg-telegram-accent/20 rounded-full flex items-center justify-center"
            >
              <span class="text-telegram-accent font-semibold">{{ response.tutor.avatar }}</span>
            </div>
            <div>
              <h3 class="font-semibold text-telegram-text">{{ response.tutor.name }}</h3>
              <div class="flex items-center space-x-3 text-sm text-telegram-textSecondary">
                <div class="flex items-center space-x-1">
                  <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                  <span>{{ response.tutor.rating }}</span>
                </div>
                <span>{{ response.tutor.experience }} лет опыта</span>
                <span>{{ response.tutor.completedLessons }} уроков</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col items-end space-y-2">
            <span class="text-telegram-success font-semibold">{{ response.price }}₽</span>
            <span
              :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                getStatusInfo(response.status).color,
                'text-white',
              ]"
            >
              {{ getStatusInfo(response.status).text }}
            </span>
          </div>
        </div>

        <!-- Education & Subjects -->
        <div class="mb-4 p-3 bg-telegram-secondary/30 rounded-lg">
          <div class="text-sm text-telegram-text mb-2">
            <strong>Образование:</strong> {{ response.tutor.education }}
          </div>
          <div class="text-sm text-telegram-textSecondary">
            <strong>Предметы:</strong> {{ response.tutor.subjects.join(', ') }}
          </div>
        </div>

        <!-- Message -->
        <div class="mb-4">
          <p class="text-telegram-text text-sm leading-relaxed">{{ response.message }}</p>
        </div>

        <!-- Availability -->
        <div class="mb-4 p-3 bg-telegram-secondary/50 rounded-lg">
          <div class="text-xs text-telegram-textSecondary mb-1">Доступность:</div>
          <div class="text-sm text-telegram-text">{{ response.availability }}</div>
        </div>

        <!-- Response Time -->
        <div class="flex items-center justify-between mb-4">
          <span class="text-telegram-textSecondary text-xs">
            Отклик отправлен {{ formatDate(response.respondedAt) }}
          </span>
          <div v-if="!response.isRead" class="w-2 h-2 bg-telegram-accent rounded-full"></div>
        </div>

        <!-- Actions -->
        <div class="flex space-x-3">
          <!-- Pending Response Actions -->
          <template v-if="response.status === 'pending'">
            <Button @click="acceptResponse(response)" class="flex-1">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Принять
            </Button>
            <Button @click="declineResponse(response)" variant="secondary" class="flex-1">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Отклонить
            </Button>
          </template>

          <!-- Accepted Response Actions -->
          <template v-else-if="response.status === 'accepted'">
            <div class="space-y-3">
              <Button @click="contactTutor(response)" variant="secondary" class="w-full">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Связаться
              </Button>
              <div class="flex space-x-3">
                <Button @click="acceptService(response)" class="flex-1">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Договорились
                </Button>
                <Button @click="declineService(response)" variant="ghost" class="flex-1">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Не подошел
                </Button>
              </div>
            </div>
          </template>

          <!-- In Progress Response Actions -->
          <template v-else-if="response.status === 'in_progress'">
            <Button @click="contactTutor(response)" variant="secondary" class="flex-1">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Связаться
            </Button>
            <div class="flex-1 text-center py-2 text-telegram-success text-sm font-medium">
              Услуга принята
            </div>
          </template>

          <!-- Declined Response -->
          <template v-else-if="response.status === 'declined'">
            <div class="flex-1 text-center py-2 text-telegram-textSecondary text-sm">
              Отклик отклонен
            </div>
          </template>
        </div>
      </Card>
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
