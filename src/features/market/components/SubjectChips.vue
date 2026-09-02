<script setup lang="ts">
import { computed } from 'vue'
import { useEducation } from '@/shared/composables'

/** '' — «Все»; иначе id предмета */
const model = defineModel<string>({ required: true })

const { activeSubjects } = useEducation()

const chips = computed(() => [
  { id: '', name: 'Все' },
  ...activeSubjects.value.map((s) => ({ id: s.id, name: s.name })),
])
</script>

<template>
  <div class="flex gap-2 overflow-x-auto -mx-[18px] px-[18px] py-0.5">
    <button
      v-for="chip in chips"
      :key="chip.id || 'all'"
      class="press shrink-0 px-3.5 py-2 rounded-full text-caption font-semibold whitespace-nowrap transition-colors duration-200"
      :class="model === chip.id ? 'bg-d-accent text-d-ink' : 'bg-d-panel text-d-text-second'"
      @click="model = chip.id"
    >
      {{ chip.name }}
    </button>
  </div>
</template>
