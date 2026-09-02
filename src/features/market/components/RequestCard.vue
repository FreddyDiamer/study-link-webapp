<script setup lang="ts">
import { computed } from 'vue'
import AvatarChip from '@/shared/components/AvatarChip.vue'
import { countWithWord, formatDeadline, formatKopeks } from '@/shared/utils'
import type { Request } from '@/shared/types'

interface Props {
  request: Request
  /** заявка принадлежит текущему пользователю — в макете помечена плашкой «Моя» */
  mine?: boolean
  delay?: string
}

const props = withDefaults(defineProps<Props>(), { mine: false })

const budgetText = computed(() =>
  props.request.budget && props.request.budget > 0
    ? `до ${formatKopeks(props.request.budget)}`
    : 'Бюджет не указан',
)

const responsesLabel = computed(() =>
  countWithWord(props.request.responses?.length ?? 0, 'отклик', 'отклика', 'откликов'),
)

const deadlineText = computed(() => formatDeadline(props.request.deadline))
</script>

<template>
  <article
    class="press reveal bg-d-panel border border-d-border rounded-card p-4 cursor-pointer hover:border-d-border-hover"
    :style="delay ? { animationDelay: delay } : undefined"
  >
    <div class="flex items-center gap-2.5 mb-3">
      <AvatarChip :name="request.student?.name" size="md" />
      <span class="text-caption font-semibold">{{ request.student?.name || 'Студент' }}</span>
      <span
        v-if="mine"
        class="text-[11px] font-bold px-2.5 py-[3px] rounded-full bg-d-accent/[0.16] text-d-accent"
        >Моя</span
      >
      <span class="ml-auto text-[12px] text-d-text-hint">{{ responsesLabel }}</span>
    </div>

    <h3 class="text-title-m mb-1.5">
      {{ request.subject?.name || 'Предмет' }} · {{ request.teacher?.fullName || '—' }}
    </h3>
    <p v-if="request.description" class="text-subhead text-d-text-second mb-4 line-clamp-2">
      {{ request.description }}
    </p>

    <div class="flex items-center justify-between">
      <span class="text-price tnum">{{ budgetText }}</span>
      <span class="text-caption text-d-text-hint">{{ deadlineText }}</span>
    </div>
  </article>
</template>
