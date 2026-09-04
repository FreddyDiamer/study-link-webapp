<script setup lang="ts">
interface Reputation {
  rating: number
  count: number
}

interface Props {
  /** репутация исполнителя и заказчика — в макете они равноправны */
  tutor: Reputation
  student: Reputation
}
defineProps<Props>()

const stars = (rating: number) => {
  const filled = Math.round(rating)
  return '★★★★★'.slice(0, filled) + '☆☆☆☆☆'.slice(0, 5 - filled)
}

const reviewsWord = (n: number) => {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 14) return 'отзывов'
  if (mod10 === 1) return 'отзыв'
  if (mod10 >= 2 && mod10 <= 4) return 'отзыва'
  return 'отзывов'
}
</script>

<template>
  <div class="flex gap-2.5">
    <div class="flex-1 bg-d-panel border border-d-border rounded-[14px] p-[15px]">
      <div class="text-micro uppercase text-d-accent mb-2.5">Исполнитель</div>
      <template v-if="tutor.count > 0">
        <div class="text-[28px] font-bold text-d-rating leading-none tnum">
          {{ tutor.rating.toFixed(1) }}
        </div>
        <div class="text-d-rating text-[11px] tracking-[1px] mt-1.5">{{ stars(tutor.rating) }}</div>
        <div class="text-[11px] text-d-text-hint mt-1.5">
          {{ tutor.count }} {{ reviewsWord(tutor.count) }}
        </div>
      </template>
      <template v-else>
        <span
          class="inline-block px-2.5 py-1 rounded-full bg-d-accent/[0.16] text-d-accent text-[12px] font-bold"
          >Новый</span
        >
        <div class="text-[11px] text-d-text-hint mt-2">Ещё нет оценок</div>
      </template>
    </div>

    <div class="flex-1 bg-d-panel border border-d-border rounded-[14px] p-[15px]">
      <div class="text-micro uppercase text-d-teal mb-2.5">Заказчик</div>
      <template v-if="student.count > 0">
        <div class="text-[28px] font-bold text-d-rating leading-none tnum">
          {{ student.rating.toFixed(1) }}
        </div>
        <div class="text-d-rating text-[11px] tracking-[1px] mt-1.5">
          {{ stars(student.rating) }}
        </div>
        <div class="text-[11px] text-d-text-hint mt-1.5">
          {{ student.count }} {{ reviewsWord(student.count) }}
        </div>
      </template>
      <template v-else>
        <span
          class="inline-block px-2.5 py-1 rounded-full bg-d-teal/[0.16] text-d-teal text-[12px] font-bold"
          >Новый</span
        >
        <div class="text-[11px] text-d-text-hint mt-2">Ещё нет оценок</div>
      </template>
    </div>
  </div>
</template>
