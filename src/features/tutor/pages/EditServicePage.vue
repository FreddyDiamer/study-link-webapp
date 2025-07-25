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

const serviceId = route.params.id as string

const form = reactive({
  subject: '',
  teacher: '',
  description: '',
  price: '',
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

const deadlines = [
  { value: '1', label: '1 день' },
  { value: '3', label: '3 дня' },
  { value: '7', label: '1 неделя' },
  { value: 'custom', label: 'Другой срок' },
]

const isSubmitting = ref(false)
const isLoading = ref(true)
const showDeleteModal = ref(false)
const serviceStatus = ref<'active' | 'frozen' | 'deleted'>('active')

// Mock service data - в реальном приложении загружать из API
const mockServices = [
  {
    id: 1,
    subject: 'mathematics',
    teacher: 'teacher1',
    description:
      'Комплексная подготовка к ЕГЭ по математике профильного уровня. Разбор всех типов заданий, работа с ошибками, решение вариантов.',
    price: '2200',
    deadline: '7',
    customDate: '',
    status: 'active',
  },
  {
    id: 2,
    subject: 'mathematics',
    teacher: 'teacher2',
    description:
      'Помощь с изучением алгебры в 8-9 классах, подготовка к ОГЭ. Работа с уравнениями, неравенствами, функциями.',
    price: '1800',
    deadline: '3',
    customDate: '',
    status: 'frozen',
  },
]

const loadService = async () => {
  isLoading.value = true

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const service = mockServices.find((s) => s.id === parseInt(serviceId))

  if (service) {
    // Copy service data to form, excluding status
    form.subject = service.subject
    form.teacher = service.teacher
    form.description = service.description
    form.price = service.price
    form.deadline = service.deadline
    form.customDate = service.customDate
    serviceStatus.value = service.status as 'active' | 'frozen' | 'deleted'
  }

  isLoading.value = false
}

onMounted(() => {
  loadService()
})

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

const toggleStatus = async () => {
  const newStatus = serviceStatus.value === 'active' ? 'frozen' : 'active'
  serviceStatus.value = newStatus

  telegramStore.hapticFeedback('medium')

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  telegramStore.hapticFeedback('light')
}

const deleteService = async () => {
  showDeleteModal.value = false
  isSubmitting.value = true

  telegramStore.hapticFeedback('heavy')

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  router.push('/tutor/services')
  isSubmitting.value = false
}

const validateForm = () => {
  return form.subject && form.teacher && form.description && form.price
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
          <h1 class="text-lg font-semibold text-telegram-text">Настройка услуги</h1>
        </div>

        <!-- Status Only -->
        <div v-if="!isLoading">
          <span
            :class="[
              'px-2 py-1 text-xs font-medium rounded-full',
              serviceStatus === 'active'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700',
            ]"
          >
            {{ serviceStatus === 'active' ? 'Активна' : 'Заморожена' }}
          </span>
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
      <!-- Service Management -->
      <Card class="mx-4 mt-4 p-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium text-telegram-text">Управление услугой</h3>
            <p class="text-sm text-telegram-textSecondary mt-1">
              Измените статус или настройки услуги
            </p>
          </div>
          <Button
            variant="ghost"
            @click="toggleStatus"
            class="text-sm px-3 py-2"
            :class="
              serviceStatus === 'active'
                ? 'text-orange-600 hover:bg-orange-50'
                : 'text-green-600 hover:bg-green-50'
            "
          >
            {{ serviceStatus === 'active' ? 'Заморозить' : 'Активировать' }}
          </Button>
        </div>
      </Card>

      <!-- Form -->
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
          {{ 'Сохранить изменения' }}
        </Button>

        <!-- Delete Button -->
        <div class="text-center pt-4">
          <button
            @click="showDeleteModal = true"
            class="text-sm text-red-500 hover:text-red-700 underline transition-colors"
          >
            Удалить услугу
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Modal v-model="showDeleteModal" title="Удалить услугу">
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

        <h3 class="text-lg font-semibold text-telegram-text mb-2">Удалить услугу?</h3>
        <p class="text-telegram-textSecondary text-sm mb-6">
          Это действие нельзя отменить. Услуга будет удалена навсегда.
        </p>

        <div class="flex space-x-3">
          <Button variant="ghost" @click="showDeleteModal = false" class="flex-1"> Отмена </Button>
          <Button @click="deleteService" class="flex-1 bg-red-600 hover:bg-red-700 text-white">
            Удалить
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
