<script setup lang="ts">
import { computed } from 'vue'
import { StatusBadge } from '@/shared/components/ui'
import { useAuthStore } from '@/stores'
import { DealStatus, type Deal } from '@/shared/types'

interface Props {
  deal: Deal
}
const props = defineProps<Props>()
const emit = defineEmits<{ advance: [deal: Deal] }>()

const auth = useAuthStore()

const formatPrice = (kopeks: number) =>
  `${Math.round(kopeks / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₽`

const counterparty = computed(() => {
  const isStudent = props.deal.student?.id === auth.user?.id
  return (isStudent ? props.deal.tutor?.name : props.deal.student?.name) || '—'
})

const ORDER = [
  DealStatus.PENDING,
  DealStatus.ACCEPTED,
  DealStatus.IN_PROGRESS,
  DealStatus.COMPLETED,
]

const isCancelled = computed(() => props.deal.status === DealStatus.CANCELLED)
const currentIndex = computed(() => ORDER.indexOf(props.deal.status))
const completed = computed(() => props.deal.status === DealStatus.COMPLETED)

const steps = computed(() =>
  ORDER.map((_, i) => {
    const done = i < currentIndex.value
    const active = i === currentIndex.value
    const last = i === ORDER.length - 1
    return {
      key: i,
      done,
      active,
      notLast: !last,
      icon: done ? '✓' : String(i + 1),
      fill: i < currentIndex.value ? 1 : 0,
    }
  }),
)

const advLabel = computed(
  () =>
    ({
      [DealStatus.PENDING]: 'Подтвердить',
      [DealStatus.ACCEPTED]: 'Перевести в работу',
      [DealStatus.IN_PROGRESS]: 'Завершить сделку',
      [DealStatus.COMPLETED]: '✓ Сделка завершена',
      [DealStatus.CANCELLED]: 'Отменена',
    })[props.deal.status],
)
</script>

<template>
  <div class="reveal bg-d-panel border border-d-border rounded-sheet p-[18px] mb-4">
    <div class="flex items-start justify-between mb-2">
      <div class="text-[18px] font-semibold leading-tight">
        {{ deal.subject?.name }}<br />{{ deal.teacher?.fullName }}
      </div>
      <StatusBadge :deal="deal.status" />
    </div>
    <div class="text-subhead text-d-text-hint mb-5">
      с {{ counterparty }} ·
      <span class="text-d-text font-semibold tnum">{{ formatPrice(deal.price) }}</span>
    </div>

    <!-- animated stepper (happy path only) -->
    <template v-if="!isCancelled">
      <div class="flex items-center mb-2">
        <div
          v-for="st in steps"
          :key="st.key"
          class="flex items-center"
          :class="st.notLast ? 'flex-1' : 'shrink-0'"
        >
          <span
            class="shrink-0 w-[30px] h-[30px] rounded-chip flex items-center justify-center text-[13px] font-bold transition-all duration-300"
            :class="
              st.done
                ? 'bg-d-accent text-d-ink'
                : st.active
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
        <span>Создана</span><span>Завершена</span>
      </div>
    </template>
  </div>

  <button
    v-if="!isCancelled"
    class="press w-full h-[50px] rounded-[13px] text-[15px] font-bold mb-4 disabled:cursor-default"
    :class="completed ? 'bg-d-panel text-d-teal' : 'bg-d-accent text-d-ink'"
    :disabled="completed"
    @click="emit('advance', deal)"
  >
    {{ advLabel }}
  </button>
</template>
