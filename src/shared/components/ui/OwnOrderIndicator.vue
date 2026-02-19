<script setup lang="ts">
import { computed } from 'vue'
import Tooltip from './Tooltip.vue'

interface Props {
  text: string
  size?: 'sm' | 'md' | 'lg'
  color?: string
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'text-yellow-600',
  tooltipPosition: 'top',
})

const iconSizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

const iconSize = computed(() => iconSizeClasses[props.size])
</script>

<template>
  <Tooltip :text="text" :position="tooltipPosition">
    <div class="flex items-center justify-center cursor-help shrink-0" :class="color">
      <svg :class="iconSize" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  </Tooltip>
</template>
