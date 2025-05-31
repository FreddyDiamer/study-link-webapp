<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'gradient' | 'hover'
  padding?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
})

const cardClasses = computed(() => {
  const baseClasses = 'card'

  const variantClasses = {
    default: '',
    gradient: 'card-gradient',
    hover: 'card-hover',
  }

  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }

  return `${baseClasses} ${variantClasses[props.variant]} ${paddingClasses[props.padding]}`
})
</script>
