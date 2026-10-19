<script setup lang="ts">
import { useId } from 'vue'

interface Props {
  label: string
  /** выбранное значение; пусто — показываем placeholder */
  value?: string
  placeholder: string
  required?: boolean
  disabled?: boolean
  /** крестик сброса: выбор в паре полей сужает соседнее, сброс снимает это ограничение */
  clearable?: boolean
}
withDefaults(defineProps<Props>(), {
  value: '',
  required: false,
  disabled: false,
  clearable: false,
})

const emit = defineEmits<{ open: []; clear: [] }>()

const id = useId()
</script>

<template>
  <div>
    <label :for="id" class="block text-overline uppercase text-d-text-second mb-2.5">
      {{ label }} <span v-if="required" class="text-d-act">*</span>
    </label>
    <div class="relative">
      <button
        :id="id"
        type="button"
        aria-haspopup="dialog"
        class="press w-full flex items-center h-[54px] rounded-[12px] bg-d-panel border border-d-border-soft pl-4 pr-11 text-body text-left focus:border-d-act focus:outline-none transition-colors disabled:opacity-60"
        :disabled="disabled"
        @click="emit('open')"
      >
        <span class="truncate" :class="value ? 'text-d-text' : 'text-d-text-hint'">
          {{ value || placeholder }}
        </span>
      </button>
      <button
        v-if="clearable && value && !disabled"
        type="button"
        class="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-d-text-hint text-[18px]"
        :aria-label="`Сбросить: ${label}`"
        @click="emit('clear')"
      >
        ✕
      </button>
      <span
        v-else
        class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-d-text-hint"
        aria-hidden="true"
        >›</span
      >
    </div>
  </div>
</template>
