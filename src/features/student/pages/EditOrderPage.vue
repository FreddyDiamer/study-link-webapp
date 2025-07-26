<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import { Card, Button, Input, Select } from '@/shared/components/ui'
import { ArrowIcon } from '@/shared/components/icons'
import Modal from '@/shared/components/ui/Modal.vue'

const router = useRouter()
const route = useRoute()
const telegramStore = useTelegramStore()

const orderId = route.params.id as string

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
  { value: 'teacher1', label: 'Подготовка к ЕГЭ' },
  { value: 'teacher2', label: 'Олимпиадная подготовка' },
  { value: 'teacher3', label: 'Школьная программа' },
  { value: 'teacher4', label: 'Университетский курс' },
  { value: 'teacher5', label: 'Индивидуальная программа' },
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

const urgencyOptions = [
  { value: 'low', label: 'Низкая' },
  { value: 'normal', label: 'Средняя' },
  { value: 'high', label: 'Высокая' },
]

const isSubmitting = ref(false)
const isLoading = ref(true)
const showDeleteModal = ref(false)
const orderStatus = ref<'OPEN' | 'MATCHED' | 'CLOSED' | 'CANCELLED'>('OPEN')

// Mock orders data - в реальном приложении загружать из API
const mockOrders = [
  {
    id: '1',
    subject: 'mathematics',
    teacher: 'teacher1',
    description: 'Подготовка к ЕГЭ по математике, особенно задачи с параметрами',
    budget: '2000',
    deadline: 'custom',
    customDate: '2024-01-25',
    urgency: 'high',
    status: 'OPEN',
  },
  {
    id: '2',
    subject: 'physics',
    teacher: 'teacher2',
    description: 'Подготовка к олимпиаде, нужна помощь с механикой и термодинамикой',
    budget: '2500',
    deadline: 'week',
    customDate: '',
    urgency: 'high',
    status: 'OPEN',
  },
  {
    id: '3',
    subject: 'chemistry',
    teacher: 'teacher3',
    description: 'Школьная программа 10 класс, органическая химия',
    budget: '1800',
    deadline: 'endOfSemester',
    customDate: '',
    urgency: 'normal',
    status: 'CLOSED',
  },
]

const loadOrder = async () => {
  isLoading.value = true

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const order = mockOrders.find((o) => o.id === orderId)

  if (order) {
    form.subject = order.subject
    form.teacher = order.teacher
    form.description = order.description
    form.budget = order.budget
    form.deadline = order.deadline
    form.customDate = order.customDate
    form.urgency = order.urgency
    orderStatus.value = order.status as 'OPEN' | 'MATCHED' | 'CLOSED' | 'CANCELLED'
  }

  isLoading.value = false
}

onMounted(() => {
  loadOrder()
})

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

const toggleStatus = async () => {
  const newStatus = orderStatus.value === 'OPEN' ? 'CLOSED' : 'OPEN'
  orderStatus.value = newStatus

  telegramStore.hapticFeedback('medium')

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  telegramStore.hapticFeedback('light')
}

const deleteOrder = async () => {
  showDeleteModal.value = false
  isSubmitting.value = true

  telegramStore.hapticFeedback('heavy')

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  router.push('/student/orders')
  isSubmitting.value = false
}

const validateForm = () => {
  const hasSubject = form.subject && (form.subject !== 'other' || form.customSubject)
  const hasDeadline = form.deadline && (form.deadline !== 'custom' || form.customDate)
  return hasSubject && form.description && form.budget && hasDeadline
}

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'OPEN':
      return { color: 'bg-green-100 text-green-700', text: 'Открыта' }
    case 'MATCHED':
      return { color: 'bg-blue-100 text-blue-700', text: 'Найден репетитор' }
    case 'CLOSED':
      return { color: 'bg-gray-100 text-gray-700', text: 'Закрыта' }
    case 'CANCELLED':
      return { color: 'bg-red-100 text-red-700', text: 'Отменена' }
    default:
      return { color: 'bg-gray-100 text-gray-700', text: 'Неизвестно' }
  }
}

const goBack = () => {
  telegramStore.hapticFeedback('light')
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-telegram-bg">
    <!-- Header -->
    <div class="bg-telegram-card border-b border-telegram-border px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <Button variant="ghost" @click="goBack" class="p-1 -ml-1">
            <ArrowIcon direction="left" class="size-5" />
          </Button>
          <h1 class="text-lg font-semibold text-telegram-text">Редактировать заявку</h1>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div
        class="animate-spin w-8 h-8 border-4 border-telegram-accent border-t-transparent rounded-full"
      ></div>
    </div>

    <div v-else>
      <!-- Form -->
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

          <Input
            v-if="form.subject === 'other'"
            v-model="form.customSubject"
            placeholder="Укажите другой предмет"
          />
        </Card>

        <!-- Teacher -->
        <Card class="p-6">
          <h2 class="text-lg font-semibold text-telegram-text mb-2">Тип подготовки</h2>
          <p class="text-telegram-textSecondary text-sm mb-4">Укажите, к чему нужна подготовка</p>

          <Select
            v-model="form.teacher"
            :options="teachers"
            placeholder="Выберите тип подготовки"
            required
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

        <!-- Urgency -->
        <Card class="p-6">
          <h2 class="text-lg font-semibold text-telegram-text mb-2">Срочность</h2>
          <p class="text-telegram-textSecondary text-sm mb-4">Насколько срочно нужен репетитор</p>

          <Select
            v-model="form.urgency"
            :options="urgencyOptions"
            placeholder="Выберите уровень срочности"
            required
          />
        </Card>

        <!-- Budget -->
        <Card class="p-6">
          <h2 class="text-lg font-semibold text-telegram-text mb-2">Бюджет за занятие</h2>
          <p class="text-telegram-textSecondary text-sm mb-4">
            Укажите комфортную для вас стоимость
          </p>

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
          Сохранить изменения
        </Button>

        <!-- Delete Button -->
        <div class="text-center pt-4">
          <button
            @click="showDeleteModal = true"
            class="text-sm text-red-500 hover:text-red-700 underline transition-colors"
          >
            Удалить заявку
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Modal v-model="showDeleteModal" title="Удалить заявку">
      <div class="text-center py-4">
        <div
          class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>

        <h3 class="text-lg font-semibold text-telegram-text mb-2">Удалить заявку?</h3>
        <p class="text-telegram-textSecondary text-sm mb-6">
          Это действие нельзя отменить. Заявка будет удалена навсегда.
        </p>

        <div class="flex space-x-3">
          <Button variant="ghost" @click="showDeleteModal = false" class="flex-1"> Отмена </Button>
          <Button @click="deleteOrder" class="flex-1 bg-red-600 hover:bg-red-700 text-white">
            Удалить
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
