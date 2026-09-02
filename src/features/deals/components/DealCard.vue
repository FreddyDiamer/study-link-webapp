<script setup lang="ts">
import { computed } from 'vue'
import { formatKopeks } from '@/shared/utils'
import { DealStatus, type Deal } from '@/shared/types'

export type DealRole = 'customer' | 'worker'

interface Props {
  deal: Deal
  /** роль текущего пользователя в этой сделке */
  role: DealRole
  busy?: boolean
}

const props = withDefaults(defineProps<Props>(), { busy: false })
const emit = defineEmits<{ complete: [deal: Deal]; cancel: [deal: Deal] }>()

const isCustomer = computed(() => props.role === 'customer')

// три статуса вместо пяти: PENDING и ACCEPTED неотличимы для человека
const isCancelled = computed(() => props.deal.status === DealStatus.CANCELLED)
const isDone = computed(() => props.deal.status === DealStatus.COMPLETED)
const isActive = computed(() => !isCancelled.value && !isDone.value)

const statusLabel = computed(() => {
  if (isCancelled.value) return 'Отменена'
  return isDone.value ? 'Завершена' : 'В работе'
})
const statusClass = computed(() => {
  if (isCancelled.value) return 'bg-d-coral/[0.16] text-d-coral'
  return isDone.value ? 'bg-d-teal/[0.16] text-d-teal' : 'bg-d-accent/[0.16] text-d-accent'
})

const roleTag = computed(() => (isCustomer.value ? 'Вы заказчик' : 'Вы исполнитель'))
const roleTagClass = computed(() =>
  isCustomer.value ? 'bg-d-rating/[0.14] text-d-rating' : 'bg-d-accent/[0.16] text-d-accent',
)

const counterparty = computed(() =>
  isCustomer.value
    ? `Репетитор: ${props.deal.tutor?.name || '—'}`
    : `Студент: ${props.deal.student?.name || '—'}`,
)

const moneyLabel = computed(() => (isCustomer.value ? 'Вы платите' : 'Вы получите'))
const moneyClass = computed(() => (isCustomer.value ? 'text-d-coral' : 'text-d-teal'))

const completeLabel = computed(() => (isCustomer.value ? 'Подтвердить выполнение' : 'Сдать работу'))

const steps = computed(() => [
  { key: 0, notLast: true, icon: isDone.value ? '✓' : '1', fill: isDone.value ? 1 : 0 },
  { key: 1, notLast: false, icon: isDone.value ? '✓' : '2', fill: 0 },
])
</script>

<template>
  <div class="reveal bg-d-panel border border-d-border rounded-sheet p-[18px] mb-3.5">
    <div class="flex items-center gap-[7px] mb-3">
      <span
        class="text-micro uppercase px-2.5 py-[3px] rounded-md transition-colors duration-300"
        :class="roleTagClass"
        >{{ roleTag }}</span
      >
      <span
        class="ml-auto text-[12px] font-bold px-[11px] py-1 rounded-full whitespace-nowrap transition-colors duration-300"
        :class="statusClass"
        >{{ statusLabel }}</span
      >
    </div>

    <div class="text-[18px] font-semibold leading-tight mb-1.5">
      {{ deal.subject?.name }} · {{ deal.teacher?.fullName }}
    </div>
    <div class="text-subhead text-d-text-hint mb-3.5">{{ counterparty }}</div>

    <div class="flex items-baseline gap-2 mb-5">
      <span class="text-caption text-d-text-hint">{{ moneyLabel }}</span>
      <span class="text-[20px] font-bold tnum" :class="moneyClass">
        {{ formatKopeks(deal.price) }}
      </span>
    </div>

    <!-- степпер: В работе → Завершена -->
    <template v-if="!isCancelled">
      <div class="flex items-center mb-2.5">
        <div
          v-for="st in steps"
          :key="st.key"
          class="flex items-center"
          :class="st.notLast ? 'flex-1' : 'shrink-0'"
        >
          <span
            class="shrink-0 w-[30px] h-[30px] rounded-chip flex items-center justify-center text-[13px] font-bold transition-all duration-300"
            :class="
              isDone
                ? 'bg-d-accent text-d-ink'
                : st.key === 0
                  ? 'bg-d-accent/[0.18] text-d-accent border-[1.5px] border-d-accent'
                  : 'text-d-text-hint border-[1.5px] border-d-border-soft'
            "
          >
            {{ st.icon }}
          </span>
          <span
            v-if="st.notLast"
            class="flex-1 h-[3px] mx-1.5 rounded-full bg-d-surface overflow-hidden"
          >
            <span
              class="block h-full bg-d-accent origin-left transition-transform duration-500 ease-d-spring"
              :style="{ transform: `scaleX(${st.fill})` }"
            />
          </span>
        </div>
      </div>
      <div class="flex justify-between text-micro uppercase text-d-text-hint">
        <span>В работе</span><span>Завершена</span>
      </div>
    </template>
  </div>

  <template v-if="isActive">
    <button
      class="press w-full h-[50px] rounded-[13px] bg-d-accent text-d-ink text-[15px] font-bold mb-2.5 disabled:opacity-40"
      :disabled="busy"
      @click="emit('complete', deal)"
    >
      {{ completeLabel }}
    </button>
    <button
      class="press w-full text-center text-subhead font-semibold text-d-coral py-2 mb-4 disabled:opacity-40"
      :disabled="busy"
      @click="emit('cancel', deal)"
    >
      Отменить сделку
    </button>
  </template>
</template>
