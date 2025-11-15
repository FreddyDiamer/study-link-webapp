<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { useEducation } from '@/shared/composables'
import { useService } from '@/shared/composables'
import { Card, Button, Input, Select, type SelectOption } from '@/shared/components/ui'
import { ArrowIcon } from '@/shared/components/icons'
import type { CreateServiceDto } from '@/shared/types'

const router = useRouter()
const telegramStore = useTelegramStore()
const { createService } = useService()
const {
  activeSubjects,
  teachers,
  isLoading: educationLoading,
  error: educationError,
  isInitialized,
  initialize,
} = useEducation()

const form = reactive({
  subject: null as SelectOption | null,
  teacher: null as SelectOption | null,
  description: '',
  price: '',
  deadline: null as SelectOption | null,
  customDate: '',
})

// Вычисляемые свойства для опций
const subjectOptions = computed(() =>
  activeSubjects.value.map((subject) => ({
    value: subject.id,
    label: subject.name,
  })),
)

const teacherOptions = computed(() =>
  teachers.value.map((teacher) => ({
    value: teacher.id,
    label: teacher.fullName,
  })),
)

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

  if (!form.subject) {
    telegramStore.showAlert('Укажите предмет')

    return
  }

  if (!form.teacher) {
    telegramStore.showAlert('Укажите преподавателя')

    return
  }

  try {
    const serviceData: CreateServiceDto = {
      subjectId: form.subject.value,
      teacherId: form.teacher.value,
      description: form.description,
      price: parseInt(form.price), // Конвертируем в копейки
      deadline: getDeadlineDate(),
    }

    await createService(serviceData)

    telegramStore.hapticFeedback('heavy')
    router.push('/tutor/services')
  } catch (error: any) {
    console.error('Ошибка создания услуги:', error)
    telegramStore.showAlert('Ошибка при создании услуги. Попробуйте снова.')
  } finally {
    isSubmitting.value = false
  }
}

const getDeadlineDate = (): string | undefined => {
  if (!form.deadline) return undefined

  const now = new Date()

  switch (form.deadline.value) {
    case '1':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
    case '3':
      return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString()
    case '7':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
    case 'custom':
      return form.customDate ? new Date(form.customDate).toISOString() : undefined
    default:
      return undefined
  }
}

const validateForm = () => {
  const hasSubject = form.subject
  const hasTeacher = form.teacher
  const hasDescription = form.description.trim()
  const hasPrice = form.price && parseInt(form.price) > 0
  const hasDeadline = form.deadline && (form.deadline.value !== 'custom' || form.customDate)

  return hasSubject && hasTeacher && hasDescription && hasPrice && hasDeadline
}

const goBack = () => {
  telegramStore.hapticFeedback('light')
  router.back()
}

// Инициализация образовательных данных
onMounted(async () => {
  if (!isInitialized.value) {
    await initialize()
  }
})
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

    <!-- Загрузка образовательных данных -->
    <div v-if="educationLoading" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"
        ></div>
        <p class="text-gray-600">Загрузка данных...</p>
      </div>
    </div>

    <!-- Ошибка образовательных данных -->
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
      <!-- Subject Selection -->
      <Card class="p-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-4">Предмет преподавания</h2>

        <Select
          v-model="form.subject"
          :options="subjectOptions"
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
          :options="teacherOptions"
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

        <Input v-if="form.deadline?.value === 'custom'" v-model="form.customDate" type="date" />
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
