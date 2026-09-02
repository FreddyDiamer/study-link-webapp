<script setup lang="ts">
import { computed } from 'vue'
import AvatarChip from './AvatarChip.vue'

interface Props {
  author: string
  rating: number
  text?: string
  // компактный вид для профиля (разделён хайрлайном, без карточки)
  bare?: boolean
  // «исполнитель» / «заказчик» — за какую роль оставлен отзыв
  role?: 'tutor' | 'student'
}

const props = withDefaults(defineProps<Props>(), { bare: false })

const stars = computed(() => {
  const f = Math.round(props.rating)
  return '★★★★★'.slice(0, f) + '☆☆☆☆☆'.slice(0, 5 - f)
})
</script>

<template>
  <div
    :class="
      bare
        ? 'border-t border-d-border pt-3 mt-3'
        : 'bg-d-panel border border-d-border rounded-[13px] p-3.5'
    "
  >
    <div class="flex items-center gap-2 mb-1.5">
      <AvatarChip :name="author" size="sm" />
      <span class="text-caption font-semibold">{{ author }}</span>
      <span
        v-if="role"
        class="text-[9px] font-bold px-[7px] py-0.5 rounded-[5px]"
        :class="
          role === 'tutor' ? 'bg-d-accent/[0.16] text-d-accent' : 'bg-d-teal/[0.16] text-d-teal'
        "
        >{{ role === 'tutor' ? 'исполнитель' : 'заказчик' }}</span
      >
      <span class="ml-auto text-d-rating text-[12px] tracking-[1px]">{{ stars }}</span>
    </div>
    <p v-if="text" class="text-review" :class="bare ? 'text-d-text-second' : 'text-d-text-bright'">
      {{ text }}
    </p>
  </div>
</template>
