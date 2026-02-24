<script setup lang="ts">
import Card from '@/shared/components/ui/Card.vue'
import type { TutorServiceCard } from '../models'
import { getStatusLabel, getStatusClass } from '../models'

defineProps<{
  service: TutorServiceCard
}>()

const emit = defineEmits<{
  view: [service: TutorServiceCard]
  edit: [service: TutorServiceCard]
}>()
</script>

<template>
  <Card
    class="p-6 cursor-pointer hover:bg-telegram-secondary/50 transition-colors"
    :class="{ 'opacity-60': service.status === 'frozen' }"
    @click="emit('view', service)"
  >
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <div class="flex items-start justify-between">
          <h3 class="text-xl font-semibold text-telegram-text">{{ service.title }}</h3>
          <button
            type="button"
            @click.stop="emit('edit', service)"
            class="-mr-5 flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-telegram-secondary transition-colors text-telegram-textSecondary text-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>Настроить</span>
          </button>
        </div>
        <p class="text-telegram-textSecondary text-sm mb-3">{{ service.teacher }}</p>
        <div class="flex items-center flex-wrap gap-2 mb-3">
          <span :class="['px-2 py-1 text-xs font-medium rounded-full', getStatusClass(service.status)]">
            {{ getStatusLabel(service.status) }}
          </span>
          <span class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">
            {{ service.price }}₽
          </span>
          <span class="px-2 py-1 text-xs bg-telegram-secondary/50 text-telegram-text rounded-full font-medium">
            {{ service.lessonsCount }} занятий · {{ service.lessonDurationMinutes }} мин
          </span>
          <span
            v-if="service.newResponsesCount > 0"
            class="px-2 py-1 text-xs font-medium rounded-full bg-telegram-accent text-white animate-pulse"
          >
            +{{ service.newResponsesCount }} новых
          </span>
        </div>
      </div>
    </div>
    <p class="text-telegram-text text-sm mb-4">{{ service.description }}</p>
    <div class="mb-4 p-3 bg-telegram-secondary/50 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="text-center">
          <div class="text-lg font-semibold text-telegram-text">{{ service.responsesCount }}</div>
          <div class="text-xs text-telegram-textSecondary">Всего откликов</div>
        </div>
        <div class="text-center">
          <div class="text-lg font-semibold text-telegram-accent">
            {{ service.activeResponsesCount }}
          </div>
          <div class="text-xs text-telegram-textSecondary">Активных</div>
        </div>
        <div class="text-center">
          <div class="text-lg font-semibold text-telegram-success">
            {{ service.newResponsesCount }}
          </div>
          <div class="text-xs text-telegram-textSecondary">Новых</div>
        </div>
        <svg class="w-5 h-5 text-telegram-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </Card>
</template>
