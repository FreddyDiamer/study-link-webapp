<script setup lang="ts">
import { useRouter } from 'vue-router'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import type { User } from '../models'

defineProps<{
  tutor: User
}>()

const emit = defineEmits<{
  remove: [tutorId: string]
}>()

const router = useRouter()

const handleRemove = (tutorId: string) => {
  emit('remove', tutorId)
}

const openProfile = (id: string) => {
  router.push(`/user/${id}?view=tutor`)
}
</script>

<template>
  <Card class="p-4">
    <div class="flex items-center justify-between">
      <div
        class="flex items-center space-x-3 flex-1 min-w-0 cursor-pointer"
        @click="openProfile(tutor.id)"
      >
        <div
          class="w-12 h-12 bg-telegram-accent rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
        >
          {{ tutor.name?.charAt(0) || 'Р' }}
        </div>
        <div class="min-w-0">
          <h3 class="font-semibold text-telegram-text">{{ tutor.name || 'Репетитор' }}</h3>
          <p class="text-sm text-telegram-textSecondary truncate">
            {{ tutor.description || 'Описание не указано' }}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        @click="handleRemove(tutor.id)"
        class="text-telegram-destructive hover:text-telegram-destructive flex-shrink-0"
      >
        Удалить
      </Button>
    </div>
  </Card>
</template>
