<script setup lang="ts">
import { Card, Button, Input, Select } from '@/shared/components/ui'
import { ArrowIcon } from '@/shared/components/icons'
import { useCreateOrder } from './hooks'

const {
  form,
  subjectOptions,
  teacherOptions,
  deadlines,
  educationLoading,
  educationError,
  initialize,
  isSubmitting,
  submitOrder,
  validateForm,
  goBack,
} = useCreateOrder()
</script>

<template>
  <div class="min-h-screen bg-telegram-bg">
    <div class="bg-telegram-card border-b border-telegram-border px-4 py-4">
      <div class="flex items-center space-x-3">
        <Button variant="ghost" @click="goBack" class="p-2 -ml-2">
          <ArrowIcon direction="left" class="size-6" />
        </Button>
        <h1 class="text-xl font-semibold text-telegram-text">Создать заявку</h1>
      </div>
    </div>
    <div v-if="educationLoading" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Загрузка данных...</p>
      </div>
    </div>
    <div v-else-if="educationError" class="text-center py-12">
      <div class="text-red-600 mb-4">{{ educationError }}</div>
      <button @click="initialize" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Попробовать снова</button>
    </div>
    <div v-else class="p-4 flex flex-col gap-6">
      <Card class="p-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-4">Предмет</h2>
        <Select v-model:value="form.subject" :options="subjectOptions" placeholder="Выберите предмет" required class="mb-4" />
        <Input v-if="form.subject === 'other'" v-model="form.customSubject" placeholder="Укажите предмет" class="mt-2" />
      </Card>
      <Card class="p-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Преподаватель</h2>
        <p class="text-telegram-textSecondary text-sm mb-4">Укажите, если нужна подготовка к конкретному преподавателю</p>
        <Select v-model:value="form.teacher" :options="teacherOptions" placeholder="Выберите преподавателя" class="mb-4" />
      </Card>
      <Card class="p-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Описание задач</h2>
        <p class="text-telegram-textSecondary text-sm mb-4">Расскажите, что именно нужно изучить или подготовить</p>
        <textarea v-model="form.description" placeholder="Например: подготовка к экзамену..." class="w-full h-40 input" />
      </Card>
      <Card class="p-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Срок выполнения</h2>
        <p class="text-telegram-textSecondary text-sm mb-4">Укажите, когда нужно выполнить задание</p>
        <Select v-model:value="form.deadline" :options="deadlines" placeholder="Выберите срок" required class="mb-4" />
        <Input v-if="form.deadline === 'custom'" v-model="form.customDate" type="date" />
      </Card>
      <Card class="p-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Бюджет за занятие</h2>
        <p class="text-telegram-textSecondary text-sm mb-4">Укажите комфортную для вас стоимость</p>
        <div class="flex items-center space-x-3">
          <Input v-model="form.budget" placeholder="1500" type="number" class="flex-1" />
          <span class="text-telegram-textSecondary font-medium">₽</span>
        </div>
      </Card>
      <Button @click="submitOrder" :disabled="!validateForm()" :loading="isSubmitting" size="lg" class="w-full">Создать заявку</Button>
    </div>
  </div>
</template>
