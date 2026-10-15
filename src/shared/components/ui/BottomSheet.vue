<script setup lang="ts">
interface Props {
  title?: string
  sub?: string
  /** ограничить высоту листа (список групп в макете скроллится внутри) */
  scrollable?: boolean
  /** постоянная высота: лист с поиском не должен прыгать, пока список фильтруется */
  tall?: boolean
}

withDefaults(defineProps<Props>(), { scrollable: false, tall: false })

const open = defineModel<boolean>({ required: true })

const close = () => {
  open.value = false
}
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-200"
    leave-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div v-if="open" class="absolute inset-0 z-50">
      <div class="absolute inset-0 bg-black/60" @click="close" />

      <div
        class="absolute left-0 right-0 bottom-0 bg-d-panel border-t border-d-border rounded-t-[20px] px-[18px] pt-2.5 pb-6 animate-d-sheetup flex flex-col"
        :class="tall ? 'h-[70%]' : scrollable ? 'max-h-[70%]' : ''"
      >
        <span class="shrink-0 w-[38px] h-1 rounded-full bg-d-border-soft mx-auto mb-3.5" />
        <div v-if="title" class="shrink-0 text-[17px] font-bold" :class="sub ? 'mb-1' : 'mb-3.5'">
          {{ title }}
        </div>
        <div v-if="sub" class="shrink-0 text-caption text-d-text-hint mb-4">{{ sub }}</div>

        <!-- не скроллится вместе со списком: поиск остаётся под рукой -->
        <div v-if="$slots.header" class="shrink-0 mb-2">
          <slot name="header" />
        </div>

        <div :class="scrollable || tall ? 'min-h-0 overflow-y-auto flex flex-col' : ''">
          <slot />
        </div>
      </div>
    </div>
  </Transition>
</template>
