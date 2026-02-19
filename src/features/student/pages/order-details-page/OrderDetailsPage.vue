<script setup lang="ts">
import { Button } from '@/shared/components/ui'
import { ArrowIcon } from '@/shared/components/icons'
import { OrderResponseCard, OrderInfoCard } from './ui'
import { useOrderDetails } from './hooks'

const {
  order,
  responses,
  isLoading,
  error,
  subjectName,
  teacherName,
  loadOrderDetails,
  formatPrice,
  formatDate,
  handleBack,
  handleResponseAction,
} = useOrderDetails()
</script>

<template>
  <div class="min-h-screen bg-telegram-bg pt-6">
    <div class="px-4 mb-6">
      <div class="flex items-center">
        <Button variant="ghost" @click="handleBack" class="!p-2">
          <ArrowIcon class="w-5 h-5 rotate-90" />
        </Button>
        <h1 class="text-lg font-semibold text-telegram-text">Детали заказа</h1>
      </div>
    </div>
    <div v-if="isLoading" class="flex justify-center py-16">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-telegram-button"></div>
    </div>
    <div v-else-if="error" class="px-4">
      <div class="p-6 text-center">
        <div class="text-telegram-destructive mb-4">{{ error }}</div>
        <Button @click="loadOrderDetails">Попробовать снова</Button>
      </div>
    </div>
    <div v-else-if="order" class="px-4 space-y-6">
      <OrderInfoCard
        :order="order"
        :subject-name="subjectName"
        :teacher-name="teacherName"
        :format-price="formatPrice"
        :format-date="formatDate"
      />
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-telegram-text">Отклики ({{ responses.length }})</h3>
        <div v-if="responses.length === 0" class="text-center py-8">
          <div class="text-telegram-textSecondary mb-2">Пока нет откликов</div>
          <p class="text-sm text-telegram-textSecondary">Репетиторы увидят вашу заявку и смогут откликнуться</p>
        </div>
        <div v-else class="space-y-4">
          <OrderResponseCard
            v-for="response in responses"
            :key="response.id"
            :response="response"
            @accept="(id) => handleResponseAction(id, 'accept')"
            @reject="(id) => handleResponseAction(id, 'reject')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
