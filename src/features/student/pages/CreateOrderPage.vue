<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { Card, Button, Input, Select } from '@/shared/components/ui'
import { ArrowIcon } from '@/shared/components/icons'

const router = useRouter()
const telegramStore = useTelegramStore()

const form = reactive({
  subject: '',
  customSubject: '',
  teacher: '',
  budget: '',
  description: '',
  deadline: '',
  customDate: '',
  urgency: 'normal',
  schedule: '',
})

const subjects = [
  { value: 'mathematics', label: 'Математика' },
  { value: 'physics', label: 'Физика' },
  { value: 'chemistry', label: 'Химия' },
  { value: 'biology', label: 'Биология' },
  { value: 'history', label: 'История' },
  { value: 'literature', label: 'Литература' },
  { value: 'russian', label: 'Русский язык' },
  { value: 'english', label: 'Английский язык' },
  { value: 'informatics', label: 'Информатика' },
  { value: 'geography', label: 'География' },
  { value: 'social', label: 'Обществознание' },
  { value: 'other', label: 'Другое' },
]

const teachers = [
  { value: 'teacher1', label: 'Преподаватель 1' },
  { value: 'teacher2', label: 'Преподаватель 2' },
  { value: 'teacher3', label: 'Преподаватель 3' },
]

const deadlines = [
  { value: 'day', label: 'День', description: 'Исполнение в течение дня' },
  { value: 'week', label: 'Неделя', description: 'Исполнение в течение недели' },
  {
    value: 'endOfSemester',
    label: 'До конца семестра',
    description: 'Исполнение до конца семестра',
  },
  { value: 'custom', label: 'Выбрать день', description: 'Указать конкретную дату' },
]

const isSubmitting = ref(false)

const submitOrder = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  telegramStore.hapticFeedback('medium')

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500))

  telegramStore.hapticFeedback('heavy')
  router.push('/student/orders')
  isSubmitting.value = false
}

const validateForm = () => {
  const hasSubject = form.subject && (form.subject !== 'other' || form.customSubject)
  const hasDeadline = form.deadline && (form.deadline !== 'custom' || form.customDate)
  return hasSubject && form.description && form.budget && hasDeadline
}

const goBack = () => {
  telegramStore.hapticFeedback('light')
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-telegram-bg">
    <!-- Header -->
    <div class="bg-telegram-card border-b border-telegram-border px-4 py-4">
      <div class="flex items-center space-x-3">
        <Button variant="ghost" @click="goBack" class="p-2 -ml-2">
          <ArrowIcon direction="left" class="size-6" />
        </Button>
        <h1 class="text-xl font-semibold text-telegram-text">Создать заявку</h1>
      </div>
    </div>

    <div class="p-4 flex flex-col gap-6">
      <!-- Subject Selection -->
      <Card class="p-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-4">Предмет</h2>

        <Select
          v-model="form.subject"
          :options="subjects"
          placeholder="Выберите предмет"
          required
          class="mb-4"
        />
      </Card>

      <!-- Teacher (optional) -->
      <Card class="p-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Преподаватель</h2>
        <p class="text-telegram-textSecondary text-sm mb-4">
          Укажите, если нужна подготовка к конкретному преподавателю
        </p>

        <Select
          v-model="form.teacher"
          :options="teachers"
          placeholder="Выберите преподавателя"
          required
          class="mb-4"
        />
      </Card>

      <!-- Description -->
      <Card class="p-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Описание задач</h2>
        <p class="text-telegram-textSecondary text-sm mb-4">
          Расскажите, что именно нужно изучить или подготовить
        </p>

        <textarea
          v-model="form.description"
          placeholder="Например: подготовка к экзамену по высшей математике, нужно разобрать интегралы и дифференциальные уравнения"
          class="w-full h-40 input"
        />
      </Card>

      <!-- Deadline Selection -->
      <Card class="p-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Срок выполнения</h2>
        <p class="text-telegram-textSecondary text-sm mb-4">
          Укажите, когда нужно выполнить задание
        </p>

        <Select
          v-model="form.deadline"
          :options="deadlines"
          placeholder="Выберите срок"
          required
          class="mb-4"
        />

        <Input v-if="form.deadline === 'custom'" v-model="form.customDate" type="date" />
      </Card>

      <!-- Budget -->
      <Card class="p-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Бюджет за занятие</h2>
        <p class="text-telegram-textSecondary text-sm mb-4">Укажите комфортную для вас стоимость</p>

        <div class="flex items-center space-x-3">
          <Input v-model="form.budget" placeholder="1500" type="number" class="flex-1" />
          <span class="text-telegram-textSecondary font-medium">₽</span>
        </div>
      </Card>

      <!-- Submit -->
      <Button
        @click="submitOrder"
        :disabled="!validateForm()"
        :loading="isSubmitting"
        size="lg"
        class="w-full"
      >
        {{ 'Создать заявку' }}
      </Button>
    </div>
  </div>
</template>
