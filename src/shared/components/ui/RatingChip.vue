<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** null/undefined — оценок ещё нет */
  rating?: number | null
}
const props = defineProps<Props>()

const hasRating = computed(() => props.rating != null && props.rating > 0)
</script>

<template>
  <!-- есть оценка — звезда с числом -->
  <span
    v-if="hasRating"
    class="flex items-center gap-1.5 bg-d-rating/[0.12] px-2.5 py-1 rounded-full"
  >
    <span class="text-d-rating text-[12px]">★</span>
    <span class="text-[12px] font-bold text-d-rating tnum">{{ rating!.toFixed(1) }}</span>
  </span>

  <!-- оценок нет: метка «Новый», а не ноль и не пустая звезда —
       ноль читается как плохая оценка, пустое место как ошибка загрузки -->
  <span
    v-else
    class="px-2.5 py-1 rounded-full bg-d-accent/[0.16] text-d-accent text-[12px] font-bold"
  >
    Новый
  </span>
</template>
