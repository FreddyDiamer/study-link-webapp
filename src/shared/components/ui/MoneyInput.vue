<script setup lang="ts">
interface Props {
  placeholder?: string
}
withDefaults(defineProps<Props>(), { placeholder: '0' })

/** значение в рублях; конверсия в копейки — на отправке, в бизнес-слое суммы уже копеечные */
const model = defineModel<string>({ required: true })
</script>

<template>
  <div
    class="flex items-center h-[52px] rounded-[12px] bg-d-panel border border-d-border-soft px-4 focus-within:border-d-act transition-colors"
  >
    <span class="text-body text-d-text-hint">₽</span>
    <input
      v-model="model"
      type="number"
      inputmode="numeric"
      min="0"
      :placeholder="placeholder"
      class="flex-1 min-w-0 bg-transparent text-right text-[20px] font-bold tnum focus:outline-none placeholder:text-d-text-hint placeholder:font-normal"
    />
  </div>
</template>
