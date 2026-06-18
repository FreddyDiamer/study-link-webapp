<script setup lang="ts">
export type MarketSeg = 'services' | 'requests'

const model = defineModel<MarketSeg>({ required: true })

const segments: { id: MarketSeg; label: string }[] = [
  { id: 'services', label: 'Услуги' },
  { id: 'requests', label: 'Заявки' },
]
</script>

<template>
  <div
    class="relative flex h-11 p-1 bg-d-panel border border-d-border rounded-field"
  >
    <span
      class="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-chip bg-d-accent transition-transform duration-300 ease-d-spring"
      :style="{ transform: model === 'services' ? 'translateX(0)' : 'translateX(100%)' }"
    />
    <button
      v-for="seg in segments"
      :key="seg.id"
      class="relative z-[2] flex-1 flex items-center justify-center text-subhead font-semibold transition-colors duration-200"
      :class="model === seg.id ? 'text-d-ink' : 'text-d-text-second'"
      @click="model = seg.id"
    >
      {{ seg.label }}
    </button>
  </div>
</template>
