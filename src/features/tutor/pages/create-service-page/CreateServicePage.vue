<script setup lang="ts">
import { Card, Button, Input, Select } from '@/shared/components/ui'
import { ArrowIcon } from '@/shared/components/icons'
import { useCreateService } from './hooks'

const {
  form,
  subjectOptions,
  teacherOptions,
  lessonDurationOptions,
  educationLoading,
  educationError,
  initialize,
  goBack,
  submitService,
  validateForm,
  isSubmitting,
} = useCreateService()
</script>

<template>
  <div class="min-h-screen bg-telegram-bg">
    <div class="bg-telegram-card border-b border-telegram-border px-4 py-4">
      <div class="flex items-center space-x-3">
        <Button variant="ghost" @click="goBack" class="p-2 -ml-2">
          <ArrowIcon direction="left" class="size-6" />
        </Button>
        <h1 class="text-xl font-semibold text-telegram-text">Создать услугу</h1>
      </div>
    </div>

    <div v-if="educationLoading" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"
        ></div>
        <p class="text-gray-600">Загрузка данных...</p>
      </div>
    </div>

    <div v-else-if="educationError" class="text-center py-12">
      <div class="text-red-600 mb-4">{{ educationError }}</div>
      <button
        @click="initialize"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Попробовать снова
      </button>
    </div>

    <div v-else class="p-4 flex flex-col gap-6">
      <Card class="p-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-4">Предмет преподавания</h2>
        <Select
          v-model="form.subject"
          :options="subjectOptions"
          placeholder="Выберите предмет"
          required
        />
      </Card>

      <Card class="p-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Преподаватель</h2>
        <p class="text-telegram-textSecondary text-sm mb-4">
          Выберите преподавателя, по программе которого ведете занятия
        </p>
        <Select
          v-model="form.teacher"
          :options="teacherOptions"
          placeholder="Выберите преподавателя"
          required
        />
      </Card>

      <Card class="p-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Подробное описание</h2>
        <p class="text-telegram-textSecondary text-sm mb-4">
          Расскажите о своих методах, подходе к обучению, успехах учеников
        </p>
        <textarea
          v-model="form.description"
          placeholder="Например: Индивидуальный подход к каждому ученику. Использую современные методики преподавания. "
          class="w-full h-40 input"
        />
      </Card>

      <Card class="p-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Количество занятий</h2>
        <p class="text-telegram-textSecondary text-sm mb-4">
          Сколько занятий нужно для подготовки студента
        </p>
        <Input
          v-model="form.lessonsCount"
          type="number"
          placeholder="10"
          min="1"
          max="200"
          class="mb-4"
        />
      </Card>

      <Card class="p-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Длительность занятия</h2>
        <p class="text-telegram-textSecondary text-sm mb-4">
          Укажите длительность одного занятия
        </p>
        <Select
          v-model="form.lessonDurationMinutes"
          :options="lessonDurationOptions"
          placeholder="Выберите длительность"
          required
        />
      </Card>

      <Card class="p-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Стоимость за занятие</h2>
        <p class="text-telegram-textSecondary text-sm mb-4">Укажите стоимость одного занятия</p>
        <div class="flex items-center space-x-3">
          <Input v-model="form.price" placeholder="1500" type="number" class="flex-1" />
          <span class="text-telegram-textSecondary font-medium">₽</span>
        </div>
      </Card>

      <Button
        @click="submitService"
        :disabled="!validateForm()"
        :loading="isSubmitting"
        size="lg"
        class="w-full"
      >
        Создать услугу
      </Button>
    </div>
  </div>
</template>
