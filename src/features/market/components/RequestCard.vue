<script setup lang="ts">
import { computed } from 'vue'
import AvatarChip from '@/shared/components/AvatarChip.vue'
import type { Request } from '@/shared/types'

interface Props {
  request: Request
  delay?: string
}

const props = defineProps<Props>()

const formatPrice = (kopeks: number) =>
  `${Math.round(kopeks / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₽`

const budgetText = computed(() =>
  props.request.budget && props.request.budget > 0
    ? `до ${formatPrice(props.request.budget)}`
    : 'Бюджет не указан',
)

const responsesCount = computed(() => props.request.responses?.length ?? 0)
const responsesLabel = computed(() => {
  const n = responsesCount.value
  const mod10 = n % 10
  const mod100 = n % 100
  let word = 'откликов'
  if (mod10 === 1 && mod100 !== 11) word = 'отклик'
  else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) word = 'отклика'
  return `${n} ${word}`
})
</script>

<template>
  <article
    class="press reveal bg-d-panel border border-d-border rounded-card p-4 cursor-pointer hover:border-d-border-hover"
    :style="delay ? { animationDelay: delay } : undefined"
  >
    <div class="flex items-center gap-2.5 mb-3">
      <AvatarChip :name="request.student?.name" size="md" />
      <span class="text-caption font-semibold">{{ request.student?.name || 'Студент' }}</span>
    </div>

    <h3 class="text-title-m mb-1.5">
      {{ request.subject?.name || 'Предмет' }} · {{ request.teacher?.fullName || '—' }}
    </h3>
    <p v-if="request.description" class="text-subhead text-d-text-second mb-4 line-clamp-2">
      {{ request.description }}
    </p>

    <div class="flex items-center justify-between">
      <span class="text-price tnum">{{ budgetText }}</span>
      <span class="text-caption text-d-text-hint">{{ responsesLabel }}</span>
    </div>
  </article>
</template>
