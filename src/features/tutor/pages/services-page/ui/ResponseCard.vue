<script setup lang="ts">
import Card from '@/shared/components/ui/Card.vue'
import { Chip } from '@/shared/components/ui'
import type { TutorRequestResponse } from '../models'
import { getResponseStatusLabel, getResponseStatusVariant } from '../models'

defineProps<{
  response: TutorRequestResponse
}>()

const emit = defineEmits<{
  withdraw: [response: TutorRequestResponse]
}>()
</script>

<template>
  <Card class="p-4">
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-telegram-text mb-1">{{ response.requestTitle }}</h3>
        <p class="text-telegram-textSecondary text-sm mb-2">{{ response.studentName }}</p>
      </div>
      <div class="flex items-center space-x-2">
        <Chip :variant="getResponseStatusVariant(response.status)" size="sm" class="rounded-full">
          {{ getResponseStatusLabel(response.status) }}
        </Chip>
      </div>
    </div>
    <p class="text-telegram-text text-sm mb-3 leading-relaxed">
      {{ response.requestDescription }}
    </p>
    <div class="flex items-center justify-between p-3 bg-telegram-secondary/20 rounded-lg mb-3">
      <div class="flex items-center space-x-4">
        <div v-if="response.price" class="text-center">
          <div class="text-telegram-success font-semibold">{{ response.price }}₽</div>
          <div class="text-xs text-telegram-textSecondary">Моя цена</div>
        </div>
        <div v-if="response.budget" class="text-center">
          <div class="text-telegram-text font-semibold">{{ response.budget }}₽</div>
          <div class="text-xs text-telegram-textSecondary">Бюджет</div>
        </div>
      </div>
      <div class="text-right">
        <div class="text-telegram-textSecondary text-xs">
          отправлен {{ response.createdAt.toLocaleDateString('ru-RU') }}
        </div>
      </div>
    </div>
    <div class="border-l-4 border-telegram-accent/30 pl-3 mb-4">
      <p class="text-telegram-text text-sm italic">"{{ response.message }}"</p>
    </div>
    <div
      v-if="response.status === 'pending'"
      class="pt-2 border-t border-telegram-secondary/30 flex justify-end"
    >
      <button
        type="button"
        @click="emit('withdraw', response)"
        class="px-3 py-1.5 text-xs font-medium text-telegram-destructive bg-telegram-destructive/10 hover:bg-telegram-destructive/20 rounded-lg transition-colors"
      >
        Отозвать
      </button>
    </div>
  </Card>
</template>
