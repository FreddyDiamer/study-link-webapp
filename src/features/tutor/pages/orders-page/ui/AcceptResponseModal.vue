<script setup lang="ts">
import { Modal, Button } from '@/shared/components/ui'
import type { Request } from '@/shared/types'
import { getDealDescription, formatOrderDate, formatDeadlineInfo } from '../models'

defineProps<{
  modelValue: boolean
  selectedRequest: Request | null
  tutorComment: string
  proposedDate: string
  proposedPrice: number | null
  isAccepting: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:tutorComment': [value: string]
  'update:proposedDate': [value: string]
  'update:proposedPrice': [value: number | null]
  submit: []
  close: []
}>()

function formatDate(s: string) {
  return formatOrderDate(s)
}
</script>

<template>
  <Modal
    :model-value="modelValue"
    title="Откликнуться на заказ"
    max-width="lg"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div v-if="selectedRequest" class="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
      <div class="space-y-3 mb-7 mt-2">
        <div class="flex items-center space-x-3 bg-telegram-secondary/20 rounded-xl">
          <div
            class="w-12 h-12 bg-telegram-accent rounded-full flex items-center justify-center text-white font-semibold"
          >
            {{
              selectedRequest.student.name
                .split(' ')
                .map((n) => n[0])
                .join('')
            }}
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-telegram-text">{{ selectedRequest.student.name }}</h3>
          </div>
          <div class="text-right">
            <div class="font-bold text-telegram-accent text-lg">
              {{ selectedRequest.budget ?? '—' }} ₽
            </div>
          </div>
        </div>
        <div class="bg-telegram-bg/50 border-l-4 border-telegram-accent p-4 rounded-r-lg">
          <p class="text-telegram-text leading-relaxed italic">
            {{ getDealDescription(selectedRequest) }}
          </p>
        </div>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-telegram-accent rounded-full"></div>
            <span class="text-telegram-textSecondary">
              Дедлайн:
              <span
                v-if="selectedRequest.deadline"
                :class="formatDeadlineInfo(selectedRequest.deadline).className"
                >{{ formatDeadlineInfo(selectedRequest.deadline).text }}</span
              >
              <span v-else class="text-telegram-text">Не установлен</span>
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-telegram-textSecondary rounded-full"></div>
            <span class="text-telegram-textSecondary">
              Создан:
              <span class="text-telegram-text">{{ formatDate(selectedRequest.createdAt) }}</span>
            </span>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-telegram-text mb-2">
            Предложить дату и время *
          </label>
          <input
            :value="proposedDate"
            @input="emit('update:proposedDate', ($event.target as HTMLInputElement).value)"
            type="datetime-local"
            required
            class="w-full px-4 py-3 bg-telegram-secondary border border-telegram-border rounded-xl text-telegram-text focus:outline-none focus:border-telegram-accent transition-colors"
          />
          <p class="text-xs text-telegram-textSecondary mt-1">Когда вы готовы провести занятие</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-telegram-text mb-2">
            Ваша цена <span class="text-telegram-textSecondary">(необязательно)</span>
          </label>
          <div class="relative">
            <input
              :value="proposedPrice ?? ''"
              @input="
                emit(
                  'update:proposedPrice',
                  ($event.target as HTMLInputElement).value ? Number(($event.target as HTMLInputElement).value) : null,
                )
              "
              type="number"
              min="0"
              step="50"
              placeholder="₽"
              class="w-full px-4 py-3 bg-telegram-secondary border border-telegram-border rounded-xl text-telegram-text placeholder-telegram-textSecondary focus:outline-none focus:border-telegram-accent transition-colors"
            />
            <span
              class="absolute right-4 top-1/2 transform -translate-y-1/2 text-telegram-textSecondary text-sm"
              >₽</span
            >
          </div>
          <p class="text-xs text-telegram-textSecondary mt-1">
            Оставьте пустым, если согласны с указанной ценой
          </p>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-telegram-text mb-2">
          Ваш комментарий <span class="text-telegram-textSecondary">(необязательно)</span>
        </label>
        <textarea
          :value="tutorComment"
          @input="emit('update:tutorComment', ($event.target as HTMLTextAreaElement).value)"
          rows="3"
          placeholder="Напишите ваши предложения, условия или дополнительную информацию..."
          class="w-full px-4 py-3 bg-telegram-secondary border border-telegram-border rounded-xl text-telegram-text placeholder-telegram-textSecondary focus:outline-none focus:border-telegram-accent transition-colors resize-none"
        />
        <p class="text-xs text-telegram-textSecondary mt-1">
          Студент увидит ваш комментарий вместе с откликом
        </p>
      </div>
    </div>
    <template #footer>
      <div class="flex space-x-3">
        <Button
          variant="secondary"
          @click="emit('close')"
          class="flex-1"
          :disabled="isAccepting"
        >
          Отмена
        </Button>
        <Button :loading="isAccepting" @click="emit('submit')" class="flex-1">
          Отправить отклик
        </Button>
      </div>
    </template>
  </Modal>
</template>
