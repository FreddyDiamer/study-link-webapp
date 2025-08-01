<script setup lang="ts">
interface Props {
  totalTutors: number
  totalServices: number
  activeSubjects: number
  totalRequests?: number
}

const props = withDefaults(defineProps<Props>(), {
  totalRequests: 0,
})

const stats = [
  {
    label: 'Репетиторов',
    value: props.totalTutors,
    icon: '👨‍🏫',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    label: 'Услуг',
    value: props.totalServices,
    icon: '📚',
    color: 'bg-green-50 text-green-600',
  },
  {
    label: 'Предметов',
    value: props.activeSubjects,
    icon: '📖',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    label: 'Заявок',
    value: props.totalRequests,
    icon: '📋',
    color: 'bg-yellow-50 text-yellow-600',
  },
]
</script>

<template>
  <div class="grid grid-cols-2 gap-3">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="bg-telegram-card rounded-xl p-4 border border-telegram-border"
    >
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <p class="text-sm text-telegram-textSecondary mb-1">{{ stat.label }}</p>
          <p class="text-2xl font-bold text-telegram-text">{{ stat.value }}</p>
        </div>

        <div :class="['w-12 h-12 rounded-lg flex items-center justify-center text-xl', stat.color]">
          {{ stat.icon }}
        </div>
      </div>
    </div>
  </div>
</template>
