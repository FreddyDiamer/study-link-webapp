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
  teacher: '',
  description: '',
  experience: '',
  price: '',
  format: '',
  duration: '',
  schedule: '',
  education: '',
  achievements: '',
  deadline: '',
  customDate: '',
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
  { value: 'teacher1', label: 'Иван Иванович Петров' },
  { value: 'teacher2', label: 'Мария Александровна Смирнова' },
  { value: 'teacher3', label: 'Сергей Владимирович Козлов' },
  { value: 'teacher4', label: 'Елена Михайловна Васильева' },
  { value: 'teacher5', label: 'Андрей Николаевич Орлов' },
]

const formats = [
  { value: 'online', label: 'Только онлайн' },
  { value: 'offline', label: 'Только очно' },
  { value: 'both', label: 'Онлайн и очно' },
]

const durations = [
  { value: '45', label: '45 минут' },
  { value: '60', label: '1 час' },
  { value: '90', label: '1.5 часа' },
  { value: '120', label: '2 часа' },
]

const experienceOptions = [
  { value: '1', label: 'До 1 года' },
  { value: '2', label: '1-3 года' },
  { value: '5', label: '3-5 лет' },
  { value: '10', label: '5-10 лет' },
  { value: '10+', label: 'Более 10 лет' },
]

const deadlines = [
  { value: '1', label: '1 день' },
  { value: '3', label: '3 дня' },
  { value: '7', label: '1 неделя' },
  { value: 'custom', label: 'Другой срок' },
]

const isSubmitting = ref(false)

const submitService = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  telegramStore.hapticFeedback('medium')

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500))

  telegramStore.hapticFeedback('heavy')
  router.push('/tutor/services')
  isSubmitting.value = false
}

const validateForm = () => {
  return (
    form.subject &&
    form.teacher &&
    form.description &&
    form.price &&
    form.experience &&
    form.duration
  )
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
        <h1 class="text-xl font-semibold text-telegram-text">Создать услугу</h1>
      </div>
    </div>

    <div class="p-4 flex flex-col gap-6">
      <!-- Subject Selection -->
      <Card class="p-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-4">Предмет преподавания</h2>

        <Select
          v-model="form.subject"
          :options="subjects"
          placeholder="Выберите предмет"
          required
        />
      </Card>

      <!-- Teacher Selection -->
      <Card class="p-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Преподаватель</h2>
        <p class="text-telegram-textSecondary text-sm mb-4">
          Выберите преподавателя, по программе которого ведете занятия
        </p>

        <Select
          v-model="form.teacher"
          :options="teachers"
          placeholder="Выберите преподавателя"
          required
        />
      </Card>

      <!-- Description -->
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

      <!-- Price -->
      <Card class="p-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Стоимость за занятие</h2>
        <p class="text-telegram-textSecondary text-sm mb-4">Укажите стоимость одного занятия</p>

        <div class="flex items-center space-x-3">
          <Input v-model="form.price" placeholder="1500" type="number" class="flex-1" />
          <span class="text-telegram-textSecondary font-medium">₽</span>
        </div>
      </Card>

      <!-- Submit -->
      <Button
        @click="submitService"
        :disabled="!validateForm()"
        :loading="isSubmitting"
        size="lg"
        class="w-full"
      >
        {{ 'Создать услугу' }}
      </Button>
    </div>
  </div>
</template>
