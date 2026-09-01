<script setup lang="ts">
interface Props {
  title: string
  value: string | number
  icon: string
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue',
})

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  purple: 'bg-purple-50 text-purple-600',
  red: 'bg-red-50 text-red-600',
}
</script>

<template>
  <div class="bg-telegram-card rounded-xl p-4 border border-telegram-border">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-sm text-telegram-text-secondary mb-1">{{ title }}</p>
        <p class="text-2xl font-bold text-telegram-text">{{ value }}</p>

        <div v-if="trend" class="flex items-center mt-2">
          <svg
            :class="['w-4 h-4 mr-1', trend.isPositive ? 'text-green-500' : 'text-red-500']"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              v-if="trend.isPositive"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
            />
          </svg>
          <span
            :class="['text-xs font-medium', trend.isPositive ? 'text-green-600' : 'text-red-600']"
          >
            {{ trend.isPositive ? '+' : '' }}{{ trend.value }}%
          </span>
        </div>
      </div>

      <div
        :class="[
          'w-12 h-12 rounded-lg flex items-center justify-center text-xl',
          colorClasses[color],
        ]"
      >
        {{ icon }}
      </div>
    </div>
  </div>
</template>
