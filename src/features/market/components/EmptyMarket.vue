<script setup lang="ts">
import { ROLE_META, type Role } from '@/shared/constants'

interface Props {
  title: string
  text: string
  primaryLabel: string
  secondaryLabel?: string
  /** в какой роли совершается главное действие — его цвет */
  role: Role
}
defineProps<Props>()

const emit = defineEmits<{ primary: []; secondary: [] }>()
</script>

<template>
  <!-- пустой сегмент — лучшее место для приглашения на другую сторону сделки -->
  <!-- «Смотреть услуги/заявки» ведёт в ту же роль, что и главное действие -->
  <div
    class="reveal flex flex-col items-center text-center px-5 pt-12 pb-5"
    :class="ROLE_META[role].scope"
  >
    <div
      class="w-14 h-14 rounded-full bg-d-panel border border-d-border flex items-center justify-center mb-4 text-d-act text-[26px] font-light"
    >
      +
    </div>
    <div class="text-[16px] font-semibold mb-2">{{ title }}</div>
    <p class="text-subhead text-d-text-hint mb-5">{{ text }}</p>

    <button
      class="press w-full h-[50px] rounded-[13px] bg-d-act text-d-ink text-[15px] font-bold mb-2"
      @click="emit('primary')"
    >
      {{ primaryLabel }}
    </button>
    <button
      v-if="secondaryLabel"
      class="press text-subhead font-semibold text-d-act py-2"
      @click="emit('secondary')"
    >
      {{ secondaryLabel }}
    </button>
  </div>
</template>
