<script setup lang="ts">
import { computed, ref } from 'vue'
import { reviewService } from '@/services/business'
import { useToast } from '@/shared/composables'
import { useTelegramStore } from '@/stores/telegram'
import { UserRole, type Deal } from '@/shared/types'
import type { DealRole } from './DealCard.vue'

interface Props {
  deal: Deal
  role: DealRole
  /** отзыв по этой сделке уже оставлен — показываем благодарность */
  existingRating?: number
}

const props = defineProps<Props>()
const emit = defineEmits<{ submitted: [] }>()

const telegramStore = useTelegramStore()
const { showToast } = useToast()

const rating = ref(0)
const comment = ref('')
const submitting = ref(false)

const isCustomer = computed(() => props.role === 'customer')

// заказчик оценивает исполнителя, исполнитель — заказчика
const target = computed(() => (isCustomer.value ? props.deal.tutor : props.deal.student))
const targetRole = computed(() => (isCustomer.value ? UserRole.TUTOR : UserRole.STUDENT))

const title = computed(() => `Как прошло с ${target.value?.name || 'партнёром'}?`)
const sub = computed(() =>
  isCustomer.value ? 'Отзыв формирует рейтинг исполнителя' : 'Отзыв формирует рейтинг заказчика',
)
const thanks = computed(
  () => `Спасибо! Отзыв учтён в рейтинге ${target.value?.name || 'партнёра'}.`,
)

const doneStars = computed(() => {
  const n = props.existingRating ?? 0
  return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n)
})

const submit = async () => {
  if (!rating.value || submitting.value || !target.value?.id) return
  submitting.value = true
  try {
    await reviewService.createReview({
      dealId: props.deal.id,
      targetId: target.value.id,
      targetRole: targetRole.value,
      rating: rating.value,
      comment: comment.value || undefined,
    })
    telegramStore.hapticFeedback('success')
    showToast('Спасибо за отзыв')
    emit('submitted')
  } catch (e) {
    console.error('Не удалось отправить отзыв:', e)
    submitting.value = false
  }
}
</script>

<template>
  <div
    v-if="existingRating"
    class="reveal bg-d-panel border border-d-border rounded-sheet p-[18px] text-center"
  >
    <div class="text-d-rating text-[20px] tracking-[3px] mb-2">{{ doneStars }}</div>
    <div class="text-subhead text-d-text-second">{{ thanks }}</div>
  </div>

  <div v-else class="reveal bg-d-panel border border-d-border rounded-sheet p-[18px]">
    <div class="text-[15px] font-semibold mb-1">{{ title }}</div>
    <div class="text-caption text-d-text-hint mb-4">{{ sub }}</div>

    <div class="flex gap-2.5 justify-center mb-4">
      <button
        v-for="n in 5"
        :key="n"
        class="press text-[34px] leading-none transition-colors duration-200"
        :class="n <= rating ? 'text-d-rating' : 'text-d-border-soft'"
        :aria-label="`Оценка ${n}`"
        @click="rating = n"
      >
        ★
      </button>
    </div>

    <textarea
      v-model="comment"
      rows="2"
      placeholder="Комментарий · необязательно"
      class="w-full min-h-[70px] rounded-[12px] bg-d-ink border border-d-border focus:border-d-accent focus:outline-none px-[15px] py-3 text-[15px] leading-[1.45] resize-none mb-3.5 transition-colors"
    />

    <button
      class="press w-full h-12 rounded-[12px] text-[15px] font-bold transition-colors disabled:cursor-default"
      :class="rating ? 'bg-d-accent text-d-ink' : 'bg-d-surface text-d-text-hint'"
      :disabled="!rating || submitting"
      @click="submit"
    >
      Отправить отзыв
    </button>
  </div>
</template>
