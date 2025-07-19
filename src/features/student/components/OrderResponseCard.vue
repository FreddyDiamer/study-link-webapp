<script setup lang="ts">
import { Card, Button } from '@/shared/components/ui'
import { ContactIcon } from '@/shared/components/icons'
import { formatDate } from '@/shared/utils'
import { useTelegramStore } from '@/stores/telegram'

const telegramStore = useTelegramStore()

const emit = defineEmits<{
  acceptService: [response: any]
}>()

defineProps<{
  response: any
}>()

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'pending':
      return {
        color: 'bg-telegram-accent',
        text: 'Ожидает',
        textColor: 'text-telegram-accent',
      }
    case 'accepted':
      return { color: 'bg-orange-500', text: 'Принят', textColor: 'text-orange-600' }
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

const acceptResponse = (response: any) => {
  telegramStore.hapticFeedback('medium')

  // Принимаем выбранный отклик
  response.status = 'accepted'

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
  emit('acceptService', response)
  // TODO: API call - начать работу с репетитором
}

const declineService = (response: any) => {
  telegramStore.hapticFeedback('heavy')
  response.status = 'declined'
  console.log('Отклонена услуга репетитора:', response.tutor.name)
  // TODO: API call - отклонить услугу после принятия отклика
}
</script>

<template>
  <Card
    :key="response.id"
    class="p-6"
    :class="{
      'border-telegram-accent bg-telegram-accent/5': !response.isRead,
      'border-orange-500 bg-orange-500/10': response.status === 'accepted',
      'border-telegram-success bg-telegram-success/10': response.status === 'in_progress',
    }"
  >
    <!-- Tutor Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div
          class="w-12 h-12 shrink-0 bg-telegram-accent/20 rounded-full flex items-center justify-center"
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
            <span class="whitespace-nowrap">{{ response.tutor.completedLessons }} услуг</span>
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

    <!-- Message -->
    <div class="mb-4">
      <p class="text-telegram-text text-sm leading-relaxed">{{ response.message }}</p>
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
        <div class="space-y-3 w-full">
          <Button @click="contactTutor(response)" variant="secondary" class="w-full">
            <ContactIcon class="w-4 h-4 mr-2" />
            Связаться
          </Button>
          <Button @click="acceptService(response)" class="w-full">
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
          <Button
            @click="declineService(response)"
            variant="ghost"
            class="w-full mt-3 text-sm text-telegram-textSecondary"
          >
            Не подошел
          </Button>
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
</template>
