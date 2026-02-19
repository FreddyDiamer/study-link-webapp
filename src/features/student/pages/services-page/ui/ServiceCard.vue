<script setup lang="ts">
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import type { Service } from '../models'

defineProps<{
  service: Service
}>()

const emit = defineEmits<{
  request: [service: Service]
  view: [service: Service]
}>()
</script>

<template>
  <Card
    class="p-4 hover:border-telegram-accent transition-colors cursor-pointer"
    @click="emit('view', service)"
  >
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <h3 class="font-semibold text-telegram-text mb-1">{{ service.subject }}</h3>
        <div class="flex items-center space-x-2 text-sm text-telegram-textSecondary">
          <span>{{ service.teacher.name }}</span>
        </div>
      </div>
      <div class="text-right">
        <div class="font-bold text-telegram-accent">{{ service.price }} ₽</div>
      </div>
    </div>
    <div class="flex items-center space-x-3 mb-3">
      <div class="w-10 h-10 bg-telegram-accent rounded-full flex items-center justify-center text-white font-semibold text-sm">
        {{ service.teacher.name.split(' ').map((n) => n[0]).join('') || 'Р' }}
      </div>
      <div class="flex-1">
        <div class="font-medium text-telegram-text">{{ service.teacher.name }}</div>
        <div class="flex items-center space-x-2 text-sm text-telegram-textSecondary">
          <span>{{ service.teacher.experience }} услуг</span>
          <span>•</span>
          <span>★ {{ service.teacher.rating }} ({{ service.teacher.reviewsCount }})</span>
        </div>
      </div>
    </div>
    <p class="text-telegram-textSecondary text-sm mb-3 line-clamp-5">{{ service.description }}</p>
    <div class="pt-3">
      <Button @click.stop="emit('request', service)" size="sm" class="w-full">Оставить заявку</Button>
    </div>
  </Card>
</template>
