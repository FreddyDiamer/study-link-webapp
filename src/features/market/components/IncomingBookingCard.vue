<script setup lang="ts">
import { computed } from 'vue'
import AvatarChip from '@/shared/components/AvatarChip.vue'
import { StatusBadge } from '@/shared/components/ui'
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
    class="reveal card transition-[opacity,border-color] duration-300"
    :class="[isAccepted ? 'border-d-teal' : '', isRejected ? 'opacity-45' : '']"
    :style="delay ? { animationDelay: delay } : undefined"
  >
    <div class="flex items-center gap-2.5 mb-2.5">
      <AvatarChip :name="student?.name" size="md" />
      <div class="flex-1 min-w-0">
        <div class="text-subhead font-semibold truncate">{{ student?.name || 'Студент' }}</div>
        <div v-if="trustLine" class="text-caption text-d-text-hint mt-0.5">{{ trustLine }}</div>
      </div>

      <!-- статус из единой палитры; ожидающая запись вместо плашки показывает кнопки -->
      <StatusBadge
        v-if="!isPending"
        class="shrink-0"
        :class="{ 'animate-d-pop': isAccepted }"
        :response="booking.status"
      />
    </div>

    <p v-if="booking.message" class="text-subhead text-d-text-second mb-3">
      {{ booking.message }}
    </p>

    <div class="flex items-center gap-2 mb-3">
      <span class="text-price tnum">{{ formatKopeks(price) }}</span>
      <span v-if="priceIsOwn" class="text-caption text-d-text-hint">· предложил свою цену</span>
      <span v-if="booking.proposedDeadline" class="text-caption text-d-text-hint">
        · {{ formatDeadline(booking.proposedDeadline, 'к') }}
      </span>
    </div>

    <div v-if="isPending" class="flex gap-2.5">
      <button
        class="press btn btn-primary flex-1 h-11 text-body"
        :disabled="busy"
        @click="emit('accept', booking.id)"
      >
        Записать
      </button>
      <button
        class="press btn btn-secondary h-11 px-4 text-body"
        :disabled="busy"
        @click="emit('reject', booking.id)"
      >
        Отказать
      </button>
    </div>
    <button
      v-else-if="isAccepted"
      class="press btn w-full h-11 bg-d-teal/[0.16] text-d-teal text-body"
      @click="emit('openDeal')"
    >
      Сделка создана →
    </button>
  </div>
</template>
