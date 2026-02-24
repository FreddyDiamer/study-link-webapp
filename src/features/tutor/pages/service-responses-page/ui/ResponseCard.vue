<script setup lang="ts">
import { useRouter } from 'vue-router'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import type { ServiceResponseItem } from '../models'
import { getResponseStatusInfo, formatResponseDate, formatResponseDeadline } from '../models'

defineProps<{
  response: ServiceResponseItem
}>()

const router = useRouter()
function openProfile(studentId: string) {
  router.push(`/user/${studentId}?view=student`)
}

const emit = defineEmits<{
  accept: [response: ServiceResponseItem]
  reject: [response: ServiceResponseItem]
  contact: [response: ServiceResponseItem]
  complete: [response: ServiceResponseItem]
}>()

function statusInfo(status: string) {
  return getResponseStatusInfo(status)
}

function formatDate(dateString: string) {
  return formatResponseDate(dateString)
}

function formatDeadline(dateString: string | null) {
  return formatResponseDeadline(dateString)
}
</script>

<template>
  <Card class="p-6">
    <div class="flex items-start justify-between mb-4">
      <div
        class="flex items-center space-x-3 cursor-pointer min-w-0 flex-1"
        @click="openProfile(response.studentId)"
      >
        <div
          class="w-12 h-12 bg-telegram-accent/20 rounded-full flex items-center justify-center flex-shrink-0"
        >
          <span class="text-telegram-accent font-semibold">
            {{ response.student.name.split(' ').map((n) => n[0]).join('') }}
          </span>
        </div>
        <div class="min-w-0">
          <h3 class="font-semibold text-telegram-text">{{ response.student.name }}</h3>
          <div class="flex items-center space-x-2 text-sm text-telegram-textSecondary">
            <svg class="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
            <span>{{ response.student.rating }}</span>
          </div>
          <span class="text-xs text-telegram-accent">Профиль →</span>
        </div>
      </div>
      <div class="flex flex-col items-end space-y-2">
        <span class="text-xs text-telegram-textSecondary">{{ formatDate(response.createdAt) }}</span>
        <div
          :class="[
            'px-2 py-1 text-xs font-medium rounded-full text-white',
            statusInfo(response.status).color,
          ]"
        >
          {{ statusInfo(response.status).text }}
        </div>
      </div>
    </div>

    <div class="mb-4">
      <p class="text-telegram-text text-sm">{{ response.message }}</p>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-4 p-3 bg-telegram-secondary/50 rounded-lg">
      <div>
        <span class="text-xs text-telegram-textSecondary">Предложенная цена:</span>
        <div class="text-sm font-medium text-telegram-success">{{ response.price }}₽</div>
      </div>
      <div>
        <span class="text-xs text-telegram-textSecondary">Цена услуги:</span>
        <div class="text-sm font-medium text-telegram-text">{{ response.service.price }}₽</div>
      </div>
    </div>

    <div v-if="response.proposedDeadline" class="mb-4 p-3 bg-telegram-secondary/30 rounded-lg">
      <div class="flex items-center justify-between">
        <span class="text-sm text-telegram-textSecondary">Предложенный дедлайн:</span>
        <span class="text-sm font-medium text-telegram-text">
          {{ formatDeadline(response.proposedDeadline) }}
        </span>
      </div>
    </div>

    <div class="flex space-x-3">
      <template v-if="response.status === 'PENDING'">
        <Button @click="emit('accept', response)" class="flex-1">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Принять
        </Button>
        <Button @click="emit('reject', response)" variant="secondary" class="flex-1">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Отклонить
        </Button>
      </template>
      <template v-else-if="response.status === 'ACCEPTED'">
        <Button @click="emit('contact', response)" variant="secondary" class="flex-1">
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
        <Button @click="emit('complete', response)" class="flex-1">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Завершить
        </Button>
      </template>
      <template v-else-if="response.status === 'EXPIRED'">
        <Button @click="emit('contact', response)" variant="secondary" class="flex-1">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          Написать
        </Button>
      </template>
    </div>
  </Card>
</template>
