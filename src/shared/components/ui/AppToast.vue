<script setup lang="ts">
import { useToast } from '@/shared/composables'

const { message } = useToast()
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-200"
    leave-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="message"
      class="absolute top-2.5 left-4 right-4 z-50 flex items-center gap-2.5 bg-d-surface border border-d-border-soft rounded-[12px] px-4 py-3 text-subhead font-semibold shadow-d-toast animate-d-toastin"
      role="status"
    >
      <span
        class="shrink-0 w-[18px] h-[18px] rounded-full bg-d-accent text-d-ink flex items-center justify-center text-[12px] font-bold"
        >✓</span
      >
      {{ message }}
    </div>
  </Transition>
</template>
