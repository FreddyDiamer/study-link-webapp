<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { Card, Button } from '@/shared/components/ui'
import type { Deal } from '@/shared/types'

const router = useRouter()
const telegramStore = useTelegramStore()

const props = defineProps<{
  items?: Deal[]
}>()

// Данные сделок, приходящие сверху
const myDeals = computed(() => props.items ?? [])

const getDealStatusInfo = (status: string) => {
  switch (status) {
    case 'PENDING':
      return { color: 'bg-orange-500', text: 'Ожидает подтверждения', textColor: 'text-orange-600' }
    case 'ACCEPTED':
      return { color: 'bg-blue-500', text: 'Принята', textColor: 'text-blue-600' }
    case 'IN_PROGRESS':
      return {
        color: 'bg-telegram-success',
        text: 'В процессе',
        textColor: 'text-telegram-success',
      }
    case 'COMPLETED':
      return {
        color: 'bg-telegram-textSecondary',
        text: 'Завершена',
        textColor: 'text-telegram-textSecondary',
      }
    case 'CANCELLED':
      return { color: 'bg-red-500', text: 'Отменена', textColor: 'text-red-600' }
    default:
      return {
        color: 'bg-telegram-textSecondary',
        text: 'Неизвестно',
        textColor: 'text-telegram-textSecondary',
      }
  }
}

const formatDeadline = (dateString: string | null) => {
  if (!dateString) return null

  const date = new Date(dateString)
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffMs < 0) return 'Просрочен'
  if (diffHours < 1) return 'Скоро'
  if (diffHours < 24) return `Через ${diffHours} ч.`
  if (diffDays === 1) return 'Завтра'
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

const formatPrice = (priceInRubles: number) => {
  return Math.round(priceInRubles)
}

const findTutors = () => {
  telegramStore.hapticFeedback('light')
  router.push('/student/services')
}

const viewDealDetails = (deal: any) => {
  telegramStore.hapticFeedback('light')
  // TODO: Открыть детали сделки или чат с репетитором
  console.log('Просмотр сделки:', deal.id)
}

const startLesson = (deal: any) => {
  telegramStore.hapticFeedback('light')
  // TODO: Начать урок (видеозвонок или чат)
  console.log('Начать урок с:', deal.tutorName)
}
</script>

<template>
  <div class="px-4">
    <!-- Empty State -->
    <div v-if="myDeals.length === 0" class="text-center py-16">
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
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-telegram-text mb-3">У вас пока нет активных уроков</h2>
      <p class="text-telegram-textSecondary mb-8 max-w-sm mx-auto">
        Найдите репетитора и начните обучение
      </p>
      <Button @click="findTutors" class="mx-auto">Найти репетитора</Button>
    </div>

    <!-- Deals List -->
    <div v-else class="space-y-4">
      <Card
        v-for="deal in myDeals"
        :key="deal.id"
        @click="viewDealDetails(deal)"
        class="p-6 cursor-pointer hover:border-telegram-accent transition-colors duration-200"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h3 class="text-telegram-text font-semibold text-lg mb-1">
              {{ deal.subject?.name || 'Предмет' }} •
              {{ deal.teacher?.fullName || 'Преподаватель' }}
            </h3>
            <div class="flex items-center space-x-2 mb-2">
              <span class="text-telegram-textSecondary text-sm">{{
                deal.tutor?.name || 'Репетитор'
              }}</span>
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <span class="text-telegram-textSecondary text-sm">{{
                  deal.tutor?.rating ?? '—'
                }}</span>
              </div>
            </div>
          </div>
          <div class="text-right">
            <div
              :class="[
                'px-2 py-1 text-xs font-medium rounded-full mb-2',
                getDealStatusInfo(deal.status).color,
                'text-white',
              ]"
            >
              {{ getDealStatusInfo(deal.status).text }}
            </div>
            <div class="text-telegram-success font-semibold text-sm">
              {{ formatPrice(deal.price) }}₽
            </div>
          </div>
        </div>

        <!-- Source Info -->
        <div class="mb-4">
          <div class="flex items-center space-x-2 text-sm">
            <span class="text-telegram-textSecondary">Источник:</span>
            <span class="text-telegram-text">
              {{ deal.serviceResponseId ? 'Отклик на услугу' : 'Отклик на заявку' }}
            </span>
          </div>
        </div>

        <!-- Deadline / Action -->
        <div class="flex items-center justify-between">
          <div>
            <p class="text-telegram-textSecondary text-xs mb-1">
              {{ deal.deadline ? 'Дедлайн' : 'Создана' }}
            </p>
            <p class="text-telegram-text text-sm">
              {{ deal.deadline ? formatDeadline(deal.deadline) : formatDate(deal.createdAt) }}
            </p>
          </div>

          <!-- Quick Action Button -->
          <div
            v-if="deal.status === 'IN_PROGRESS' || deal.status === 'ACCEPTED'"
            @click.stop="startLesson(deal)"
          >
            <Button
              size="sm"
              :class="[
                'text-xs px-3 py-1.5',
                deal.status === 'IN_PROGRESS'
                  ? 'bg-telegram-success hover:bg-telegram-success/90'
                  : 'bg-telegram-accent hover:bg-telegram-accent/90',
              ]"
            >
              {{ deal.status === 'IN_PROGRESS' ? 'Продолжить' : 'Начать' }}
            </Button>
          </div>
        </div>
      </Card>

      <!-- Find More Tutors Button -->
      <div class="pt-4">
        <Button @click="findTutors" variant="ghost" class="w-full">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Найти еще репетиторов
        </Button>
      </div>
    </div>
  </div>
</template>
