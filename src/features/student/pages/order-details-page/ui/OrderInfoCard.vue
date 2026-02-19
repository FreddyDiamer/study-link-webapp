<script setup lang="ts">
import Card from '@/shared/components/ui/Card.vue'
import type { Request } from '../models'

defineProps<{
  order: Request
  subjectName: string
  teacherName: string
  formatPrice: (price: number) => string
  formatDate: (dateString: string) => string
}>()
</script>

<template>
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
          <span class="text-sm font-medium text-telegram-text">{{ formatDate(order.deadline) }}</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-telegram-textSecondary">Создан:</span>
          <span class="text-sm font-medium text-telegram-text">{{ formatDate(order.createdAt) }}</span>
        </div>
      </div>
      <div v-if="order.description" class="pt-4 border-t border-telegram-border">
        <h3 class="text-sm font-medium text-telegram-text mb-2">Описание</h3>
        <p class="text-sm text-telegram-textSecondary">{{ order.description }}</p>
      </div>
    </div>
  </Card>
</template>
