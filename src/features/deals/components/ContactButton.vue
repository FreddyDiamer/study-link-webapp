<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
  username?: string | null
  /** главное действие до того, как договорились */
  primary?: boolean
}
const props = withDefaults(defineProps<Props>(), { primary: false })
const emit = defineEmits<{ open: [] }>()

const url = computed(() => (props.username ? `https://t.me/${props.username}` : ''))
</script>

<template>
  <!-- своего чата нет: договариваются в Telegram, мы держим статус -->
  <a
    v-if="url"
    :href="url"
    target="_blank"
    rel="noopener"
    class="press flex items-center justify-center gap-2 rounded-[13px] font-bold"
    :class="
      primary
        ? 'h-[50px] bg-d-act text-d-ink text-[15px]'
        : 'h-11 bg-d-surface border border-d-border-soft text-d-text text-subhead'
    "
    @click="emit('open')"
  >
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="currentColor"
      :class="primary ? '' : 'text-d-act'"
    >
      <path
        d="M21.9 5.1 18.9 19c-.2 1-.8 1.2-1.7.8l-4.6-3.4-2.2 2.1c-.3.3-.5.5-.9.5l.3-4.6L18.2 7c.4-.3-.1-.5-.6-.2L7.3 13.3l-4.5-1.4c-1-.3-1-1 .2-1.5l17.6-6.8c.8-.3 1.5.2 1.3 1.5Z"
      />
    </svg>
    Написать {{ name }}
  </a>

  <!-- кнопка не исчезает, а объясняет себя: иначе человек решит, что продукт сломался -->
  <div v-else>
    <div class="bg-d-panel border border-d-border rounded-[13px] px-4 py-3.5 mb-2.5">
      <div class="text-subhead font-semibold mb-1">У {{ name }} не открыт username</div>
      <div class="text-caption text-d-text-hint">
        Написать из Study Link нельзя. Как только username появится, кнопка заработает.
      </div>
    </div>
    <div
      class="h-11 rounded-[13px] bg-d-surface border border-d-border-soft text-d-text-hint text-subhead font-semibold flex items-center justify-center opacity-60"
    >
      Написать нельзя
    </div>
  </div>
</template>
