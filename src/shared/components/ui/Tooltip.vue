<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top',
})

const showTooltip = ref(false)

const positionClasses = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
}

const arrowClasses = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-telegram-secondary border-l-transparent border-r-transparent border-b-transparent',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-telegram-secondary border-l-transparent border-r-transparent border-t-transparent',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-telegram-secondary border-t-transparent border-b-transparent border-r-transparent',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-telegram-secondary border-t-transparent border-b-transparent border-l-transparent',
}
</script>

<template>
  <div
    class="relative inline-flex items-center justify-center"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
  >
    <slot />
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="showTooltip"
        :class="[
          'absolute z-50 px-3 py-2 bg-telegram-secondary text-telegram-text text-xs font-medium rounded-lg shadow-lg whitespace-nowrap pointer-events-none',
          positionClasses[position],
        ]"
      >
        {{ text }}
        <div
          :class="[
            'absolute w-0 h-0 border-4',
            arrowClasses[position],
          ]"
        ></div>
      </div>
    </Transition>
  </div>
</template>
