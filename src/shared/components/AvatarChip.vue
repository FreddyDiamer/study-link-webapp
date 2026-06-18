<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), { size: 'md' })

// квадратный аватар-чип с инициалами и тёмным текстом (Defiant)
const palette = ['bg-d-accent', 'bg-d-teal', 'bg-d-rating', 'bg-d-coral']

const initials = computed(() => {
  const parts = (props.name || '?').trim().split(/\s+/).slice(0, 2)
  return parts.map((p) => p.charAt(0).toUpperCase()).join('')
})

const colorClass = computed(() => {
  const str = props.name || ''
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  return palette[hash % palette.length]
})

const sizeClass = computed(
  () =>
    ({
      sm: 'w-6 h-6 rounded-[7px] text-[10px]',
      md: 'w-[30px] h-[30px] rounded-chip text-[12px]',
      lg: 'w-[54px] h-[54px] rounded-card text-[19px]',
      xl: 'w-[60px] h-[60px] rounded-avatar text-[21px]',
    })[props.size],
)
</script>

<template>
  <span
    class="shrink-0 inline-flex items-center justify-center font-bold text-d-ink"
    :class="[colorClass, sizeClass]"
  >
    {{ initials }}
  </span>
</template>
