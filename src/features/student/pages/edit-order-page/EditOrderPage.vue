<script setup lang="ts">
import { Card, Button, Input, Select, Modal } from '@/shared/components/ui'
import { ArrowIcon } from '@/shared/components/icons'
import { useEditOrder } from './hooks'

const {
  form,
  subjects,
  teachers,
  deadlines,
  urgencyOptions,
  isLoading,
  isSubmitting,
  showDeleteModal,
  validateForm,
  submitOrder,
  deleteOrder,
  goBack,
} = useEditOrder()
</script>

<template>
  <div class="min-h-screen bg-telegram-bg">
    <div class="bg-telegram-card border-b border-telegram-border px-4 py-3">
      <div class="flex items-center space-x-2">
        <Button variant="ghost" @click="goBack" class="p-1 -ml-1">
          <ArrowIcon direction="left" class="size-5" />
        </Button>
        <h1 class="text-lg font-semibold text-telegram-text">Редактировать заявку</h1>
      </div>
    </div>
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="animate-spin w-8 h-8 border-4 border-telegram-accent border-t-transparent rounded-full"></div>
    </div>
    <div v-else class="p-4 flex flex-col gap-6">
      <Card class="p-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-4">Предмет</h2>
        <Select :value="form.subject" @update:value="(v) => (form.subject = v ?? '')" :options="subjects" placeholder="Выберите предмет" required class="mb-4" />
        <Input v-if="form.subject === 'other'" v-model="form.customSubject" placeholder="Укажите другой предмет" />
      </Card>
      <Card class="p-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Тип подготовки</h2>
        <Select :value="form.teacher" @update:value="(v) => (form.teacher = v ?? '')" :options="teachers" placeholder="Выберите тип" required />
      </Card>
      <Card class="p-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Описание</h2>
        <textarea v-model="form.description" placeholder="Описание задач..." class="w-full h-40 input" />
      </Card>
      <Card class="p-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Срок</h2>
        <Select :value="form.deadline" @update:value="(v) => (form.deadline = v ?? '')" :options="deadlines" placeholder="Выберите срок" required class="mb-4" />
        <Input v-if="form.deadline === 'custom'" v-model="form.customDate" type="date" />
      </Card>
      <Card class="p-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Срочность</h2>
        <Select :value="form.urgency" @update:value="(v) => (form.urgency = v ?? '')" :options="urgencyOptions" placeholder="Срочность" required />
      </Card>
      <Card class="p-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Бюджет</h2>
        <div class="flex items-center space-x-3">
          <Input v-model="form.budget" placeholder="1500" type="number" class="flex-1" />
          <span class="text-telegram-textSecondary font-medium">₽</span>
        </div>
      </Card>
      <Button @click="submitOrder" :disabled="!validateForm()" :loading="isSubmitting" size="lg" class="w-full">Сохранить изменения</Button>
      <div class="text-center pt-4">
        <button @click="showDeleteModal = true" class="text-sm text-red-500 hover:text-red-700 underline">Удалить заявку</button>
      </div>
    </div>
    <Modal v-model="showDeleteModal" title="Удалить заявку">
      <div class="text-center py-4">
        <h3 class="text-lg font-semibold text-telegram-text mb-2">Удалить заявку?</h3>
        <p class="text-telegram-textSecondary text-sm mb-6">Это действие нельзя отменить.</p>
        <div class="flex space-x-3">
          <Button variant="ghost" @click="showDeleteModal = false" class="flex-1">Отмена</Button>
          <Button @click="deleteOrder" class="flex-1 bg-red-600 hover:bg-red-700 text-white">Удалить</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
