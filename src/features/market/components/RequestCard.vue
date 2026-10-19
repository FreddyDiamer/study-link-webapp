<script setup lang="ts">
import { computed } from 'vue'
import AvatarChip from '@/shared/components/AvatarChip.vue'
import { countWithWord, formatDeadline, formatKopeks } from '@/shared/utils'
import { RequestStatus, type Request } from '@/shared/types'
import { ROLE_META } from '@/shared/constants'

interface Props {
  request: Request
  /** заявка принадлежит текущему пользователю — в макете помечена плашкой «Моя» */
  mine?: boolean
  delay?: string
}

const props = withDefaults(defineProps<Props>(), { mine: false })

const budgetText = computed(() =>
  props.request.budget && props.request.budget > 0
    ? `до ${formatKopeks(props.request.budget)}`
    : 'Бюджет не указан',
)

const responsesLabel = computed(() =>
  countWithWord(props.request.responses?.length ?? 0, 'отклик', 'отклика', 'откликов'),
)

const deadlineText = computed(() => formatDeadline(props.request.deadline))

// заявка не провалилась, она сработала — метка нейтральная, без коралла
const isOpen = computed(() => props.request.status === RequestStatus.OPEN)
const statusLabel = computed(() =>
  props.request.status === RequestStatus.MATCHED ? 'Репетитор найден' : 'Закрыта',
)

// на эту заявку уже откликнулись: карточка уступает внимание тем, где решение ещё впереди
const responded = computed(() => isOpen.value && !!props.request.currentUserResponded)
</script>

<template>
  <article
    class="press reveal bg-d-panel border border-d-border rounded-card p-4 cursor-pointer hover:border-d-border-hover"
    :class="isOpen && !responded ? '' : 'opacity-[0.72]'"
    :style="delay ? { animationDelay: delay } : undefined"
  >
    <div class="flex items-center gap-2.5 mb-3">
      <AvatarChip :name="request.student?.name" size="md" />
      <span class="text-caption font-semibold truncate">{{
        request.student?.name || 'Студент'
      }}</span>
      <!-- своя заявка — вы заказчик, отклик на чужую — исполнитель -->
      <span
        v-if="mine && isOpen"
        class="text-[11px] font-bold px-2.5 py-[3px] rounded-full"
        :class="ROLE_META.customer.soft"
        >Моя</span
      >
      <span
        v-else-if="responded"
        class="shrink-0 text-[11px] font-bold px-2.5 py-[3px] rounded-full whitespace-nowrap"
        :class="ROLE_META.worker.soft"
        >Вы откликнулись</span
      >
      <span
        v-else-if="!isOpen"
        class="text-[11px] font-bold px-2.5 py-[3px] rounded-full bg-d-text-mute/20 text-d-text-second"
        >{{ statusLabel }}</span
      >
      <span v-if="isOpen" class="ml-auto shrink-0 text-[12px] text-d-text-hint">{{
        responsesLabel
      }}</span>
    </div>

    <h3 class="text-title-m mb-1.5">
      {{ request.subject?.name || 'Предмет' }} · {{ request.teacher?.fullName || '—' }}
    </h3>
    <p v-if="request.description" class="text-subhead text-d-text-second mb-4 line-clamp-2">
      {{ request.description }}
    </p>

    <div class="flex items-center justify-between">
      <span class="text-price tnum">{{ budgetText }}</span>
      <span class="text-caption text-d-text-hint">
        {{ isOpen ? deadlineText : 'Отклики закрыты' }}
      </span>
    </div>
  </article>
</template>
