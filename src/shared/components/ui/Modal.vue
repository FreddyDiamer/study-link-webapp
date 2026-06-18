<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
  closable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: 'md',
  closable: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const handleClose = () => {
  if (props.closable) {
    emit('update:modelValue', false)
  }
}

const handleOverlayClick = (event: Event) => {
  if (event.target === event.currentTarget) {
    handleClose()
  }
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        @click="handleOverlayClick"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div
            v-if="modelValue"
            :class="[
              'w-full bg-d-panel border border-d-border rounded-card shadow-d-toast',
              maxWidthClasses[maxWidth],
            ]"
          >
            <!-- Header -->
            <div v-if="title || closable" class="flex items-center justify-between p-6 pb-4">
              <h3 v-if="title" class="text-title-m text-d-text">
                {{ title }}
              </h3>
              <button
                v-if="closable"
                @click="handleClose"
                class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-d-surface transition-colors"
              >
                <svg
                  class="w-5 h-5 text-d-text-second"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Content -->
            <div class="px-6 pb-6">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="px-6 py-4 border-t border-d-border">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
