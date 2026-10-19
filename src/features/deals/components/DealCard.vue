<script setup lang="ts">
import { computed } from 'vue'
import { formatDayMonth, formatKopeks } from '@/shared/utils'
import { DealStatus, type Deal } from '@/shared/types'
import { ROLE_META } from '@/shared/constants'
import DealChecklist from './DealChecklist.vue'
import ContactButton from './ContactButton.vue'
import DealReviews from './DealReviews.vue'

export type DealRole = 'customer' | 'worker'

interface Props {
  deal: Deal
  /** роль текущего пользователя в этой сделке */
  role: DealRole
  /** уже писали собеседнику — приоритет переходит к подтверждению */
  contacted?: boolean
  busy?: boolean
}

const props = withDefaults(defineProps<Props>(), { contacted: false, busy: false })
const emit = defineEmits<{
  confirm: [deal: Deal]
  cancel: [deal: Deal]
  contact: [deal: Deal]
  reopen: [deal: Deal]
  reviewed: []
}>()

const isCustomer = computed(() => props.role === 'customer')

const isCancelled = computed(() => props.deal.status === DealStatus.CANCELLED)
const isDone = computed(() => props.deal.status === DealStatus.COMPLETED)
const isActive = computed(() => !isCancelled.value && !isDone.value)

const myConfirmedAt = computed(() =>
  isCustomer.value ? props.deal.studentConfirmedAt : props.deal.tutorConfirmedAt,
)
const theirConfirmedAt = computed(() =>
  isCustomer.value ? props.deal.tutorConfirmedAt : props.deal.studentConfirmedAt,
)
const iConfirmed = computed(() => !!myConfirmedAt.value)
const waitingForThem = computed(() => isActive.value && iConfirmed.value)

// сделку закрыл таймер: вторая сторона так и не отметилась
const closedByTimeout = computed(() => isDone.value && !theirConfirmedAt.value)

const counterparty = computed(() => (isCustomer.value ? props.deal.tutor : props.deal.student))
const theirName = computed(() => counterparty.value?.name || '—')

// вторая сторона отметилась, я ещё нет — работа могла и не быть готовой
const theyConfirmedFirst = computed(
  () => isActive.value && !!theirConfirmedAt.value && !iConfirmed.value,
)

// до первого сообщения главное — договориться, а не жать подтверждение
const needsContact = computed(
  () => isActive.value && !props.contacted && !iConfirmed.value && !theyConfirmedFirst.value,
)

const statusLabel = computed(() => {
  if (isCancelled.value) return 'Отменена'
  if (isDone.value) return 'Завершена'
  if (waitingForThem.value) return `Ждём ${theirName.value}`
  return needsContact.value ? 'Договоритесь' : 'В работе'
})
const statusClass = computed(() => {
  if (isCancelled.value) return 'bg-d-coral/[0.16] text-d-coral'
  if (isDone.value) return 'bg-d-teal/[0.16] text-d-teal'
  return 'bg-d-accent/[0.16] text-d-accent'
})

const roleTag = computed(() => ROLE_META[props.role].you)
const roleTagClass = computed(() => ROLE_META[props.role].soft)

const counterpartyLine = computed(() =>
  isCustomer.value ? `Репетитор: ${theirName.value}` : `Студент: ${theirName.value}`,
)

const moneyLabel = computed(() => {
  if (isCancelled.value) return 'Было'
  return isCustomer.value ? 'Вы платите' : 'Вы получите'
})
const moneyClass = computed(() => {
  if (isCancelled.value) return 'text-d-text-hint line-through'
  return isCustomer.value ? 'text-d-coral' : 'text-d-teal'
})

const confirmLabel = computed(() => (isCustomer.value ? 'Подтвердить выполнение' : 'Сдать работу'))
const theirPendingLabel = computed(() =>
  isCustomer.value
    ? `${theirName.value} — ещё не сдал работу`
    : `${theirName.value} — ещё не подтвердил`,
)

const checklist = computed(() => [
  {
    done: iConfirmed.value,
    text: iConfirmed.value
      ? `Вы подтвердили · ${formatDayMonth(myConfirmedAt.value)}`
      : 'Вы — ещё не подтвердили',
  },
  {
    done: !!theirConfirmedAt.value,
    timedOut: closedByTimeout.value,
    text: theirConfirmedAt.value
      ? `${theirName.value} подтвердил · ${formatDayMonth(theirConfirmedAt.value)}`
      : closedByTimeout.value
        ? `${theirName.value} не ответил · закрыто ${formatDayMonth(props.deal.updatedAt)}`
        : iConfirmed.value
          ? `${theirName.value} ещё не подтвердил`
          : theirPendingLabel.value,
  },
])

// срок авто-закрытия приходит с бэкенда: он учитывает дедлайн сделки,
// поэтому длинную работу не закроют раньше её собственного срока
const autoCloseDate = computed(() => formatDayMonth(props.deal.autoConfirmAt))

const cancelledBy = computed(() => {
  if (!props.deal.cancelledById) return ''
  const name =
    props.deal.cancelledById === props.deal.studentId
      ? props.deal.student?.name
      : props.deal.tutor?.name
  const date = formatDayMonth(props.deal.cancelledAt)
  return [name ? `Отменил ${name}` : 'Сделка отменена', date].filter(Boolean).join(' · ')
})
</script>

<template>
  <div
    class="reveal bg-d-panel border border-d-border rounded-sheet p-[18px] mb-3.5"
    :class="isCancelled ? 'opacity-70' : ''"
  >
    <div class="flex items-center gap-[7px] mb-3">
      <span class="text-micro uppercase px-2.5 py-[3px] rounded-md" :class="roleTagClass">
        {{ roleTag }}
      </span>
      <span
        class="ml-auto text-[12px] font-bold px-[11px] py-1 rounded-full whitespace-nowrap transition-colors duration-300"
        :class="statusClass"
      >
        {{ statusLabel }}
      </span>
    </div>

    <div
      class="text-[18px] font-semibold leading-tight mb-1.5"
      :class="isCancelled ? 'text-d-text-second' : ''"
    >
      {{ deal.subject?.name }} · {{ deal.teacher?.fullName }}
    </div>
    <div class="text-subhead text-d-text-hint mb-3.5">{{ counterpartyLine }}</div>

    <div class="flex items-baseline gap-2" :class="isCancelled ? 'mb-3.5' : 'mb-4'">
      <span class="text-caption text-d-text-hint">{{ moneyLabel }}</span>
      <span class="text-[20px] font-bold tnum" :class="moneyClass">
        {{ formatKopeks(deal.price) }}
      </span>
    </div>

    <!-- отменённая сделка: кто, когда и почему -->
    <template v-if="isCancelled">
      <div class="bg-d-ink border border-d-border rounded-[12px] px-3.5 py-3">
        <div class="text-subhead text-d-text-second">{{ cancelledBy }}</div>
        <div v-if="deal.cancelReason" class="text-subhead text-d-text-second mt-1">
          Причина: {{ deal.cancelReason }}
        </div>
        <div class="text-caption text-d-text-hint mt-2">
          Отзывы по отменённой сделке не оставляют — на рейтинг она не влияет.
        </div>
      </div>
    </template>

    <template v-else>
      <DealChecklist :rows="checklist" />

      <!-- я подтвердил: ожидание должно читаться спокойно, а не как зависшая сделка -->
      <div
        v-if="waitingForThem"
        class="mt-4 bg-d-ink border border-d-border rounded-[12px] px-3.5 py-3"
      >
        <div class="text-subhead font-semibold mb-1">
          Всё в порядке — сделка ждёт {{ theirName }}
        </div>
        <div class="text-caption text-d-text-hint">
          <template v-if="autoCloseDate">
            Если ответа не будет, сделка закроется автоматически — {{ autoCloseDate }}.
          </template>
          <template v-else>Сделка закроется автоматически, если ответа не будет.</template>
        </div>
      </div>

      <!-- работа сдана, ждут меня -->
      <div
        v-else-if="theyConfirmedFirst"
        class="mt-4 bg-d-ink border border-d-border rounded-[12px] px-3.5 py-3"
      >
        <div class="text-subhead font-semibold mb-1">{{ theirName }} отметил работу сделанной</div>
        <div class="text-caption text-d-text-hint">
          Проверьте и подтвердите. Если работа ещё не готова — скажите об этом, сделка вернётся в
          работу<span v-if="autoCloseDate"> и не закроется {{ autoCloseDate }}</span
          >.
        </div>
      </div>

      <!-- до первого сообщения подтверждать нечего -->
      <div v-else-if="needsContact" class="mt-4 text-caption text-d-text-hint">
        Время и место занятия обсуждаются в Telegram. {{ confirmLabel }} можно будет после занятия.
      </div>

      <!-- завершённая сделка и отзывы о ней — одна карточка -->
      <DealReviews
        v-if="isDone"
        class="border-t border-d-border mt-4 pt-4"
        :deal="deal"
        :role="role"
        @submitted="emit('reviewed')"
      />
    </template>
  </div>

  <!-- действия -->
  <template v-if="isActive">
    <!-- вариант Б: пока не договорились, «Написать» — главное действие -->
    <template v-if="needsContact">
      <ContactButton
        primary
        class="mb-2.5"
        :name="theirName"
        :username="counterparty?.telegramUsername"
        @open="emit('contact', deal)"
      />
      <button
        class="press w-full text-center text-subhead font-semibold text-d-act py-2 mb-1 disabled:opacity-40"
        :disabled="busy"
        @click="emit('confirm', deal)"
      >
        {{ confirmLabel }}
      </button>
      <button
        class="press w-full text-center text-subhead font-semibold text-d-coral py-2 mb-4 disabled:opacity-40"
        :disabled="busy"
        @click="emit('cancel', deal)"
      >
        Отменить сделку
      </button>
    </template>

    <!-- вариант А: договорились — главное закрыть сделку -->
    <template v-else-if="!waitingForThem">
      <button
        class="press w-full h-[50px] rounded-[13px] bg-d-act text-d-ink text-[15px] font-bold mb-2.5 disabled:opacity-40"
        :disabled="busy"
        @click="emit('confirm', deal)"
      >
        {{ confirmLabel }}
      </button>
      <button
        v-if="theyConfirmedFirst"
        class="press w-full h-11 rounded-[13px] bg-d-surface border border-d-border-soft text-subhead font-semibold mb-2.5 disabled:opacity-40"
        :disabled="busy"
        @click="emit('reopen', deal)"
      >
        Работа ещё не готова
      </button>
      <ContactButton
        class="mb-2.5"
        :name="theirName"
        :username="counterparty?.telegramUsername"
        @open="emit('contact', deal)"
      />
      <button
        class="press w-full text-center text-subhead font-semibold text-d-coral py-2 mb-4 disabled:opacity-40"
        :disabled="busy"
        @click="emit('cancel', deal)"
      >
        Отменить сделку
      </button>
    </template>

    <!-- жду вторую сторону: нажимать нечего -->
    <div v-else class="mb-4" />
  </template>
</template>
