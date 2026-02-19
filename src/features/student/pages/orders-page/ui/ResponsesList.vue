<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { Card, Button } from '@/shared/components/ui'
import type { ServiceResponse } from '@/shared/types'

const router = useRouter()
const telegramStore = useTelegramStore()

const props = defineProps<{ items?: ServiceResponse[] }>()
const myResponses = computed(() => props.items ?? [])

const getResponseStatusInfo = (status: string) => {
  switch (status) {
    case 'PENDING': return { color: 'bg-orange-500', text: 'Ожидает ответа', textColor: 'text-orange-600' }
    case 'ACCEPTED': return { color: 'bg-telegram-success', text: 'Принят', textColor: 'text-telegram-success' }
    case 'REJECTED': return { color: 'bg-red-500', text: 'Отклонен', textColor: 'text-red-600' }
    case 'EXPIRED': return { color: 'bg-telegram-textSecondary', text: 'Истек', textColor: 'text-telegram-textSecondary' }
    default: return { color: 'bg-telegram-textSecondary', text: 'Неизвестно', textColor: 'text-telegram-textSecondary' }
  }
}

const formatRub = (priceInRubles: number) => Math.round(priceInRubles)

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
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
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

const findServices = () => {
  telegramStore.hapticFeedback('light')
  router.push('/student/services')
}

const viewResponseDetails = (_response: ServiceResponse) => {
  telegramStore.hapticFeedback('light')
}
</script>

<template>
  <div class="px-4">
    <div v-if="myResponses.length === 0" class="text-center py-16">
      <div class="w-20 h-20 bg-telegram-secondary rounded-full mx-auto mb-6 flex items-center justify-center">
        <svg class="w-10 h-10 text-telegram-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-telegram-text mb-3">У вас пока нет откликов</h2>
      <p class="text-telegram-textSecondary mb-8 max-w-sm mx-auto">Найдите интересные услуги и оставляйте заявки репетиторам</p>
      <Button @click="findServices" class="mx-auto">Найти услуги</Button>
    </div>
    <div v-else class="space-y-4">
      <Card
        v-for="response in myResponses"
        :key="response.id"
        @click="viewResponseDetails(response)"
        class="p-6 cursor-pointer hover:border-telegram-accent transition-colors duration-200"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h3 class="text-telegram-text font-semibold text-lg mb-1">
              {{ response.service?.subject?.name || 'Предмет' }} • {{ response.service?.teacher?.fullName || 'Преподаватель' }}
            </h3>
            <div class="flex items-center space-x-2 mb-2">
              <span class="text-telegram-textSecondary text-sm">{{ response.service?.tutor?.name || 'Репетитор' }}</span>
            </div>
          </div>
          <div class="text-right">
            <div :class="['px-2 py-1 text-xs font-medium rounded-full', getResponseStatusInfo(response.status).color, 'text-white mb-2']">
              {{ getResponseStatusInfo(response.status).text }}
            </div>
            <div class="text-telegram-textSecondary text-xs">{{ formatDate(response.createdAt) }}</div>
          </div>
        </div>
        <p class="text-telegram-text text-sm mb-4">{{ response.message }}</p>
        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center space-x-4">
            <div><span class="text-telegram-textSecondary">Моя цена: </span><span class="text-telegram-text">{{ formatRub(response.price || 0) }}₽</span></div>
            <div><span class="text-telegram-textSecondary">Цена услуги: </span><span class="text-telegram-text">{{ response.service?.price || 0 }}₽</span></div>
            <div v-if="response.proposedDeadline">
              <span class="text-telegram-textSecondary">Дедлайн: </span>
              <span class="text-telegram-text">{{ formatDeadline(response.proposedDeadline) }}</span>
            </div>
          </div>
        </div>
      </Card>
      <div class="pt-4">
        <Button @click="findServices" variant="ghost" class="w-full">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          Найти еще услуги
        </Button>
      </div>
    </div>
  </div>
</template>
