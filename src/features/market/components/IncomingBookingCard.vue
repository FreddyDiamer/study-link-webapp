<script setup lang="ts">
import { computed } from 'vue'
import AvatarChip from '@/shared/components/AvatarChip.vue'
import { formatDeadline, formatJoined, formatKopeks } from '@/shared/utils'
import { ResponseStatus, type ServiceResponse } from '@/shared/types'

interface Props {
  booking: ServiceResponse
  /** цена услуги — запись в одно касание приходит без своей цены */
  servicePrice: number
  busy?: boolean
  delay?: string
}

const props = withDefaults(defineProps<Props>(), { busy: false })
const emit = defineEmits<{ accept: [id: string]; reject: [id: string]; openDeal: [] }>()

const isAccepted = computed(() => props.booking.status === ResponseStatus.ACCEPTED)
const isPending = computed(() => props.booking.status === ResponseStatus.PENDING)
const isRejected = computed(() => !isAccepted.value && !isPending.value)

const student = computed(() => props.booking.student)

// студент предложил свою цену — показываем её, иначе цену услуги
const price = computed(() => props.booking.price ?? props.servicePrice)
const priceIsOwn = computed(
  () => props.booking.price != null && props.booking.price !== props.servicePrice,
)

// репутации у студента может не быть: доверие держат группа и дата регистрации
const trustLine = computed(() =>
  [student.value?.group?.number, formatJoined(student.value?.createdAt)]
    .filter(Boolean)
    .join(' · '),
)
</script>

<template>
  <div
    class="reveal bg-d-panel border rounded-[14px] p-[15px] transition-[opacity,border-color] duration-300"
    :class="[isAccepted ? 'border-d-teal' : 'border-d-border', isRejected ? 'opacity-45' : '']"
    :style="delay ? { animationDelay: delay } : undefined"
  >
    <div class="flex items-center gap-2.5 mb-2.5">
      <AvatarChip :name="student?.name" size="md" />
      <div class="flex-1 min-w-0">
        <div class="text-subhead font-semibold truncate">{{ student?.name || 'Студент' }}</div>
        <div v-if="trustLine" class="text-[11px] text-d-text-hint mt-0.5">{{ trustLine }}</div>
      </div>

      <span
        v-if="isAccepted"
        class="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-d-teal/[0.16] text-d-teal animate-d-pop"
        >Записан</span
      >
      <span
        v-else-if="isRejected"
        class="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-d-text-mute/20 text-d-text-second"
        >Отказано</span
      >
    </div>

    <p v-if="booking.message" class="text-subhead text-d-text-second mb-3">
      {{ booking.message }}
    </p>

    <div class="flex items-center gap-2 mb-3">
      <span class="text-[16px] font-bold tnum">{{ formatKopeks(price) }}</span>
      <span v-if="priceIsOwn" class="text-caption text-d-text-hint">· предложил свою цену</span>
      <span v-if="booking.proposedDeadline" class="text-caption text-d-text-hint">
        · {{ formatDeadline(booking.proposedDeadline, 'к') }}
      </span>
    </div>

    <div v-if="isPending" class="flex gap-2.5">
      <button
        class="press flex-1 h-11 rounded-[12px] bg-d-accent text-d-ink text-[15px] font-bold disabled:opacity-40"
        :disabled="busy"
        @click="emit('accept', booking.id)"
      >
        Записать
      </button>
      <button
        class="press h-11 px-4 rounded-[12px] border border-d-border text-d-text-second text-[15px] font-semibold disabled:opacity-40"
        :disabled="busy"
        @click="emit('reject', booking.id)"
      >
        Отказать
      </button>
    </div>
    <button
      v-else-if="isAccepted"
      class="press w-full h-11 rounded-[12px] bg-d-teal/[0.12] text-d-teal text-[15px] font-bold"
      @click="emit('openDeal')"
    >
      Сделка создана →
    </button>
  </div>
</template>
