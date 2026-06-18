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
    destructive: 'btn-destructive',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-subhead',
    md: 'px-4 py-2.5 text-body',
    lg: 'h-[52px] px-6 text-body rounded-[13px]',
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
