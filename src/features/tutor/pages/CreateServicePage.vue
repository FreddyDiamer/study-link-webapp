<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramStore } from '@/stores/telegram'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import Input from '@/shared/components/ui/Input.vue'

const router = useRouter()
const telegramStore = useTelegramStore()

const form = reactive({
  subject: '',
  title: '',
  description: '',
  experience: '',
  price: '',
  format: '',
  schedule: '',
  education: '',
  achievements: '',
})

const subjects = [
  'Математика',
  'Физика',
  'Химия',
  'Биология',
  'История',
  'Литература',
  'Русский язык',
  'Английский язык',
  'Информатика',
  'География',
  'Обществознание',
  'Другое',
]

const formats = [
  { value: 'online', label: 'Только онлайн', icon: '💻' },
  { value: 'offline', label: 'Только очно', icon: '🏫' },
  { value: 'both', label: 'Онлайн и очно', icon: '🔄' },
]

const experienceOptions = [
  { value: '1', label: 'До 1 года' },
  { value: '2', label: '1-3 года' },
  { value: '5', label: '3-5 лет' },
  { value: '10', label: '5-10 лет' },
  { value: '10+', label: 'Более 10 лет' },
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
  return form.subject && form.title && form.description && form.price && form.experience
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
        <h1 class="text-xl font-semibold text-telegram-text">Создать услугу</h1>
      </div>
    </div>

    <div class="p-4 pb-6">
      <!-- Subject Selection -->
      <Card class="p-6 mb-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-4">Предмет преподавания</h2>

        <div class="grid grid-cols-2 gap-3 mb-4">
          <button
            v-for="subject in subjects"
            :key="subject"
            @click="form.subject = subject"
            class="p-3 rounded-xl border-2 transition-all duration-200 text-left"
            :class="{
              'border-telegram-success bg-telegram-success/10 text-telegram-success':
                form.subject === subject,
              'border-telegram-border bg-telegram-secondary text-telegram-text hover:border-telegram-success/50':
                form.subject !== subject,
            }"
          >
            <span class="font-medium text-sm">{{ subject }}</span>
          </button>
        </div>

        <div v-if="form.subject === 'Другое'">
          <Input v-model="form.subject" placeholder="Укажите предмет" class="w-full" />
        </div>
      </Card>

      <!-- Title -->
      <Card class="p-6 mb-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Название услуги</h2>
        <p class="text-telegram-textSecondary text-sm mb-4">
          Краткое и понятное описание ваших услуг
        </p>

        <Input
          v-model="form.title"
          placeholder="Например: Подготовка к ЕГЭ по математике"
          class="w-full"
        />
      </Card>

      <!-- Experience -->
      <Card class="p-6 mb-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-4">Опыт преподавания</h2>

        <div class="grid grid-cols-1 gap-3">
          <button
            v-for="exp in experienceOptions"
            :key="exp.value"
            @click="form.experience = exp.value"
            class="p-4 rounded-xl border-2 transition-all duration-200 text-left"
            :class="{
              'border-telegram-success bg-telegram-success/10': form.experience === exp.value,
              'border-telegram-border bg-telegram-secondary hover:border-telegram-success/50':
                form.experience !== exp.value,
            }"
          >
            <span class="font-medium text-telegram-text">{{ exp.label }}</span>
          </button>
        </div>
      </Card>

      <!-- Education -->
      <Card class="p-6 mb-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Образование</h2>
        <p class="text-telegram-textSecondary text-sm mb-4">
          Укажите ваше образование и квалификацию
        </p>

        <textarea
          v-model="form.education"
          placeholder="Например: МГУ, факультет математики, кандидат математических наук"
          class="w-full h-20 px-4 py-3 bg-telegram-secondary border border-telegram-border rounded-xl text-telegram-text placeholder-telegram-textSecondary resize-none focus:outline-none focus:border-telegram-success transition-colors"
        />
      </Card>

      <!-- Format -->
      <Card class="p-6 mb-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-4">Формат занятий</h2>

        <div class="space-y-3">
          <button
            v-for="format in formats"
            :key="format.value"
            @click="form.format = format.value"
            class="w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center space-x-3"
            :class="{
              'border-telegram-success bg-telegram-success/10': form.format === format.value,
              'border-telegram-border bg-telegram-secondary hover:border-telegram-success/50':
                form.format !== format.value,
            }"
          >
            <div class="text-2xl">{{ format.icon }}</div>
            <div class="text-left">
              <div class="font-medium text-telegram-text">{{ format.label }}</div>
            </div>
          </button>
        </div>
      </Card>

      <!-- Price -->
      <Card class="p-6 mb-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Стоимость за занятие</h2>
        <p class="text-telegram-textSecondary text-sm mb-4">
          Укажите стоимость одного академического часа (45 минут)
        </p>

        <div class="flex items-center space-x-3">
          <Input v-model="form.price" placeholder="1500" type="number" class="flex-1" />
          <span class="text-telegram-textSecondary font-medium">₽</span>
        </div>
      </Card>

      <!-- Schedule -->
      <Card class="p-6 mb-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Доступное время</h2>
        <p class="text-telegram-textSecondary text-sm mb-4">Когда вы можете проводить занятия?</p>

        <Input
          v-model="form.schedule"
          placeholder="Например: будни вечером, выходные днем"
          class="w-full"
        />
      </Card>

      <!-- Description -->
      <Card class="p-6 mb-6">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Подробное описание</h2>
        <p class="text-telegram-textSecondary text-sm mb-4">
          Расскажите о своих методах, подходе к обучению, успехах учеников
        </p>

        <textarea
          v-model="form.description"
          placeholder="Например: Индивидуальный подход к каждому ученику. Использую современные методики преподавания. Мои ученики поступают в ведущие университеты. Помогаю понять предмет на глубоком уровне, а не просто заучить формулы."
          class="w-full h-32 px-4 py-3 bg-telegram-secondary border border-telegram-border rounded-xl text-telegram-text placeholder-telegram-textSecondary resize-none focus:outline-none focus:border-telegram-success transition-colors"
        />
      </Card>

      <!-- Achievements -->
      <Card class="p-6 mb-8">
        <h2 class="text-lg font-semibold text-telegram-text mb-2">Достижения</h2>
        <p class="text-telegram-textSecondary text-sm mb-4">
          Укажите ваши профессиональные достижения, награды, сертификаты
        </p>

        <textarea
          v-model="form.achievements"
          placeholder="Например: Победитель олимпиады по математике, сертификат TESOL, автор научных статей"
          class="w-full h-24 px-4 py-3 bg-telegram-secondary border border-telegram-border rounded-xl text-telegram-text placeholder-telegram-textSecondary resize-none focus:outline-none focus:border-telegram-success transition-colors"
        />
      </Card>

      <!-- Submit -->
      <Button
        @click="submitService"
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
        {{ isSubmitting ? 'Создание услуги...' : 'Создать услугу' }}
      </Button>
    </div>
  </div>
</template>
