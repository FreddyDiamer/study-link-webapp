<script setup lang="ts">
import { computed } from 'vue'
import AvatarChip from '@/shared/components/AvatarChip.vue'
import { RatingChip } from '@/shared/components/ui'
import { countWithWord, formatKopeks } from '@/shared/utils'
import type { Service } from '@/shared/types'

interface Props {
  service: Service
  /** услуга принадлежит текущему пользователю — в ленте помечена плашкой «Моя» */
  mine?: boolean
  delay?: string
}

const props = withDefaults(defineProps<Props>(), { mine: false })

const rating = computed(() => props.service.tutor?.rating ?? null)

// пока оценок нет, строка отзывов должна называть это словами, а не нулём
const reviewsLabel = computed(() => {
  const count = props.service.tutor?.reviewsCount ?? 0
  return count > 0 ? countWithWord(count, 'отзыв', 'отзыва', 'отзывов') : 'Оценок пока нет'
})
</script>

<template>
  <article
    class="press reveal bg-d-panel border border-d-border rounded-card p-4 cursor-pointer hover:border-d-border-hover"
    :style="delay ? { animationDelay: delay } : undefined"
  >
    <div class="flex items-center gap-2.5 mb-3">
      <AvatarChip :name="service.tutor?.name" size="md" />
      <span class="text-caption font-semibold">{{ service.tutor?.name || 'Репетитор' }}</span>
      <span v-if="mine" class="badge badge-accent">Моя</span>
      <RatingChip class="ml-auto" :rating="rating" />
    </div>

    <h3 class="text-title-m mb-1.5">
      {{ service.subject?.name || 'Предмет' }} · {{ service.teacher?.fullName || '—' }}
    </h3>
    <p v-if="service.description" class="text-subhead text-d-text-second mb-4 line-clamp-2">
      {{ service.description }}
    </p>

    <div class="flex items-center justify-between">
      <span class="text-price tnum">{{ formatKopeks(service.price) }}</span>
      <span class="text-caption text-d-text-hint">{{ reviewsLabel }}</span>
    </div>
  </article>
</template>
