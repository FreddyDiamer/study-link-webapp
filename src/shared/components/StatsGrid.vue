<script setup lang="ts">
interface StatItem {
  label: string
  value: string | number
  icon: string
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'orange'
  trend?: {
    value: number
    isPositive: boolean
  }
}

interface Props {
  stats: StatItem[]
  columns?: 2 | 3 | 4
}

const props = withDefaults(defineProps<Props>(), {
  columns: 2,
})

const gridClasses = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
}

const colorClasses = {
  blue: 'bg-d-accent/15 text-d-accent',
  green: 'bg-d-teal/15 text-d-teal',
  yellow: 'bg-d-rating/15 text-d-rating',
  purple: 'bg-d-accent/15 text-d-accent',
  red: 'bg-d-coral/15 text-d-coral',
  orange: 'bg-d-rating/15 text-d-rating',
}
</script>

<template>
  <div :class="['grid gap-3', gridClasses[columns]]">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="bg-d-panel rounded-field p-4 border border-d-border"
    >
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <p class="text-subhead text-d-text-second mb-1">{{ stat.label }}</p>
          <p class="text-title-l font-bold text-d-text tnum">{{ stat.value }}</p>

          <div v-if="stat.trend" class="flex items-center mt-2">
            <svg
              :class="[
                'w-4 h-4 mr-1',
                stat.trend.isPositive ? 'text-d-teal' : 'text-d-coral',
              ]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                v-if="stat.trend.isPositive"
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
                stat.trend.isPositive ? 'text-d-teal' : 'text-d-coral',
              ]"
            >
              {{ stat.trend.isPositive ? '+' : '' }}{{ stat.trend.value }}%
            </span>
          </div>
        </div>

        <div
          :class="[
            'w-12 h-12 rounded-card flex items-center justify-center text-title-l',
            colorClasses[stat.color || 'blue'],
          ]"
        >
          {{ stat.icon }}
        </div>
      </div>
    </div>
  </div>
</template>
