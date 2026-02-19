<script setup lang="ts">
import Card from '@/shared/components/ui/Card.vue'
import Input from '@/shared/components/ui/Input.vue'
import type { EditProfileForm } from '../models'
import type { User } from '@/shared/types'

defineProps<{
  form: EditProfileForm
  user: User | null
  isLoading: boolean
}>()

defineEmits<{
  submit: []
}>()
</script>

<template>
  <Card class="p-6 mb-6">
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-telegram-button"></div>
    </div>
    <form v-else @submit.prevent="$emit('submit')" class="space-y-6">
      <div class="flex items-center space-x-4 mb-6">
        <div
          class="w-16 h-16 bg-telegram-success rounded-full flex items-center justify-center text-white text-xl font-bold"
        >
          {{ form.name?.charAt(0) || user?.name?.charAt(0) || 'Р' }}
        </div>
        <div>
          <h3 class="text-lg font-medium text-telegram-text">Фото профиля</h3>
          <p class="text-sm text-telegram-textSecondary">
            Аватар генерируется автоматически на основе имени
          </p>
        </div>
      </div>
      <div class="space-y-4">
        <Input v-model="form.name" label="Имя" placeholder="Введите ваше имя" required />
        <div class="space-y-2">
          <label class="block text-sm font-medium text-telegram-text">Описание</label>
          <textarea
            v-model="form.description"
            rows="4"
            placeholder="Расскажите о себе, своем опыте преподавания, достижениях..."
            class="w-full px-4 py-3 bg-telegram-secondary border border-telegram-border rounded-xl text-telegram-text placeholder-telegram-textSecondary focus:outline-none focus:border-telegram-accent transition-colors resize-none"
          />
          <p class="text-xs text-telegram-textSecondary">
            Это описание поможет студентам лучше узнать вас
          </p>
        </div>
      </div>
    </form>
  </Card>
</template>
