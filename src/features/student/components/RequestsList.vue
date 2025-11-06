<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { Card, Button } from '@/shared/components/ui'
import type { Request } from '@/shared/types'

const router = useRouter()
const telegramStore = useTelegramStore()

const props = defineProps<{
  items?: Request[]
}>()

// Данные заявок, приходящие сверху
const myRequests = computed(() => props.items ?? [])

const getRequestStatusInfo = (status: string) => {
  switch (status) {
    case 'OPEN':
      return { color: 'bg-telegram-success', text: 'Открыта' }
    case 'MATCHED':
      return { color: 'bg-blue-500', text: 'Найден репетитор' }
    case 'CLOSED':
      return { color: 'bg-telegram-textSecondary', text: 'Закрыта' }
    case 'CANCELLED':
      return { color: 'bg-red-500', text: 'Отменена' }
    default:
      return { color: 'bg-telegram-textSecondary', text: 'Неизвестно' }
  }
}

const getUrgencyText = (urgency: string) => {
  switch (urgency) {
    case 'LOW':
      return 'Низкая'
    case 'MEDIUM':
      return 'Средняя'
    case 'HIGH':
      return 'Высокая'
    default:
      return 'Не указана'
  }
}

const formatPrice = (priceInRubles: number) => {
  return Math.round(priceInRubles)
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

const createRequest = () => {
  telegramStore.hapticFeedback('light')
  router.push('/student/orders/create')
}

const viewRequestDetails = (request: any) => {
  telegramStore.hapticFeedback('light')
  router.push(`/student/orders/${request.id}`)
}

const editRequest = (request: any, event: Event) => {
  event.stopPropagation()
  telegramStore.hapticFeedback('light')
  router.push(`/student/orders/${request.id}/edit`)
}
</script>

<template>
  <div class="px-4">
    <!-- Empty State -->
    <div v-if="myRequests.length === 0" class="text-center py-16">
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
        Создайте первую заявку на поиск репетитора и получайте отклики
      </p>
      <Button @click="createRequest" class="mx-auto">Создать заявку</Button>
    </div>

    <!-- Requests List -->
    <div v-else class="space-y-4">
      <!-- Create Request Card -->
      <Card
        class="p-4 cursor-pointer hover:bg-telegram-accent/5 transition-colors border-2 border-dashed border-telegram-accent/30 hover:border-telegram-accent/50"
        @click="createRequest"
      >
        <div class="flex items-center space-x-4">
          <div
            class="w-10 h-10 bg-telegram-accent/10 rounded-full flex items-center justify-center flex-shrink-0"
          >
            <svg
              class="w-5 h-5 text-telegram-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-semibold text-telegram-accent">Создать заявку</h3>
            <p class="text-telegram-textSecondary text-sm">Найдите репетитора для ваших задач</p>
          </div>
        </div>
      </Card>

      <!-- Existing Requests -->
      <Card
        v-for="request in myRequests"
        :key="request.id"
        @click="viewRequestDetails(request)"
        class="p-6 cursor-pointer hover:border-telegram-accent transition-colors duration-200"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1 pr-3">
            <h3 class="text-lg font-semibold text-telegram-text mb-1">
              {{ request.subject?.name || 'Предмет' }} •
              {{ request.teacher?.fullName || 'Преподаватель' }}
            </h3>
            <div class="flex items-center space-x-3">
              <span class="text-telegram-success font-semibold"
                >до {{ formatPrice(request.budget || 0) }}₽</span
              >
            </div>
          </div>
          <!-- TODO: Добавить редактирование заявки -->
          <!-- <button
            @click="editRequest(request, $event)"
            class="p-2 text-telegram-textSecondary hover:text-telegram-text hover:bg-telegram-secondary/50 rounded-lg transition-colors flex-shrink-0"
            title="Редактировать заявку"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button> -->
        </div>

        <!-- Description -->
        <p class="text-telegram-text text-sm mb-4">{{ request.description }}</p>

        <!-- Details -->
        <div class="flex items-center justify-between">
          <div>
            <p class="text-telegram-textSecondary text-xs mb-1">Создана</p>
            <p class="text-telegram-text text-sm">{{ formatDate(request.createdAt) }}</p>
          </div>
          <div class="text-right">
            <p class="text-telegram-textSecondary text-xs mb-1">Откликов</p>
            <div class="flex items-center justify-end space-x-2">
              <span class="text-telegram-text text-lg font-bold">{{
                (request as any)?._count?.responses ?? 0
              }}</span>
              <div
                v-if="(request as any)?.newResponsesCount > 0"
                class="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
              >
                {{ (request as any)?.newResponsesCount }}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
