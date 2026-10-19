<script setup lang="ts">
interface Props {
  /** причина, по которой форма не отправилась; пусто — блока нет */
  message?: string
}
withDefaults(defineProps<Props>(), { message: '' })
</script>

<template>
  <!-- у кнопки, а не модальным окном: человек видит причину и всё, что уже ввёл -->
  <Transition
    enter-active-class="transition-[opacity,transform] duration-200"
    enter-from-class="opacity-0 translate-y-1"
    leave-active-class="transition-opacity duration-150"
    leave-to-class="opacity-0"
  >
    <div
      v-if="message"
      role="alert"
      class="flex gap-2.5 items-start rounded-[12px] bg-d-coral/[0.12] border border-d-coral/30 px-3.5 py-3 mb-3"
    >
      <span
        class="shrink-0 w-5 h-5 rounded-full bg-d-coral text-d-ink text-[12px] font-bold flex items-center justify-center mt-px"
        aria-hidden="true"
        >!</span
      >
      <p class="text-subhead text-d-text">{{ message }}</p>
    </div>
  </Transition>
</template>
