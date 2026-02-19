<script setup lang="ts">
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import type { User } from '../models'

defineProps<{
  tutor: User
}>()

const emit = defineEmits<{
  remove: [tutorId: string]
}>()

const handleRemove = (tutorId: string) => {
  emit('remove', tutorId)
}
</script>

<template>
  <Card class="p-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div
          class="w-12 h-12 bg-telegram-accent rounded-full flex items-center justify-center text-white font-bold"
        >
          {{ tutor.name?.charAt(0) || 'Р' }}
        </div>
        <div>
          <h3 class="font-semibold text-telegram-text">{{ tutor.name || 'Репетитор' }}</h3>
          <p class="text-sm text-telegram-textSecondary">
            {{ tutor.description || 'Описание не указано' }}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        @click="handleRemove(tutor.id)"
        class="text-telegram-destructive hover:text-telegram-destructive"
      >
        Удалить
      </Button>
    </div>
  </Card>
</template>
