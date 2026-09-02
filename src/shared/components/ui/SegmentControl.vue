<script setup lang="ts" generic="T extends string">
interface Props {
  /** ровно два сегмента — как во всех переключателях макета */
  items: readonly { id: T; label: string }[]
}
const props = defineProps<Props>()

const model = defineModel<T>({ required: true })
</script>

<template>
  <div class="relative flex h-11 p-1 bg-d-panel border border-d-border rounded-field">
    <span
      class="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-chip bg-d-accent transition-transform duration-300 ease-d-spring"
      :style="{ transform: model === props.items[0]?.id ? 'translateX(0)' : 'translateX(100%)' }"
    />
    <button
      v-for="item in items"
      :key="item.id"
      class="relative z-[2] flex-1 flex items-center justify-center text-subhead font-semibold transition-colors duration-200"
      :class="model === item.id ? 'text-d-ink' : 'text-d-text-second'"
      @click="model = item.id"
    >
      {{ item.label }}
    </button>
  </div>
</template>
