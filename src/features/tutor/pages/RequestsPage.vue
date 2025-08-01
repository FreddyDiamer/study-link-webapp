<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { useOrder } from '@/shared/composables'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import RequestCard from '../components/RequestCard.vue'
import type { Request } from '@/shared/types'

const router = useRouter()
const telegramStore = useTelegramStore()
const { requests: availableRequests, createRequestResponse } = useOrder()

const requests = ref<Request[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const selectedTab = ref<'all' | 'responded' | 'viewed'>('all')

const loadRequests = async () => {
  isLoading.value = true
  error.value = null

  try {
    // Используем доступные заявки из composable
    requests.value = availableRequests.value?.items || []
  } catch (err: any) {
    error.value = err.message || 'Ошибка загрузки заявок'
    console.error('Ошибка загрузки заявок:', err)
  } finally {
    isLoading.value = false
  }
}

const filteredRequests = computed(() => {
  switch (selectedTab.value) {
    case 'responded':
      return requests.value.filter((request) =>
        request.responses?.some((r) => r.tutorId === 'current-tutor-id'),
      )
    case 'viewed':
      return requests.value.filter((request) => (request.responses?.length || 0) > 0)
    default:
      return requests.value
  }
})

const formatPrice = (price: number) => {
  return `${(price / 100).toLocaleString()} ₽`
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case 'HIGH':
      return 'text-red-600 bg-red-100'
    case 'MEDIUM':
      return 'text-yellow-600 bg-yellow-100'
    case 'LOW':
      return 'text-green-600 bg-green-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

const getUrgencyText = (urgency: string) => {
  switch (urgency) {
    case 'HIGH':
      return 'Срочно'
    case 'MEDIUM':
      return 'Средне'
    case 'LOW':
      return 'Не срочно'
    default:
      return 'Не указано'
  }
}

const getRequestStatusInfo = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return { text: 'Активна', color: 'bg-green-500' }
    case 'INACTIVE':
      return { text: 'Неактивна', color: 'bg-gray-500' }
    case 'COMPLETED':
      return { text: 'Завершена', color: 'bg-blue-500' }
    default:
      return { text: 'Неизвестно', color: 'bg-gray-500' }
  }
}

const handleRespond = async (requestId: string) => {
  try {
    await createRequestResponse({
      tutorId: 'current-tutor-id', // TODO: получить из auth
      requestId,
      message: 'Готов помочь с вашей задачей!',
      price: 150000, // 1500 рублей
      proposedDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })

    telegramStore.showAlert('Отклик отправлен!')
    await loadRequests() // Перезагружаем список
  } catch (error: any) {
    console.error('Ошибка отправки отклика:', error)
    telegramStore.showAlert('Ошибка при отправке отклика. Попробуйте снова.')
  }
}

const goToRequestDetails = (requestId: string) => {
  router.push(`/tutor/requests/${requestId}`)
}

onMounted(() => {
  loadRequests()
})
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-telegram-text mb-2">Заявки студентов</h1>
      <p class="text-telegram-textSecondary">
        Просматривайте и откликайтесь на заявки по вашим предметам
      </p>
    </div>

    <!-- Filters -->
    <div class="flex space-x-2 mb-6 overflow-x-auto">
      <button
        @click="selectedTab = 'all'"
        class="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
        :class="{
          'bg-telegram-accent text-white': selectedTab === 'all',
          'bg-telegram-secondary text-telegram-textSecondary': selectedTab !== 'all',
        }"
      >
        Все ({{ requests.length }})
      </button>
      <button
        @click="selectedTab = 'responded'"
        class="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 relative"
        :class="{
          'bg-telegram-accent text-white': selectedTab === 'responded',
          'bg-telegram-secondary text-telegram-textSecondary': selectedTab !== 'responded',
        }"
      >
        Откликнулся ({{
          requests.filter((r) => r.responses?.some((res) => res.tutorId === 'current-tutor-id'))
            .length
        }})
        <div
          v-if="
            requests.filter((r) => r.responses?.some((res) => res.tutorId === 'current-tutor-id'))
              .length > 0 && selectedTab !== 'responded'
          "
          class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
        ></div>
      </button>
      <button
        @click="selectedTab = 'viewed'"
        class="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
        :class="{
          'bg-telegram-accent text-white': selectedTab === 'viewed',
          'bg-telegram-secondary text-telegram-textSecondary': selectedTab !== 'viewed',
        }"
      >
        Просмотренные ({{ requests.filter((r) => (r.responses?.length || 0) > 0).length }})
      </button>
    </div>

    <!-- Requests List -->
    <div v-if="isLoading" class="text-center py-16">
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
      <h2 class="text-xl font-semibold text-telegram-text mb-3">Загрузка заявок...</h2>
      <p class="text-telegram-textSecondary">Пожалуйста, подождите.</p>
    </div>

    <div v-else-if="error" class="text-center py-16 text-red-500">
      <p>{{ error }}</p>
      <button @click="loadRequests" class="mt-4 px-4 py-2 bg-telegram-accent text-white rounded-lg">
        Попробовать снова
      </button>
    </div>

    <div v-else-if="filteredRequests.length === 0" class="text-center py-16">
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
      <h2 class="text-xl font-semibold text-telegram-text mb-3">
        {{ selectedTab === 'all' ? 'Пока нет заявок' : 'Нет заявок в этой категории' }}
      </h2>
      <p class="text-telegram-textSecondary">
        {{
          selectedTab === 'all'
            ? 'Когда студенты создадут заявки по вашим предметам, вы увидите их здесь'
            : 'Попробуйте выбрать другую категорию или проверьте позже'
        }}
      </p>
    </div>

    <div v-else class="space-y-4">
      <RequestCard
        v-for="request in filteredRequests"
        :key="request.id"
        :request="request"
        @respond="handleRespond"
      />
    </div>
  </div>
</template>
