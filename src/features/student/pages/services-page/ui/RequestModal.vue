<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { Modal, Button, Input, Select } from '@/shared/components/ui'
import { useTelegramStore, useAuthStore } from '@/stores'
import { useOrder } from '@/shared/composables'
import type { Service } from '../models'

const props = defineProps<{
  modelValue: boolean
  service: Service | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: []
}>()

const telegramStore = useTelegramStore()
const authStore = useAuthStore()
const { createServiceResponse } = useOrder()
const createServiceResponseMutation = createServiceResponse()

const form = reactive({
  message: '',
  budget: 'service-price',
  urgency: 'week',
  customPrice: '',
  customDate: '',
})
const isLoading = ref(false)

const budgetOptions = computed(() => [
  { value: 'service-price', label: `Цена услуги (${props.service?.price ?? 0}₽)` },
  { value: 'flexible', label: 'Готов обсудить цену' },
  { value: 'lower', label: 'Ищу более низкую' },
  { value: 'higher', label: 'Готов доплатить за качество' },
])

const urgencyOptions = [
  { value: 'today', label: 'Сегодня (срочно)' },
  { value: 'week', label: 'На этой неделе' },
  { value: 'month', label: 'В течение месяца' },
  { value: 'custom', label: 'Выбрать дату' },
]

const handleClose = () => {
  emit('update:modelValue', false)
  form.message = ''
  form.budget = 'service-price'
  form.urgency = 'week'
  form.customPrice = ''
}

const todayDate = computed(() => new Date().toISOString().slice(0, 10))

function getProposedDeadline(urgency: string, customDate?: string): string | undefined {
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000
  switch (urgency) {
    case 'today': return new Date(now + dayMs).toISOString()
    case 'week': return new Date(now + 7 * dayMs).toISOString()
    case 'month': return new Date(now + 30 * dayMs).toISOString()
    case 'custom':
      if (!customDate) return undefined
      return new Date(customDate).toISOString()
    default: return undefined
  }
}

/** Цена из формы в тех же единицах, что и API (целое число) */
function getPriceValue(): number | undefined {
  if (form.budget === 'service-price' && props.service && props.service.price > 0) {
    return props.service.price
  }
  const num = form.customPrice.trim() ? parseFloat(form.customPrice.replace(/\s/g, '')) : NaN
  if (!Number.isNaN(num) && num > 0) return num
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
    if (form.urgency === 'custom') {
      if (!form.customDate) {
        telegramStore.showAlert('Пожалуйста, выберите дату')
        isLoading.value = false
        return
      }
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const selected = new Date(form.customDate)
      selected.setHours(0, 0, 0, 0)
      if (selected < today) {
        telegramStore.showAlert('Нельзя выбрать дату раньше сегодняшней')
        isLoading.value = false
        return
      }
    }

    const price = getPriceValue()
    await createServiceResponseMutation.mutateAsync({
      studentId: authStore.user.id,
      serviceId: props.service.id,
      message: form.message.trim() || undefined,
      price,
      proposedDeadline: getProposedDeadline(form.urgency, form.customDate || undefined),
    })
    telegramStore.showAlert('Отклик отправлен! Репетитор ответит в ближайшее время.')
    emit('submit')
    handleClose()
  } catch (error: unknown) {
    console.error(error)
    telegramStore.showAlert((error as Error).message || 'Ошибка отправки отклика. Попробуйте еще раз.')
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      form.budget = 'service-price'
      form.urgency = 'week'
      form.customPrice = ''
      form.customDate = ''
    }
  },
)
</script>

<template>
  <Modal
    :model-value="modelValue"
    title="Оставить заявку"
    max-width="lg"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div v-if="service" class="space-y-6">
      <div class="p-4 bg-telegram-secondary/30 rounded-lg">
        <h4 class="font-medium text-telegram-text mb-1">{{ service.title }}</h4>
        <p class="text-sm text-telegram-textSecondary">Репетитор: {{ service.teacher.name }} • {{ service.price }}₽/час</p>
      </div>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-telegram-text mb-2">Что именно нужно?</label>
          <textarea
            v-model="form.message"
            rows="3"
            placeholder="Здравствуйте! Интересует помощь с ..."
            class="w-full px-4 py-3 bg-telegram-secondary border border-telegram-border rounded-xl text-telegram-text placeholder-telegram-textSecondary focus:outline-none focus:border-telegram-accent transition-colors resize-none"
          />
        </div>
        <div>
          <Select :value="form.budget" @update:value="(v) => (form.budget = v ?? '')" :options="budgetOptions" label="Бюджет" placeholder="Выберите бюджет" />
        </div>
        <div v-if="form.budget !== 'service-price'">
          <label class="block text-sm font-medium text-telegram-text mb-2">Ваша предложенная сумма (₽)</label>
          <Input
            v-model="form.customPrice"
            type="number"
            min="1"
            placeholder="Например: 1500"
            class="w-full"
          />
        </div>
        <div>
          <Select
            :value="form.urgency"
            @update:value="(v) => (form.urgency = v ?? '')"
            :options="urgencyOptions"
            label="Когда нужно?"
            placeholder="Выберите срочность"
            placement="top"
          />
        </div>
        <div v-if="form.urgency === 'custom'">
          <label class="block text-sm font-medium text-telegram-text mb-2">Выберите дату</label>
          <Input
            v-model="form.customDate"
            type="date"
            :min="todayDate"
            class="w-full"
          />
        </div>
      </div>
      <div class="flex space-x-3 pt-4">
        <Button variant="ghost" @click="handleClose" class="flex-1" :disabled="isLoading">Отменить</Button>
        <Button @click="handleSubmit" class="flex-1" :loading="isLoading">Отправить заявку</Button>
      </div>
    </div>
  </Modal>
</template>
