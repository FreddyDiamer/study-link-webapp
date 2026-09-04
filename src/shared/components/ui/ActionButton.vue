<script setup lang="ts">
interface Props {
  /** идёт запрос — вместо подписи крутится спиннер, ширина не прыгает */
  loading?: boolean
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}
withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
  variant: 'primary',
})

const emit = defineEmits<{ click: [] }>()
</script>

<template>
  <button
    class="press relative w-full h-[52px] rounded-[13px] text-body font-bold transition-opacity disabled:opacity-40"
    :class="
      variant === 'primary'
        ? 'bg-d-accent text-d-ink'
        : 'bg-d-surface border border-d-border-soft text-d-text'
    "
    :disabled="disabled || loading"
    @click="emit('click')"
  >
    <!-- подпись остаётся в потоке и держит ширину, спиннер ложится поверх -->
    <span class="transition-opacity duration-150" :class="loading ? 'opacity-0' : 'opacity-100'">
      <slot />
    </span>
    <span
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center"
      aria-hidden="true"
    >
      <span
        class="w-[18px] h-[18px] rounded-full border-2 border-current/30 border-t-current animate-d-spin"
      />
    </span>
  </button>
</template>
