<script setup lang="ts">
import { useRouter } from 'vue-router'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import { OwnOrderIndicator } from '@/shared/components/ui'
import type { Request } from '@/shared/types'
import { getDealDescription, formatOrderDate, formatDeadlineInfo } from '../models'

function formatDate(dateString: string) {
  return formatOrderDate(dateString)
}

defineProps<{
  order: Request
  isOwnOrder: boolean
}>()

const router = useRouter()
function openStudentProfile(studentId: string) {
  router.push(`/user/${studentId}?view=student`)
}

const emit = defineEmits<{
  respond: [order: Request]
}>()
</script>

<template>
  <Card class="p-4">
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <h3 class="font-semibold text-telegram-text mb-1">{{ order.subject.name }}</h3>
        <div class="flex items-center space-x-2 text-sm text-telegram-textSecondary mb-2">
          <span>{{ order.teacher.fullName }}</span>
        </div>
      </div>
      <div class="text-right">
        <div class="font-bold text-telegram-accent">{{ order.budget ?? '—' }} ₽</div>
      </div>
    </div>
    <div
      class="flex items-center space-x-3 mb-3 cursor-pointer min-w-0"
      @click="openStudentProfile(order.student.id)"
    >
      <div
        class="w-10 h-10 bg-telegram-accent rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
      >
        {{ order.student.name.split(' ').map((n) => n[0]).join('') }}
      </div>
      <div class="flex-1 min-w-0">
        <div class="font-medium text-telegram-text">{{ order.student.name }}</div>
        <span class="text-xs text-telegram-accent">Профиль →</span>
      </div>
    </div>
    <p class="text-sm line-clamp-5 leading-relaxed mb-3">
      {{ getDealDescription(order) }}
    </p>
    <div class="flex items-center justify-between text-sm text-telegram-textSecondary mb-3">
      <span>Создан: {{ formatDate(order.createdAt) }}</span>
      <span v-if="order.deadline" :class="formatDeadlineInfo(order.deadline).className">
        Дедлайн: {{ formatDeadlineInfo(order.deadline).text }}
      </span>
    </div>
    <div class="pt-3">
      <div
        v-if="isOwnOrder"
        class="w-full px-4 py-2 bg-yellow-500/20 text-yellow-600 rounded-xl text-sm font-medium text-center flex items-center justify-center"
      >
        <OwnOrderIndicator
          text="Ваш заказ. Нельзя откликаться на свой заказ."
          size="md"
          color="text-yellow-600"
          tooltip-position="top"
          class="mr-2"
        />
        Ваш заказ
      </div>
      <div
        v-else-if="order.currentUserResponded"
        class="w-full px-4 py-2 bg-telegram-secondary text-telegram-textSecondary rounded-xl text-sm font-medium text-center cursor-not-allowed"
      >
        Вы откликнулись
      </div>
      <Button v-else @click.stop="emit('respond', order)" size="sm" class="w-full">
        Откликнуться
      </Button>
    </div>
  </Card>
</template>
