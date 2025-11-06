<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { Modal, Button, Input, Select } from '@/shared/components/ui'
import { useTelegramStore, useAuthStore } from '@/stores'
import { useOrder } from '@/shared/composables'

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
const authStore = useAuthStore()
const { createServiceResponse } = useOrder()

const form = reactive({
  message: '',
  budget: 'service-price',
  urgency: 'week',
})

const isLoading = ref(false)

const budgetOptions = computed(() => [
  { value: 'service-price', label: `${props.service?.price || 1000}₽` },
  { value: 'flexible', label: 'Готов обсудить цену' },
  { value: 'lower', label: 'Ищу более низкую' },
  { value: 'higher', label: 'Готов доплатить за качество' },
])

const urgencyOptions = [
  { value: 'today', label: 'Сегодня (срочно)' },
  { value: 'tomorrow', label: 'Завтра' },
  { value: 'week', label: 'На этой неделе' },
  { value: 'month', label: 'В течение месяца' },
]

const handleClose = () => {
  emit('update:modelValue', false)
  resetForm()
}

const resetForm = () => {
  form.message = ''
  form.budget = 'service-price'
  form.urgency = 'week'
}

const getProposedDeadline = (urgency: string): string | undefined => {
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000

  switch (urgency) {
    case 'today':
      return new Date(now + dayMs).toISOString()
    case 'tomorrow':
      return new Date(now + 2 * dayMs).toISOString()
    case 'week':
      return new Date(now + 7 * dayMs).toISOString()
    case 'month':
      return new Date(now + 30 * dayMs).toISOString()
    default:
      return undefined
  }
}

const getPriceFromBudget = (budget: string): number | undefined => {
  if (budget === 'service-price' && props.service) {
    return props.service.price
  }
  if (budget === 'flexible' || budget === 'lower' || budget === 'higher') {
    return undefined
  }
  return undefined
}

const handleSubmit = async () => {
  if (!props.service || !authStore.user?.id) {
    telegramStore.showAlert('Ошибка: не удалось определить пользователя')
    return
  }

  isLoading.value = true
  telegramStore.hapticFeedback('medium')

  try {
    const price = getPriceFromBudget(form.budget)
    const proposedDeadline = getProposedDeadline(form.urgency)

    await createServiceResponse({
      studentId: authStore.user.id,
      serviceId: props.service.id,
      message: form.message || undefined,
      price: price,
      proposedDeadline: proposedDeadline,
    })

    telegramStore.showAlert('Отклик отправлен! Репетитор ответит в ближайшее время.')
    emit('submit', {
      serviceId: props.service.id,
      message: form.message,
      budget: form.budget,
      urgency: form.urgency,
    })
    handleClose()
  } catch (error: any) {
    console.error('Ошибка отправки отклика:', error)
    telegramStore.showAlert(error.message || 'Ошибка отправки отклика. Попробуйте еще раз.')
  } finally {
    isLoading.value = false
  }
}

// Инициализация формы при открытии
const initializeForm = () => {
  if (props.service && props.modelValue) {
    form.budget = 'service-price'
    form.urgency = 'week'
  }
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      initializeForm()
    }
  },
)
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
            placeholder="Здравствуйте! Интересует помощь с ..."
            class="w-full px-4 py-3 bg-telegram-secondary border border-telegram-border rounded-xl text-telegram-text placeholder-telegram-textSecondary focus:outline-none focus:border-telegram-accent transition-colors resize-none"
          />
          <p class="text-xs text-telegram-textSecondary mt-1">
            Опишите задачу, уровень сложности, ваши цели
          </p>
        </div>

        <!-- Budget -->
        <div>
          <Select
            v-model:value="form.budget"
            :options="budgetOptions"
            label="Бюджет"
            placeholder="Выберите бюджет"
          />
        </div>

        <!-- Urgency -->
        <div>
          <Select
            v-model:value="form.urgency"
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
