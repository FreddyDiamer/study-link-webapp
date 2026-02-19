<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'pending' | 'success' | 'error' | 'warning' | 'info' | 'neutral'
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  size: 'sm',
})

const chipClasses = computed(() => {
  const baseClasses = 'inline-flex items-center font-medium'

  const variantClasses = {
    pending: 'bg-yellow-500/20 text-yellow-600',
    success: 'bg-telegram-success/20 text-telegram-success',
    error: 'bg-red-500/20 text-red-600',
    warning: 'bg-orange-500/20 text-orange-600',
    info: 'bg-telegram-accent/20 text-telegram-accent',
    neutral: 'bg-telegram-textSecondary/20 text-telegram-textSecondary',
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  }

  return `${baseClasses} ${variantClasses[props.variant]} ${sizeClasses[props.size]}`
})
</script>

<template>
  <span :class="chipClasses">
    <slot />
  </span>
</template>
