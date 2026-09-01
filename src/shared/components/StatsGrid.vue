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
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  purple: 'bg-purple-50 text-purple-600',
  red: 'bg-red-50 text-red-600',
  orange: 'bg-orange-50 text-orange-600',
}
</script>

<template>
  <div :class="['grid gap-3', gridClasses[columns]]">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="bg-telegram-card rounded-xl p-4 border border-telegram-border"
    >
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <p class="text-sm text-telegram-text-secondary mb-1">{{ stat.label }}</p>
          <p class="text-2xl font-bold text-telegram-text">{{ stat.value }}</p>

          <div v-if="stat.trend" class="flex items-center mt-2">
            <svg
              :class="['w-4 h-4 mr-1', stat.trend.isPositive ? 'text-green-500' : 'text-red-500']"
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
                'text-xs font-medium',
                stat.trend.isPositive ? 'text-green-600' : 'text-red-600',
              ]"
            >
              {{ stat.trend.isPositive ? '+' : '' }}{{ stat.trend.value }}%
            </span>
          </div>
        </div>

        <div
          :class="[
            'w-12 h-12 rounded-lg flex items-center justify-center text-xl',
            colorClasses[stat.color || 'blue'],
          ]"
        >
          {{ stat.icon }}
        </div>
      </div>
    </div>
  </div>
</template>
