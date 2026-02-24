<script setup lang="ts">
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import type { TutorActiveDeal } from '../models'
import { getDealStatusLabel, getDealStatusClass } from '../models'

defineProps<{
  deal: TutorActiveDeal
}>()

const emit = defineEmits<{
  view: [deal: TutorActiveDeal]
  start: [deal: TutorActiveDeal]
  complete: [deal: TutorActiveDeal]
}>()
</script>

<template>
  <Card
    class="p-6 cursor-pointer hover:bg-telegram-secondary/50 transition-colors"
    @click="emit('view', deal)"
  >
    <div class="mb-4">
      <div class="flex items-start space-x-4">
        <div
          class="w-12 h-12 bg-telegram-accent/20 rounded-full flex items-center justify-center"
        >
          <span class="text-telegram-accent font-semibold text-lg">
            {{ deal.studentName.charAt(0) }}
          </span>
        </div>
        <div class="flex-1">
          <div class="flex items-center space-x-3 mb-2">
            <h3 class="text-lg font-semibold text-telegram-text">{{ deal.studentName }}</h3>
            <span
              :class="[
                'px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap',
                getDealStatusClass(deal.status),
              ]"
            >
              {{ getDealStatusLabel(deal.status) }}
            </span>
          </div>
        </div>
      </div>
      <div class="space-y-1">
        <h4 class="text-lg font-semibold text-telegram-accent">{{ deal.subject }}</h4>
        <p class="text-telegram-textSecondary text-sm">{{ deal.teacher }}</p>
      </div>
    </div>
    <div class="mb-4">
      <div class="flex items-center mb-2">
        <svg class="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <span class="text-telegram-textSecondary text-xs font-medium uppercase tracking-wide"
          >Задача студента</span
        >
      </div>
      <p class="text-telegram-text text-sm leading-relaxed pl-6">{{ deal.taskDescription }}</p>
    </div>
    <div v-if="deal.tutorComment" class="mb-4">
      <div class="flex items-center mb-2">
        <svg class="w-4 h-4 text-telegram-accent mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
        <span class="text-telegram-textSecondary text-xs font-medium uppercase tracking-wide"
          >Мой комментарий</span
        >
      </div>
      <div class="border-l-4 border-telegram-accent/30 pl-3 ml-3">
        <p class="text-telegram-text text-sm leading-relaxed">{{ deal.tutorComment }}</p>
      </div>
    </div>
    <div
      class="bg-telegram-success/10 border-telegram-success text-telegram-success font-bold text-xl px-4 py-2 rounded-lg text-center mb-3"
    >
      {{ deal.price }}₽
    </div>
    <div class="flex items-center justify-around mb-4 p-3 bg-telegram-secondary/30 rounded-lg">
      <div v-if="deal.deadline" class="text-center">
        <div class="text-telegram-text font-medium">
          {{ deal.deadline.toLocaleDateString('ru-RU') }}
        </div>
        <div class="text-telegram-textSecondary text-xs">крайний срок</div>
      </div>
      <div v-if="deal.deadline" class="w-px h-8 bg-telegram-secondary"></div>
      <div class="text-center">
        <div class="text-telegram-text font-medium">
          {{ deal.createdAt.toLocaleDateString('ru-RU') }}
        </div>
        <div class="text-telegram-textSecondary text-xs">начато</div>
      </div>
    </div>
    <div v-if="deal.status === 'pending' || deal.status === 'accepted'" class="flex space-x-3">
      <Button
        @click.stop="emit('start', deal)"
        size="sm"
        class="flex-1 bg-telegram-success hover:bg-telegram-success/90 text-white"
      >
        Начать
      </Button>
    </div>
    <div v-if="deal.status === 'in_progress'" class="flex space-x-3">
      <Button
        @click.stop="emit('complete', deal)"
        size="sm"
        class="flex-1 bg-telegram-secondary text-telegram-text hover:bg-telegram-secondary/80"
      >
        Завершить занятие
      </Button>
    </div>
  </Card>
</template>
