<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Card, Button } from '@/shared/components/ui'
import { ContactIcon } from '@/shared/components/icons'
import { formatDate } from '@/shared/utils'
import { useTelegramStore } from '@/stores/telegram'
import { ResponseStatus, type RequestResponse } from '@/shared/types'

const router = useRouter()
const telegramStore = useTelegramStore()

defineProps<{ response: RequestResponse }>()

const emit = defineEmits<{
  accept: [responseId: string]
  reject: [responseId: string]
  cancel: [responseId: string]
  contact: [telegramUsername: string]
}>()

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'pending':
      return { color: 'bg-telegram-accent', text: 'Ожидает', textColor: 'text-telegram-accent' }
    case 'accepted':
      return { color: 'bg-orange-500', text: 'Принят', textColor: 'text-orange-600' }
    case 'in_progress':
      return { color: 'bg-telegram-success', text: 'В работе', textColor: 'text-telegram-success' }
    case 'declined':
      return { color: 'bg-telegram-textSecondary', text: 'Отклонен', textColor: 'text-telegram-textSecondary' }
    default:
      return { color: 'bg-telegram-textSecondary', text: 'Неизвестно', textColor: 'text-telegram-textSecondary' }
  }
}

const acceptResponse = (response: RequestResponse) => {
  telegramStore.hapticFeedback('medium')
  emit('accept', response.id)
}

const declineResponse = (response: RequestResponse) => {
  telegramStore.hapticFeedback('light')
  emit('reject', response.id)
}

const contactTutor = (response: RequestResponse) => {
  telegramStore.hapticFeedback('light')
  emit('contact', response.tutor?.telegramUsername || '')
}

const cancelResponse = (response: RequestResponse) => {
  telegramStore.hapticFeedback('medium')
  emit('cancel', response.id)
}

const openTutorProfile = (tutorId: string) => {
  telegramStore.hapticFeedback('light')
  router.push(`/user/${tutorId}?view=tutor`)
}
</script>

<template>
  <Card
    :key="response.id"
    class="p-6"
    :class="{
      'border-telegram-accent bg-telegram-accent/5': true,
      'border-orange-500 bg-orange-500/10': response.status === ResponseStatus.ACCEPTED,
      'border-telegram-success bg-telegram-success/10': response.status === 'in_progress',
    }"
  >
    <div class="flex items-center justify-between mb-4">
      <div
        v-if="response.tutor?.id"
        class="flex items-center space-x-3 cursor-pointer min-w-0 flex-1"
        @click="openTutorProfile(response.tutor.id)"
      >
        <div class="w-12 h-12 shrink-0 bg-telegram-accent/20 rounded-full flex items-center justify-center">
          <span class="text-telegram-accent font-semibold">{{ response.tutor?.name?.[0] || 'Р' }}</span>
        </div>
        <div class="min-w-0">
          <h3 class="font-semibold text-telegram-text">{{ response.tutor?.name || 'Репетитор' }}</h3>
          <div class="flex items-center space-x-3 text-sm text-telegram-textSecondary">
            <span class="whitespace-nowrap">0 отзывов</span>
          </div>
          <span class="text-xs text-telegram-accent">Профиль →</span>
        </div>
      </div>
      <div v-else class="flex items-center space-x-3">
        <div class="w-12 h-12 shrink-0 bg-telegram-accent/20 rounded-full flex items-center justify-center">
          <span class="text-telegram-accent font-semibold">{{ response.tutor?.name?.[0] || 'Р' }}</span>
        </div>
        <div>
          <h3 class="font-semibold text-telegram-text">{{ response.tutor?.name || 'Репетитор' }}</h3>
          <div class="flex items-center space-x-3 text-sm text-telegram-textSecondary">
            <span class="whitespace-nowrap">0 отзывов</span>
          </div>
        </div>
      </div>
      <div class="flex flex-col items-end space-y-2">
        <span class="text-telegram-success font-semibold">{{ response.price }}₽</span>
        <span :class="['px-2 py-1 text-xs font-medium rounded-full', getStatusInfo(response.status).color, 'text-white']">
          {{ getStatusInfo(response.status).text }}
        </span>
      </div>
    </div>
    <div class="mb-4">
      <p class="text-telegram-text text-sm leading-relaxed">{{ response.message }}</p>
    </div>
    <div class="flex items-center justify-between mb-4">
      <span class="text-telegram-textSecondary text-xs">Отклик отправлен {{ formatDate(response.createdAt) }}</span>
    </div>
    <div class="flex space-x-3">
      <template v-if="response.status === ResponseStatus.PENDING">
        <Button @click="acceptResponse(response)" class="flex-1">Принять</Button>
        <Button @click="declineResponse(response)" variant="secondary" class="flex-1">Отклонить</Button>
      </template>
      <template v-else-if="response.status === ResponseStatus.ACCEPTED">
        <Button @click="contactTutor(response)" variant="secondary" class="flex-1">
          <ContactIcon class="w-4 h-4 mr-2" />
          Связаться
        </Button>
        <Button @click="cancelResponse(response)" variant="secondary" class="flex-1 text-telegram-destructive">
          Отказаться
        </Button>
      </template>
      <template v-else-if="response.status === ResponseStatus.REJECTED">
        <div class="flex-1 text-center py-2 text-telegram-textSecondary text-sm">Отклик отклонен</div>
      </template>
    </div>
  </Card>
</template>
