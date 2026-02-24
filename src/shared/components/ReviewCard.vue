<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Rating } from '@/shared/components/ui'
import Card from '@/shared/components/ui/Card.vue'
import type { Review } from '@/shared/types'

interface Props {
  review: Review
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showActions: false,
})

const router = useRouter()
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
function openAuthorProfile(authorId: string) {
  router.push(`/user/${authorId}`)
}
</script>

<template>
  <Card class="p-4 mb-4">
    <!-- Header -->
    <div class="flex items-start justify-between mb-3">
      <div
        v-if="review.author?.id"
        class="flex items-center space-x-3 cursor-pointer min-w-0"
        @click="openAuthorProfile(review.author.id)"
      >
        <div
          class="w-10 h-10 bg-telegram-accent rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
        >
          {{ review.author?.name?.charAt(0) || 'П' }}
        </div>
        <div class="min-w-0">
          <div class="font-medium text-telegram-text">
            {{ review.author?.name || 'Пользователь' }}
          </div>
          <div class="text-sm text-telegram-textSecondary">
            {{ formatDate(review.createdAt) }}
          </div>
          <span class="text-xs text-telegram-accent">Профиль →</span>
        </div>
      </div>
      <div v-else class="flex items-center space-x-3">
        <div
          class="w-10 h-10 bg-telegram-accent rounded-full flex items-center justify-center text-white font-bold"
        >
          {{ review.author?.name?.charAt(0) || 'П' }}
        </div>
        <div>
          <div class="font-medium text-telegram-text">
            {{ review.author?.name || 'Пользователь' }}
          </div>
          <div class="text-sm text-telegram-textSecondary">
            {{ formatDate(review.createdAt) }}
          </div>
        </div>
      </div>

      <Rating :rating="review.rating" size="sm" :show-count="false" readonly />
    </div>

    <!-- Comment -->
    <div v-if="review.comment" class="mb-3">
      <p class="text-sm text-telegram-text">
        {{ review.comment }}
      </p>
    </div>

    <!-- Deal info -->
    <div class="text-xs text-telegram-textSecondary">
      По сделке: {{ review.deal?.subject?.name || 'Не указано' }}
    </div>
  </Card>
</template>
