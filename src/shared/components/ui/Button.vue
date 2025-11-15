<script setup lang="ts">
import { computed } from 'vue'
import { Loader } from '.'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
})

defineEmits<{
  click: [event: Event]
}>()

const buttonClasses = computed(() => {
  const baseClasses = 'btn'

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    destructive: 'bg-telegram-destructive text-white hover:bg-red-600',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base font-semibold',
    lg: 'px-6 py-3 text-lg font-semibold',
  }

  const disabledClasses = props.disabled ? 'opacity-50 cursor-not-allowed' : ''

  return `${baseClasses} ${variantClasses[props.variant]} ${sizeClasses[props.size]} ${disabledClasses}`
})
</script>

<template>
  <button :class="buttonClasses" :disabled="disabled || loading" @click="$emit('click', $event)">
    <div class="w-0">
      <Loader class="size-5 opacity-0" :class="{ 'opacity-100': loading }" />
    </div>

    <slot />
  </button>
</template>
