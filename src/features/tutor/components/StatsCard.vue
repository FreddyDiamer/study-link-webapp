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
  blue: 'bg-d-accent/15 text-d-accent',
  green: 'bg-d-teal/15 text-d-teal',
  yellow: 'bg-d-rating/15 text-d-rating',
  purple: 'bg-d-accent/15 text-d-accent',
  red: 'bg-d-coral/15 text-d-coral',
}
</script>

<template>
  <div class="bg-d-panel rounded-field p-4 border border-d-border">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-subhead text-d-text-second mb-1">{{ title }}</p>
        <p class="text-title-l font-bold text-d-text tnum">{{ value }}</p>

        <div v-if="trend" class="flex items-center mt-2">
          <svg
            :class="['w-4 h-4 mr-1', trend.isPositive ? 'text-d-teal' : 'text-d-coral']"
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
            :class="[
              'text-caption font-medium tnum',
              trend.isPositive ? 'text-d-teal' : 'text-d-coral',
            ]"
          >
            {{ trend.isPositive ? '+' : '' }}{{ trend.value }}%
          </span>
        </div>
      </div>

      <div
        :class="[
          'w-12 h-12 rounded-field flex items-center justify-center text-title-m',
          colorClasses[color],
        ]"
      >
        {{ icon }}
      </div>
    </div>
  </div>
</template>
