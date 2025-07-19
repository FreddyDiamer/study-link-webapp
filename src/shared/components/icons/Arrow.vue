<script setup lang="ts">
withDefaults(
  defineProps<{
    direction?: 'left' | 'right' | 'up' | 'down'
  }>(),
  {
    direction: 'down',
  },
)
</script>

<template>
  <svg
    class="size-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    :class="{
      'rotate-90': direction === 'left',
      'rotate-180': direction === 'up',
      '-rotate-90': direction === 'right',
      'rotate-0': direction === 'down',
    }"
  >
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
  </svg>
</template>
