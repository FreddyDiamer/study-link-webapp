<script setup lang="ts">
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import Input from '@/shared/components/ui/Input.vue'
import { ArrowIcon } from '@/shared/components/icons'
import { useEditProfile } from './hooks'

const { form, isLoading, handleSave, handleBack } = useEditProfile()
</script>

<template>
  <div class="min-h-screen bg-telegram-bg p-4 pt-6">
    <div class="flex items-center justify-between mb-6">
      <Button variant="ghost" @click="handleBack" class="!p-2">
        <ArrowIcon class="w-5 h-5 rotate-180" />
      </Button>
      <h1 class="text-lg font-semibold text-telegram-text">Редактировать профиль</h1>
      <div class="w-9"></div>
    </div>
    <Card class="p-6 mb-6">
      <form @submit.prevent="handleSave" class="space-y-6">
        <div class="flex items-center space-x-4 mb-6">
          <div class="w-16 h-16 shrink-0 bg-telegram-accent rounded-full flex items-center justify-center text-white text-xl font-bold">
            {{ form.firstName?.charAt(0) || 'С' }}
          </div>
          <div>
            <h3 class="text-lg font-medium text-telegram-text">Фото профиля</h3>
            <p class="text-sm text-telegram-textSecondary">Аватар генерируется автоматически на основе имени</p>
          </div>
        </div>
        <div class="space-y-4">
          <Input v-model="form.firstName" label="Имя" placeholder="Имя" />
          <Input v-model="form.lastName" label="Фамилия" placeholder="Фамилия" />
        </div>
        <Button type="submit" :loading="isLoading" class="w-full">Сохранить</Button>
      </form>
    </Card>
  </div>
</template>
