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
    color: 'bg-d-accent/15 text-d-accent',
  },
  {
    label: 'Услуг',
    value: props.totalServices,
    icon: '📚',
    color: 'bg-d-teal/15 text-d-teal',
  },
  {
    label: 'Предметов',
    value: props.activeSubjects,
    icon: '📖',
    color: 'bg-d-accent/15 text-d-accent',
  },
  {
    label: 'Заявок',
    value: props.totalRequests,
    icon: '📋',
    color: 'bg-d-rating/15 text-d-rating',
  },
]
</script>

<template>
  <div class="grid grid-cols-2 gap-3">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="bg-d-panel rounded-field p-4 border border-d-border"
    >
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <p class="text-subhead text-d-text-second mb-1">{{ stat.label }}</p>
          <p class="text-title-l font-bold text-d-text tnum">{{ stat.value }}</p>
        </div>

        <div
          :class="['w-12 h-12 rounded-field flex items-center justify-center text-title-m', stat.color]"
        >
          {{ stat.icon }}
        </div>
      </div>
    </div>
  </div>
</template>
