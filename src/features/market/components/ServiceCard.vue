<script setup lang="ts">
import { computed } from 'vue'
import AvatarChip from '@/shared/components/AvatarChip.vue'
import { countWithWord, formatKopeks } from '@/shared/utils'
import type { Service } from '@/shared/types'

interface Props {
  service: Service
  delay?: string
}

const props = defineProps<Props>()

const reviewsLabel = computed(() =>
  countWithWord(props.service.tutor?.reviewsCount ?? 0, 'отзыв', 'отзыва', 'отзывов'),
)
</script>

<template>
  <article
    class="press reveal bg-d-panel border border-d-border rounded-card p-4 cursor-pointer hover:border-d-border-hover"
    :style="delay ? { animationDelay: delay } : undefined"
  >
    <div class="flex items-center gap-2.5 mb-3">
      <AvatarChip :name="service.tutor?.name" size="md" />
      <span class="text-caption font-semibold">{{ service.tutor?.name || 'Репетитор' }}</span>
      <span class="ml-auto flex items-center gap-1.5 bg-d-rating/[0.12] px-2.5 py-1 rounded-full">
        <span class="text-d-rating text-[12px]">★</span>
        <span class="text-[12px] font-bold text-d-rating tnum">
          {{ (service.tutor?.rating ?? 0).toFixed(1) }}
        </span>
      </span>
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
