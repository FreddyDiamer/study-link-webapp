<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import Input from '@/shared/components/ui/Input.vue'
import Select from '@/shared/components/ui/Select.vue'

const router = useRouter()
const telegramStore = useTelegramStore()

const form = reactive({
  subject: '',
  customSubject: '',
  teacherName: '',
  budget: '',
  description: '',
  deadline: '',
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

const deadlines = [
  { value: 'day', label: 'День', description: 'Исполнение в течение дня' },
  { value: 'week', label: 'Неделя', description: 'Исполнение в течение недели' },
  {
    value: 'endOfSemester',
    label: 'До конца семестра',
    description: 'Исполнение до конца семестра',
  },
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
  return hasSubject && form.description && form.budget && form.deadline
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
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Button>
        <h1 class="text-xl font-semibold text-telegram-text">Создать заявку</h1>
      </div>
    </div>

    <div class="p-4 pb-6">
      <!-- Subject Selection -->
      <Card class="p-6 mb-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-4">Предмет</h2>

        <Select
          v-model="form.subject"
          :options="subjects"
          placeholder="Выберите предмет"
          required
          class="mb-4"
        />

        <div v-if="form.subject === 'other'">
          <Input v-model="form.customSubject" placeholder="Укажите предмет" class="w-full" />
        </div>
      </Card>

      <!-- Teacher (optional) -->
      <Card class="p-6 mb-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Преподаватель</h2>
        <p class="text-telegram-textSecondary text-sm mb-4">
          Укажите, если нужна подготовка к конкретному преподавателю
        </p>

        <Input
          v-model="form.teacherName"
          placeholder="Например: Иванов И.И., кафедра математики"
          class="w-full"
        />
      </Card>

      <!-- Budget -->
      <Card class="p-6 mb-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Бюджет за занятие</h2>
        <p class="text-telegram-textSecondary text-sm mb-4">Укажите комфортную для вас стоимость</p>

        <div class="flex items-center space-x-3">
          <Input v-model="form.budget" placeholder="1500" type="number" class="flex-1" />
          <span class="text-telegram-textSecondary font-medium">₽</span>
        </div>
      </Card>

      <!-- Schedule -->
      <Card class="p-6 mb-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">График занятий</h2>
        <p class="text-telegram-textSecondary text-sm mb-4">Когда вам удобно заниматься?</p>

        <Input
          v-model="form.schedule"
          placeholder="Например: вторник, четверг вечером"
          class="w-full"
        />
      </Card>

      <!-- Description -->
      <Card class="p-6 mb-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Описание задач</h2>
        <p class="text-telegram-textSecondary text-sm mb-4">
          Расскажите, что именно нужно изучить или подготовить
        </p>

        <textarea
          v-model="form.description"
          placeholder="Например: подготовка к экзамену по высшей математике, нужно разобрать интегралы и дифференциальные уравнения"
          class="w-full h-24 px-4 py-3 bg-telegram-secondary border border-telegram-border rounded-xl text-telegram-text placeholder-telegram-textSecondary resize-none focus:outline-none focus:border-telegram-accent transition-colors"
        />
      </Card>

      <!-- Urgency -->
      <Card class="p-6 mb-8">
        <h2 class="text-lg font-semibold text-telegram-text mb-4">Срочность</h2>

        <div class="space-y-3">
          <button
            v-for="deadline in deadlines"
            :key="deadline.value"
            @click="form.deadline = deadline.value"
            class="w-full p-4 rounded-xl border-2 transition-all duration-200"
            :class="{
              'border-telegram-accent bg-telegram-accent/10': form.deadline === deadline.value,
              'border-telegram-border bg-telegram-secondary hover:border-telegram-accent/50':
                form.deadline !== deadline.value,
            }"
          >
            <div class="flex items-center justify-between">
              <div class="text-left">
                <div class="font-medium text-telegram-text flex items-center space-x-2">
                  <span>{{ deadline.label }}</span>
                </div>
                <div class="text-telegram-textSecondary text-sm">{{ deadline.description }}</div>
              </div>
              <div
                v-if="form.deadline === deadline.value"
                class="w-5 h-5 bg-telegram-accent rounded-full flex items-center justify-center"
              >
                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </button>
        </div>
      </Card>

      <!-- Submit -->
      <Button
        @click="submitOrder"
        :disabled="!validateForm() || isSubmitting"
        class="w-full py-4 text-lg font-semibold"
      >
        <svg v-if="isSubmitting" class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {{ isSubmitting ? 'Создание заявки...' : 'Создать заявку' }}
      </Button>
    </div>
  </div>
</template>
