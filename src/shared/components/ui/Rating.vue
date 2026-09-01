<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  rating: number
  reviewsCount?: number
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showCount: true,
  readonly: true,
})

const emit = defineEmits<{
  'update:rating': [rating: number]
}>()

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

const textSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

const stars = computed(() => {
  return Array.from({ length: 5 }, (_, index) => ({
    index,
    filled: index < Math.floor(props.rating),
    half: index === Math.floor(props.rating) && props.rating % 1 > 0,
  }))
})

const handleStarClick = (starIndex: number) => {
  if (!props.readonly) {
    emit('update:rating', starIndex + 1)
  }
}
</script>

<template>
  <div class="flex items-center space-x-1">
    <div class="flex items-center">
      <svg
        v-for="star in stars"
        :key="star.index"
        :class="[
          sizeClasses[size],
          'cursor-pointer transition-colors',
          star.filled || star.half ? 'text-yellow-400' : 'text-gray-300',
        ]"
        fill="currentColor"
        viewBox="0 0 20 20"
        @click="handleStarClick(star.index)"
      >
        <path
          v-if="star.filled"
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        />
        <path
          v-else-if="star.half"
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          clip-path="inset(0 50% 0 0)"
        />
        <path
          v-else
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        />
      </svg>
    </div>

    <div v-if="showCount" class="flex items-center space-x-1">
      <span :class="[textSizeClasses[size], 'font-medium text-telegram-text']">
        {{ rating.toFixed(1) }}
      </span>
      <span v-if="reviewsCount" :class="[textSizeClasses[size], 'text-telegram-text-secondary']">
        ({{ reviewsCount }})
      </span>
    </div>
  </div>
</template>
