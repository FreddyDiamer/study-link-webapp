<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { useEducation } from '@/shared/composables'
import { useOrder } from '@/shared/composables'
import Card from '@/shared/components/ui/Card.vue'
import OrderResponseCard from '../components/OrderResponseCard.vue'
import { ArrowIcon } from '@/shared/components/icons'
import { type Request, type RequestResponse, ResponseStatus } from '@/shared/types'

const route = useRoute()
const router = useRouter()
const telegramStore = useTelegramStore()
const { getRequest, getRequestResponses } = useOrder()
const {
  activeSubjects,
  isLoading: educationLoading,
  error: educationError,
  isInitialized,
  initialize,
} = useEducation()

// Данные заказа
const order = ref<Request | null>(null)
const responses = ref<RequestResponse[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

// Загрузка данных заказа
const loadOrderDetails = async () => {
  const orderId = route.params.id as string
  if (!orderId) return

  isLoading.value = true
  error.value = null

  try {
    // Загружаем заказ и отклики параллельно
    const [orderData, responsesData] = await Promise.all([
      getRequest(orderId),
      getRequestResponses(orderId),
    ])

    order.value = orderData
    responses.value = responsesData
  } catch (err: any) {
    error.value = err.message || 'Ошибка загрузки данных заказа'
    console.error('Ошибка загрузки заказа:', err)
  } finally {
    isLoading.value = false
  }
}

// Вычисляемые свойства
const subjectName = computed(() => {
  return order.value?.subject?.name || 'Предмет не указан'
})

const teacherName = computed(() => {
  return order.value?.teacher?.fullName || 'Преподаватель не указан'
})

const formatPrice = (price: number) => {
  return `${price} ₽`
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const handleBack = () => {
  router.back()
}

const handleEditOrder = () => {
  if (order.value) {
    router.push(`/student/orders/${order.value.id}/edit`)
  }
}

const handleResponseAction = async (responseId: string, action: 'accept' | 'reject') => {
  try {
    if (action === 'accept') {
      // TODO: Реализовать принятие отклика
      console.log('Принятие отклика:', responseId)
    } else {
      // TODO: Реализовать отклонение отклика
      console.log('Отклонение отклика:', responseId)
    }

    // Перезагружаем данные
    await loadOrderDetails()
  } catch (error) {
    console.error('Ошибка обработки отклика:', error)
  }
}

// Инициализация
onMounted(async () => {
  // Ждем инициализации образовательных данных
  if (!isInitialized.value) {
    await initialize()
  }

  // Загружаем данные заказа
  await loadOrderDetails()
})
</script>

<template>
  <div class="min-h-screen bg-telegram-bg pt-6">
    <!-- Header -->
    <div class="px-4 mb-6">
      <div class="flex items-center">
        <Button variant="ghost" @click="handleBack" class="!p-2">
          <ArrowIcon class="w-5 h-5 rotate-90" />
        </Button>

        <h1 class="text-lg font-semibold text-telegram-text">Детали заказа</h1>

        <!-- TODO: Добавить редактирование заявки -->
        <!-- <Button v-if="order" variant="ghost" @click="handleEditOrder" class="!p-2">
          Редактировать
        </Button> -->
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center py-16">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-telegram-button"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="px-4">
      <Card class="p-6 text-center">
        <div class="text-telegram-destructive mb-4">{{ error }}</div>
        <Button @click="loadOrderDetails">Попробовать снова</Button>
      </Card>
    </div>

    <!-- Order details -->
    <div v-else-if="order" class="px-4 space-y-6">
      <!-- Order info -->
      <Card class="p-6">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-telegram-text">{{ subjectName }}</h2>
            <div class="text-right">
              <div class="text-lg font-bold text-telegram-button">
                {{ order.budget ? formatPrice(order.budget) : 'Бюджет не указан' }}
              </div>
              <div class="text-sm text-telegram-textSecondary">бюджет</div>
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <span class="text-sm text-telegram-textSecondary">Преподаватель:</span>
              <span class="text-sm font-medium text-telegram-text">{{ teacherName }}</span>
            </div>

            <div v-if="order.deadline" class="flex items-center space-x-2">
              <span class="text-sm text-telegram-textSecondary">Срок:</span>
              <span class="text-sm font-medium text-telegram-text">
                {{ formatDate(order.deadline) }}
              </span>
            </div>

            <div class="flex items-center space-x-2">
              <span class="text-sm text-telegram-textSecondary">Создан:</span>
              <span class="text-sm font-medium text-telegram-text">
                {{ formatDate(order.createdAt) }}
              </span>
            </div>
          </div>

          <div v-if="order.description" class="pt-4 border-t border-telegram-border">
            <h3 class="text-sm font-medium text-telegram-text mb-2">Описание</h3>
            <p class="text-sm text-telegram-textSecondary">{{ order.description }}</p>
          </div>
        </div>
      </Card>

      <!-- Responses -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-telegram-text">Отклики ({{ responses.length }})</h3>
        </div>

        <div v-if="responses.length === 0" class="text-center py-8">
          <div class="text-telegram-textSecondary mb-2">Пока нет откликов</div>
          <p class="text-sm text-telegram-textSecondary">
            Репетиторы увидят вашу заявку и смогут откликнуться
          </p>
        </div>

        <div v-else class="space-y-4">
          <OrderResponseCard
            v-for="response in responses"
            :key="response.id"
            :response="response"
            @accept="handleResponseAction(response.id, 'accept')"
            @reject="handleResponseAction(response.id, 'reject')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
