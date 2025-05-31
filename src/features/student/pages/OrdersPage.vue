<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'

const router = useRouter()
const telegramStore = useTelegramStore()

const activeTab = ref<'orders' | 'responses'>('orders')

// Моковые данные заявок студента
const myOrders = ref([
  {
    id: 1,
    subject: 'Математика',
    description: 'Подготовка к ЕГЭ по математике, особенно задачи с параметрами',
    budget: 2000,
    format: 'Онлайн',
    urgency: 'normal',
    schedule: 'Вторник, четверг вечером',
    createdAt: '2024-01-18T10:30:00',
    status: 'active',
    responsesCount: 5,
    newResponsesCount: 2,
  },
  {
    id: 2,
    subject: 'Физика',
    description: 'Подготовка к олимпиаде, нужна помощь с механикой и термодинамикой',
    budget: 2500,
    format: 'Очно',
    urgency: 'urgent',
    schedule: 'Выходные',
    createdAt: '2024-01-17T16:15:00',
    status: 'active',
    responsesCount: 3,
    newResponsesCount: 1,
  },
  {
    id: 3,
    subject: 'Химия',
    description: 'Школьная программа 10 класс, органическая химия',
    budget: 1800,
    format: 'Любой',
    urgency: 'normal',
    schedule: 'Будни вечером',
    createdAt: '2024-01-15T14:20:00',
    status: 'paused',
    responsesCount: 8,
    newResponsesCount: 0,
  },
])

// Моковые данные откликов на заявки
const responses = ref([
  {
    id: 1,
    orderId: 1,
    orderSubject: 'Математика',
    tutor: {
      name: 'Анна Петрова',
      avatar: 'АП',
      rating: 4.9,
      experience: 8,
      education: 'МГУ, механико-математический факультет',
    },
    message:
      'Здравствуйте! Готова помочь с подготовкой к ЕГЭ по математике. Специализируюсь на параметрах и планиметрии. Занимаюсь подготовкой к ЕГЭ 8 лет, мои ученики набирают 80+ баллов.',
    price: 2200,
    isRead: false,
    respondedAt: '2024-01-18T14:30:00',
    status: 'pending',
  },
  {
    id: 2,
    orderId: 1,
    orderSubject: 'Математика',
    tutor: {
      name: 'Дмитрий Иванов',
      avatar: 'ДИ',
      rating: 4.7,
      experience: 5,
      education: 'МФТИ, факультет прикладной математики',
    },
    message:
      'Добрый день! Помогу подготовиться к ЕГЭ на высокий балл. Работаю с C1-C6, у меня есть авторские методики решения параметров.',
    price: 2500,
    isRead: false,
    respondedAt: '2024-01-18T16:45:00',
    status: 'pending',
  },
  {
    id: 3,
    orderId: 2,
    orderSubject: 'Физика',
    tutor: {
      name: 'Елена Сидорова',
      avatar: 'ЕС',
      rating: 5.0,
      experience: 12,
      education: 'МГУ, физический факультет',
    },
    message:
      'Здравствуйте! Работаю с олимпиадниками 12 лет. Мои ученики - призеры региональных и всероссийских олимпиад. Готова провести пробное занятие.',
    price: 3000,
    isRead: true,
    respondedAt: '2024-01-17T20:15:00',
    status: 'accepted',
  },
])

const totalNewResponses = computed(() => responses.value.filter((r) => !r.isRead).length)

const filteredResponses = computed(() => responses.value)

const getOrderStatusInfo = (status: string) => {
  switch (status) {
    case 'active':
      return { color: 'bg-telegram-success', text: 'Активна' }
    case 'paused':
      return { color: 'bg-orange-500', text: 'Приостановлена' }
    case 'completed':
      return { color: 'bg-telegram-textSecondary', text: 'Завершена' }
    default:
      return { color: 'bg-telegram-textSecondary', text: 'Неизвестно' }
  }
}

const getResponseStatusInfo = (status: string) => {
  switch (status) {
    case 'pending':
      return { color: 'bg-telegram-accent', text: 'Ожидает ответа' }
    case 'accepted':
      return { color: 'bg-telegram-success', text: 'Принят' }
    case 'declined':
      return { color: 'bg-telegram-textSecondary', text: 'Отклонен' }
    default:
      return { color: 'bg-telegram-textSecondary', text: 'Неизвестно' }
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

const createOrder = () => {
  telegramStore.hapticFeedback('light')
  router.push('/student/orders/create')
}

const viewOrderDetails = (order: any) => {
  telegramStore.hapticFeedback('light')
  console.log('Просмотр заявки:', order.id)
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
  response.status = 'accepted'
  console.log('Принят отклик:', response.id)
}

const declineResponse = (response: any) => {
  telegramStore.hapticFeedback('light')
  response.status = 'declined'
  console.log('Отклонен отклик:', response.id)
}

const contactTutor = (response: any) => {
  telegramStore.hapticFeedback('light')
  console.log('Связаться с репетитором:', response.tutor.name)
}
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-telegram-text mb-2">Мои заявки</h1>
      <p class="text-telegram-textSecondary">
        Управляйте заявками и просматривайте отклики репетиторов
      </p>
    </div>

    <!-- Tabs -->
    <div class="flex space-x-2 mb-6">
      <button
        @click="activeTab = 'orders'"
        class="flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
        :class="{
          'bg-telegram-accent text-white': activeTab === 'orders',
          'bg-telegram-secondary text-telegram-textSecondary': activeTab !== 'orders',
        }"
      >
        Заявки ({{ myOrders.length }})
      </button>
      <button
        @click="activeTab = 'responses'"
        class="flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative"
        :class="{
          'bg-telegram-accent text-white': activeTab === 'responses',
          'bg-telegram-secondary text-telegram-textSecondary': activeTab !== 'responses',
        }"
      >
        Отклики ({{ responses.length }})
        <div
          v-if="totalNewResponses > 0 && activeTab !== 'responses'"
          class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
        >
          {{ totalNewResponses }}
        </div>
      </button>
    </div>

    <!-- Orders Tab -->
    <div v-if="activeTab === 'orders'">
      <div v-if="myOrders.length === 0" class="text-center py-16">
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-telegram-text mb-3">У вас пока нет заявок</h2>
        <p class="text-telegram-textSecondary mb-8 max-w-sm mx-auto">
          Создайте первую заявку на поиск репетитора и мы найдем подходящих кандидатов
        </p>
        <Button @click="createOrder" class="mx-auto">Создать заявку</Button>
      </div>

      <div v-else class="space-y-4">
        <Card
          v-for="order in myOrders"
          :key="order.id"
          @click="viewOrderDetails(order)"
          class="p-6 cursor-pointer hover:border-telegram-accent transition-colors duration-200"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-telegram-text font-semibold text-lg mb-1">{{ order.subject }}</h3>
              <div class="flex items-center space-x-3">
                <div class="flex items-center space-x-2">
                  <div
                    :class="[getOrderStatusInfo(order.status).color, 'w-2 h-2 rounded-full']"
                  ></div>
                  <span class="text-telegram-textSecondary text-sm">{{
                    getOrderStatusInfo(order.status).text
                  }}</span>
                </div>
                <span class="text-telegram-success font-semibold">{{ order.budget }}₽/занятие</span>
              </div>
            </div>
            <div class="text-right">
              <div class="text-telegram-textSecondary text-xs mb-1">Откликов</div>
              <div class="flex items-center space-x-1">
                <span class="text-telegram-text text-lg font-bold">{{ order.responsesCount }}</span>
                <div
                  v-if="order.newResponsesCount > 0"
                  class="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                >
                  {{ order.newResponsesCount }}
                </div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <p class="text-telegram-text text-sm mb-4">{{ order.description }}</p>

          <!-- Details -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p class="text-telegram-textSecondary text-xs mb-1">Формат</p>
              <p class="text-telegram-text font-medium">{{ order.format }}</p>
            </div>
            <div>
              <p class="text-telegram-textSecondary text-xs mb-1">График</p>
              <p class="text-telegram-text font-medium">{{ order.schedule }}</p>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <p class="text-telegram-textSecondary text-xs mb-1">Создана</p>
              <p class="text-telegram-text text-sm">{{ formatDate(order.createdAt) }}</p>
            </div>
            <div v-if="order.urgency === 'urgent'" class="flex items-center space-x-1">
              <span class="text-red-500 text-sm">🔥</span>
              <span class="text-red-500 text-sm font-medium">Срочно</span>
            </div>
          </div>
        </Card>

        <div class="pt-4">
          <Button @click="createOrder" class="w-full">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Создать новую заявку
          </Button>
        </div>
      </div>
    </div>

    <!-- Responses Tab -->
    <div v-if="activeTab === 'responses'">
      <div v-if="filteredResponses.length === 0" class="text-center py-16">
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
        <p class="text-telegram-textSecondary mb-8 max-w-sm mx-auto">
          Когда репетиторы откликнутся на ваши заявки, вы увидите их здесь
        </p>
      </div>

      <div v-else class="space-y-4">
        <Card
          v-for="response in filteredResponses"
          :key="response.id"
          @click="viewResponse(response)"
          class="p-6 cursor-pointer hover:border-telegram-accent transition-colors duration-200"
          :class="{ 'border-telegram-accent bg-telegram-accent/5': !response.isRead }"
        >
          <!-- Header with order info -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-2">
              <h4 class="text-telegram-textSecondary text-sm">Отклик на заявку:</h4>
              <span class="text-telegram-accent font-medium">{{ response.orderSubject }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <div
                :class="[getResponseStatusInfo(response.status).color, 'w-2 h-2 rounded-full']"
              ></div>
              <span class="text-telegram-textSecondary text-xs">{{
                getResponseStatusInfo(response.status).text
              }}</span>
              <div v-if="!response.isRead" class="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
          </div>

          <!-- Tutor info -->
          <div class="flex items-start space-x-3 mb-4">
            <div
              class="w-12 h-12 bg-telegram-accent rounded-full flex items-center justify-center text-white font-semibold"
            >
              {{ response.tutor.avatar }}
            </div>
            <div class="flex-1">
              <h3 class="text-telegram-text font-semibold">{{ response.tutor.name }}</h3>
              <p class="text-telegram-textSecondary text-sm">{{ response.tutor.education }}</p>
              <div class="flex items-center space-x-4 mt-1">
                <div class="flex items-center space-x-1">
                  <svg class="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                  <span class="text-telegram-textSecondary text-xs">{{
                    response.tutor.rating
                  }}</span>
                </div>
                <span class="text-telegram-textSecondary text-xs"
                  >{{ response.tutor.experience }} лет опыта</span
                >
                <span class="text-telegram-success text-sm font-semibold"
                  >{{ response.price }}₽/занятие</span
                >
              </div>
            </div>
          </div>

          <!-- Message -->
          <p class="text-telegram-text text-sm mb-4 leading-relaxed">{{ response.message }}</p>

          <!-- Response time -->
          <div class="flex items-center justify-between mb-4">
            <span class="text-telegram-textSecondary text-xs">
              Отклик отправлен {{ formatDate(response.respondedAt) }}
            </span>
          </div>

          <!-- Actions -->
          <div v-if="response.status === 'pending'" class="flex space-x-3">
            <Button @click.stop="acceptResponse(response)" class="flex-1"> Принять </Button>
            <Button @click.stop="declineResponse(response)" variant="secondary" class="flex-1">
              Отклонить
            </Button>
          </div>
          <div v-else-if="response.status === 'accepted'" class="flex space-x-3">
            <Button @click.stop="contactTutor(response)" class="flex-1"> Связаться </Button>
            <Button variant="secondary" class="flex-1" disabled> Принят </Button>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>
