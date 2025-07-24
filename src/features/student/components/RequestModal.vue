<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Modal, Button, Input, Select } from '@/shared/components/ui'
import { useTelegramStore } from '@/stores/telegram'

interface Service {
  id: string
  title: string
  price: number
  subject: string
  teacher: {
    name: string
    id: string
  }
}

interface Props {
  modelValue: boolean
  service: Service | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [data: RequestData]
}>()

interface RequestData {
  serviceId: string
  message: string
  budget: string
  urgency: string
}

const telegramStore = useTelegramStore()

const form = reactive({
  message: '',
  budget: '',
  urgency: 'week',
})

const isLoading = ref(false)

const budgetOptions = computed(() => [
  { value: 'service-price', label: `${props.service?.price || 1000}₽/час (как указано)` },
  { value: 'flexible', label: 'Готов обсудить цену' },
  { value: 'lower', label: 'Ищу более низкую цену' },
  { value: 'higher', label: 'Готов доплатить за качество' },
])

const urgencyOptions = [
  { value: 'today', label: 'Сегодня (срочно)' },
  { value: 'tomorrow', label: 'Завтра' },
  { value: 'week', label: 'На этой неделе' },
  { value: 'month', label: 'В течение месяца' },
]

const defaultMessage = computed(() => {
  if (!props.service) return ''
  return `Здравствуйте! Интересует ${props.service.subject.toLowerCase()} от ${props.service.teacher.name}. `
})

const handleClose = () => {
  emit('update:modelValue', false)
  resetForm()
}

const resetForm = () => {
  form.message = ''
  form.budget = 'service-price'
  form.urgency = 'week'
}

const handleSubmit = async () => {
  if (!props.service) return

  isLoading.value = true
  telegramStore.hapticFeedback('medium')

  try {
    const requestData: RequestData = {
      serviceId: props.service.id,
      message: form.message || defaultMessage.value,
      budget: form.budget || 'service-price',
      urgency: form.urgency,
    }

    emit('submit', requestData)
    handleClose()
  } catch (error) {
    console.error('Ошибка отправки заявки:', error)
  } finally {
    isLoading.value = false
  }
}

// Инициализация формы при открытии
const initializeForm = () => {
  if (props.service && props.modelValue) {
    form.message = defaultMessage.value
    form.budget = 'service-price'
    form.urgency = 'week'
  }
}
</script>

<template>
  <Modal
    :model-value="modelValue"
    title="Оставить заявку"
    max-width="lg"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div v-if="service" class="space-y-6">
      <!-- Service Info -->
      <div class="p-4 bg-telegram-secondary/30 rounded-lg">
        <h4 class="font-medium text-telegram-text mb-1">{{ service.title }}</h4>
        <p class="text-sm text-telegram-textSecondary">
          Репетитор: {{ service.teacher.name }} • {{ service.price }}₽/час
        </p>
      </div>

      <!-- Form -->
      <div class="space-y-4">
        <!-- Message -->
        <div>
          <label class="block text-sm font-medium text-telegram-text mb-2">
            Что именно нужно?
          </label>
          <textarea
            v-model="form.message"
            rows="3"
            :placeholder="defaultMessage"
            class="w-full px-4 py-3 bg-telegram-secondary border border-telegram-border rounded-xl text-telegram-text placeholder-telegram-textSecondary focus:outline-none focus:border-telegram-accent transition-colors resize-none"
          />
          <p class="text-xs text-telegram-textSecondary mt-1">
            Опишите задачу, уровень сложности, ваши цели
          </p>
        </div>

        <!-- Budget -->
        <div>
          <Select
            v-model="form.budget"
            :options="budgetOptions"
            label="Бюджет"
            placeholder="Выберите бюджет"
          />
        </div>

        <!-- Urgency -->
        <div>
          <Select
            v-model="form.urgency"
            :options="urgencyOptions"
            label="Когда нужно?"
            placeholder="Выберите срочность"
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex space-x-3 pt-4">
        <Button variant="ghost" @click="handleClose" class="flex-1" :disabled="isLoading">
          Отменить
        </Button>
        <Button @click="handleSubmit" class="flex-1" :loading="isLoading">
          Отправить заявку
        </Button>
      </div>

      <!-- Help text -->
      <div class="text-center">
        <p class="text-xs text-telegram-textSecondary">
          Репетитор увидит вашу заявку и сможет принять её или предложить свои условия
        </p>
      </div>
    </div>
  </Modal>
</template>
