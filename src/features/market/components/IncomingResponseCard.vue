<script setup lang="ts">
import { computed } from 'vue'
import AvatarChip from '@/shared/components/AvatarChip.vue'
import { countWithWord, formatDeadline, formatKopeks } from '@/shared/utils'
import { ResponseStatus, type RequestResponse } from '@/shared/types'

interface Props {
  response: RequestResponse
  /** по заявке уже выбран репетитор — остальные отклики гаснут */
  decided?: boolean
  busy?: boolean
  delay?: string
}

const props = withDefaults(defineProps<Props>(), { decided: false, busy: false })
const emit = defineEmits<{ accept: [id: string]; openDeal: [] }>()

const isAccepted = computed(() => props.response.status === ResponseStatus.ACCEPTED)
const isClosed = computed(() => props.decided && !isAccepted.value)
const isPending = computed(() => !props.decided && props.response.status === ResponseStatus.PENDING)

const reviewsLabel = computed(() =>
  countWithWord(props.response.tutor?.reviewsCount ?? 0, 'отзыв', 'отзыва', 'отзывов'),
)
</script>

<template>
  <div
    class="reveal bg-d-panel border rounded-[14px] p-[15px] transition-[opacity,border-color] duration-300"
    :class="[isAccepted ? 'border-d-teal' : 'border-d-border', isClosed ? 'opacity-45' : '']"
    :style="delay ? { animationDelay: delay } : undefined"
  >
    <div class="flex items-center gap-2.5 mb-2.5">
      <AvatarChip :name="response.tutor?.name" size="md" />
      <div class="flex-1 min-w-0">
        <div class="text-subhead font-semibold truncate">
          {{ response.tutor?.name || 'Репетитор' }}
        </div>
        <div class="flex items-center gap-1 mt-0.5">
          <span class="text-d-rating text-[11px]">★</span>
          <span class="text-[12px] font-bold text-d-rating tnum">
            {{ (response.tutor?.rating ?? 0).toFixed(1) }}
          </span>
          <span class="text-[11px] text-d-text-hint">· {{ reviewsLabel }}</span>
        </div>
      </div>
      <span
        v-if="isAccepted"
        class="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-d-teal/[0.16] text-d-teal animate-d-pop"
        >Выбран</span
      >
      <span
        v-else-if="isClosed"
        class="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-d-text-mute/20 text-d-text-second"
        >Закрыт</span
      >
    </div>

    <p v-if="response.message" class="text-subhead text-d-text-second mb-3">
      {{ response.message }}
    </p>

    <div class="flex items-center gap-2 mb-3">
      <span class="text-[16px] font-bold tnum">{{ formatKopeks(response.price) }}</span>
      <span v-if="response.proposedDeadline" class="text-caption text-d-text-hint">
        · {{ formatDeadline(response.proposedDeadline, 'к') }}
      </span>
    </div>

    <button
      v-if="isPending"
      class="press w-full h-11 rounded-[12px] bg-d-accent text-d-ink text-[15px] font-bold disabled:opacity-40"
      :disabled="busy"
      @click="emit('accept', response.id)"
    >
      Выбрать репетитора
    </button>
    <button
      v-else-if="isAccepted"
      class="press w-full h-11 rounded-[12px] bg-d-teal/[0.12] text-d-teal text-[15px] font-bold"
      @click="emit('openDeal')"
    >
      Сделка создана →
    </button>
  </div>
</template>
