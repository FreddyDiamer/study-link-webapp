<script setup lang="ts">
import { useRouter } from 'vue-router'
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

const router = useRouter()
function openTutorProfile(tutorId: string) {
  router.push(`/user/${tutorId}?view=tutor`)
}
</script>

<template>
  <Card
    class="p-4 hover:border-telegram-accent transition-colors cursor-pointer"
    @click="emit('view', service)"
  >
    <div v-if="service.isOwnService" class="mb-3 px-3 py-2 bg-telegram-accent/15 text-telegram-accent rounded-lg text-sm font-medium">
      Ваша услуга
    </div>
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
      <div class="w-10 h-10 bg-telegram-accent rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
        {{ service.teacher.name.split(' ').map((n) => n[0]).join('') || 'Р' }}
      </div>
      <div class="flex-1 min-w-0">
        <div
          v-if="service.tutorId && !service.isOwnService"
          class="font-medium text-telegram-text cursor-pointer"
          @click.stop="openTutorProfile(service.tutorId)"
        >
          <span class="text-telegram-accent hover:underline">{{ service.teacher.name }}</span>
          <span class="text-xs text-telegram-accent ml-1">Профиль →</span>
        </div>
        <div v-else class="font-medium text-telegram-text">{{ service.teacher.name }}</div>
        <div class="flex items-center space-x-2 text-sm text-telegram-textSecondary">
          <span>{{ service.teacher.experience }} услуг</span>
          <span>•</span>
          <span>★ {{ service.teacher.rating }} ({{ service.teacher.reviewsCount }})</span>
        </div>
      </div>
    </div>
    <p class="text-telegram-textSecondary text-sm mb-3 line-clamp-5">{{ service.description }}</p>
    <div class="pt-3">
      <div
        v-if="service.isOwnService"
        class="w-full px-4 py-2 bg-telegram-secondary text-telegram-textSecondary rounded-xl text-sm font-medium text-center cursor-default"
      >
        Нельзя оставить заявку на свою услугу
      </div>
      <div
        v-else-if="service.currentUserResponded"
        class="w-full px-4 py-2 bg-telegram-secondary text-telegram-textSecondary rounded-xl text-sm font-medium text-center cursor-not-allowed"
      >
        Заявка уже отправлена
      </div>
      <Button v-else @click.stop="emit('request', service)" size="sm" class="w-full">Оставить заявку</Button>
    </div>
  </Card>
</template>
