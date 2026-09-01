<script setup lang="ts">
// Vue
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

// Stores
import { useTelegramStore } from '@/stores/telegram'
import { useAuthStore } from '@/stores'

// Composables
import { useEducation } from '@/shared/composables'

// Services
import { orderService } from '@/services/business'

// Components
import { Card, Button, Input, Select } from '@/shared/components/ui'
import { ArrowIcon } from '@/shared/components/icons'

// Composables
const router = useRouter()
const telegramStore = useTelegramStore()
const authStore = useAuthStore()
const {
  activeSubjects,
  teachers,
  isLoading: educationLoading,
  error: educationError,
  isInitialized,
  initialize,
} = useEducation()

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

// Вычисляемые свойства для опций
const subjectOptions = computed(() => [
  ...activeSubjects.value.map((subject) => ({
    value: subject.id,
    label: subject.name,
  })),
  // TODO: Добавить опцию "Другое"
  // { value: 'other', label: 'Другое' },
])

const teacherOptions = computed(() => [
  // TODO: Добавить опцию "Любой преподаватель"
  // { value: 'any', label: 'Любой преподаватель' },
  ...teachers.value.map((teacher) => ({
    value: teacher.id,
    label: teacher.fullName,
  })),
])

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

  try {
    // Подготавливаем данные для API
    const requestData = {
      studentId: authStore.user?.id || '',
      subjectId: form.subject === 'other' ? '' : form.subject,
      teacherId: form.teacher || '',
      description: form.description,
      budget: form.budget ? parseInt(form.budget) : undefined,
      deadline: getDeadlineDate(),
    }

    // Создаем заявку через API
    await orderService.createRequest(requestData)

    telegramStore.hapticFeedback('heavy')
    router.push('/student/orders')
  } catch (error: any) {
    console.error('Ошибка создания заявки:', error)
    telegramStore.showAlert('Ошибка при создании заявки. Попробуйте снова.')
  } finally {
    isSubmitting.value = false
  }
}

const getDeadlineDate = (): string | undefined => {
  if (!form.deadline) return undefined

  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000

  switch (form.deadline) {
    case 'day':
      return new Date(now + dayMs).toISOString()
    case 'week':
      return new Date(now + 7 * dayMs).toISOString()
    case 'endOfSemester':
      // Примерно до конца семестра (через 3 месяца)
      return new Date(now + 90 * dayMs).toISOString()
    case 'custom':
      return form.customDate ? new Date(form.customDate).toISOString() : undefined
    default:
      return undefined
  }
}

const validateForm = () => {
  const hasSubject = form.subject && (form.subject !== 'other' || form.customSubject)
  const hasDeadline = form.deadline && (form.deadline !== 'custom' || form.customDate)
  const hasUser = !!authStore.user?.id

  if (!hasUser) {
    telegramStore.showAlert('Ошибка авторизации. Войдите в систему.')
    return false
  }

  return hasSubject && form.budget && hasDeadline
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
        <h1 class="text-xl font-semibold text-telegram-text">Создать заявку</h1>
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

    <!-- Основной контент -->
    <div v-else class="p-4 flex flex-col gap-6">
      <!-- Subject Selection -->
      <Card class="p-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-4">Предмет</h2>

        <Select
          v-model:value="form.subject"
          :options="subjectOptions"
          placeholder="Выберите предмет"
          required
          class="mb-4"
        />

        <Input
          v-if="form.subject === 'other'"
          v-model="form.customSubject"
          placeholder="Укажите предмет"
          class="mt-2"
        />
      </Card>

      <!-- Teacher (optional) -->
      <Card class="p-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Преподаватель</h2>
        <p class="text-telegram-text-secondary text-sm mb-4">
          Укажите, если нужна подготовка к конкретному преподавателю
        </p>

        <Select
          v-model:value="form.teacher"
          :options="teacherOptions"
          placeholder="Выберите преподавателя"
          class="mb-4"
        />
      </Card>

      <!-- Description -->
      <Card class="p-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Описание задач</h2>
        <p class="text-telegram-text-secondary text-sm mb-4">
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
        <p class="text-telegram-text-secondary text-sm mb-4">
          Укажите, когда нужно выполнить задание
        </p>

        <Select
          v-model:value="form.deadline"
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
        <p class="text-telegram-text-secondary text-sm mb-4">
          Укажите комфортную для вас стоимость
        </p>

        <div class="flex items-center space-x-3">
          <Input v-model="form.budget" placeholder="1500" type="number" class="flex-1" />
          <span class="text-telegram-text-secondary font-medium">₽</span>
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
