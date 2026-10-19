<script setup lang="ts">
import { computed } from 'vue'
import { countWithWord } from '@/shared/utils'

interface Props {
  rating: number
  reviewsCount: number
  // проценты для 5★,4★,3★,2★,1★ (0..100). Если не заданы — полосы скрыты.
  distribution?: number[]
}

const props = defineProps<Props>()

const stars = computed(() => {
  const f = Math.round(props.rating)
  return '★★★★★'.slice(0, f) + '☆☆☆☆☆'.slice(0, 5 - f)
})

const bars = computed(() =>
  (props.distribution ?? []).map((pct, j) => ({
    star: 5 - j,
    pct: `${Math.max(0, Math.min(100, pct))}%`,
    delay: `${0.15 + j * 0.06}s`,
  })),
)
</script>

<template>
  <div class="reveal flex gap-3.5 bg-d-panel border border-d-border rounded-sheet p-[18px]">
    <div class="shrink-0 flex flex-col justify-center text-center pr-3.5 border-r border-d-border">
      <template v-if="reviewsCount > 0">
        <div class="text-rating-hero text-d-rating tnum leading-none">{{ rating.toFixed(1) }}</div>
        <div class="text-d-rating text-caption tracking-[2px] mt-1.5">{{ stars }}</div>
        <div class="text-[12px] text-d-text-hint mt-1.5">
          {{ countWithWord(reviewsCount, 'отзыв', 'отзыва', 'отзывов') }}
        </div>
      </template>
      <!-- оценок нет: называем это словом «новый», а не нулём -->
      <template v-else>
        <span
          class="inline-block px-2.5 py-1 rounded-full bg-d-accent/[0.16] text-d-accent text-[12px] font-bold"
          >Новый</span
        >
        <div class="text-[12px] text-d-text-hint mt-2">Оценок пока нет</div>
      </template>
    </div>
    <div v-if="bars.length && reviewsCount > 0" class="flex-1 flex flex-col justify-center gap-1.5">
      <div v-for="b in bars" :key="b.star" class="flex items-center gap-2">
        <span class="text-[11px] text-d-text-hint w-2 tnum">{{ b.star }}</span>
        <span class="flex-1 h-1.5 rounded-full bg-d-surface overflow-hidden">
          <span
            class="block h-full rounded-full bg-d-rating origin-left animate-d-growx"
            :style="{ width: b.pct, animationDelay: b.delay }"
          />
        </span>
      </div>
    </div>
  </div>
</template>
