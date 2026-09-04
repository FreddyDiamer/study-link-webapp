<script setup lang="ts">
import { computed, ref } from 'vue'
import { reviewService } from '@/services/business'
import { useToast } from '@/shared/composables'
import { useAuthStore } from '@/stores'
import { useTelegramStore } from '@/stores/telegram'
import AvatarChip from '@/shared/components/AvatarChip.vue'
import type { Deal, Review } from '@/shared/types'
import type { DealRole } from './DealCard.vue'

interface Props {
  deal: Deal
  role: DealRole
}

const props = defineProps<Props>()
const emit = defineEmits<{ submitted: [] }>()

const auth = useAuthStore()
const telegramStore = useTelegramStore()
const { showToast } = useToast()

const rating = ref(0)
const comment = ref('')
const submitting = ref(false)

const isCustomer = computed(() => props.role === 'customer')
const target = computed(() => (isCustomer.value ? props.deal.tutor : props.deal.student))
const theirName = computed(() => target.value?.name || 'партнёром')

const reviews = computed<Review[]>(() => props.deal.reviews ?? [])
const myReview = computed(() => reviews.value.find((r) => r.authorId === auth.user?.id))
const theirReview = computed(() => reviews.value.find((r) => r.authorId !== auth.user?.id))

const stars = (value: number) => '★★★★★'.slice(0, value) + '☆☆☆☆☆'.slice(0, 5 - value)

// свой отзыв не ждёт чужого, но молчание второй стороны нужно назвать
const myRoleWord = computed(() => (isCustomer.value ? 'заказчика' : 'исполнителя'))

// оценка ставится мгновенно — вибро здесь заменяет отсутствующий «щелчок»
const setRating = (value: number) => {
  if (rating.value === value) return
  telegramStore.hapticFeedback('light')
  rating.value = value
}

const submit = async () => {
  if (!rating.value || submitting.value) return
  submitting.value = true
  try {
    await reviewService.createReview({
      dealId: props.deal.id,
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
  <!-- отзыва ещё нет: форма -->
  <div v-if="!myReview" class="reveal bg-d-panel border border-d-border rounded-sheet p-[18px]">
    <div class="text-[15px] font-semibold mb-1">Как прошло с {{ theirName }}?</div>
    <div class="text-caption text-d-text-hint mb-4">
      Отзыв формирует рейтинг {{ isCustomer ? 'исполнителя' : 'заказчика' }}
    </div>

    <div class="flex gap-2.5 justify-center mb-4">
      <button
        v-for="n in 5"
        :key="n"
        class="text-[34px] leading-none transition-[color,transform] duration-200 ease-d-pop active:scale-90"
        :class="n <= rating ? 'text-d-rating scale-105' : 'text-d-border-soft'"
        :aria-label="`Оценка ${n}`"
        @click="setRating(n)"
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

  <!-- мой отзыв есть -->
  <div v-else class="reveal bg-d-panel border border-d-border rounded-sheet p-[18px]">
    <div class="text-overline uppercase text-d-text-hint mb-2">Ваш отзыв о {{ theirName }}</div>
    <div class="text-d-rating text-[15px] tracking-[2px] mb-1.5">{{ stars(myReview.rating) }}</div>
    <p v-if="myReview.comment" class="text-review text-d-text-bright">{{ myReview.comment }}</p>

    <!-- второй отзыв -->
    <template v-if="theirReview">
      <div class="border-t border-d-border mt-4 pt-4">
        <div class="flex items-center gap-2 mb-2">
          <AvatarChip :name="target?.name" size="sm" />
          <span class="text-overline uppercase text-d-text-hint">
            Отзыв {{ theirName }} о вас
          </span>
        </div>
        <div class="text-d-rating text-[15px] tracking-[2px] mb-1.5">
          {{ stars(theirReview.rating) }}
        </div>
        <p v-if="theirReview.comment" class="text-review text-d-text-bright">
          {{ theirReview.comment }}
        </p>
      </div>
    </template>

    <!-- торопить чужой отзыв нельзя: строка нейтральная, без кнопок -->
    <p v-else class="text-caption text-d-text-hint mt-4 pt-4 border-t border-d-border">
      {{ theirName }} ещё не оставил отзыв о вас. Ваш рейтинг {{ myRoleWord }} обновится, когда это
      произойдёт.
    </p>
  </div>
</template>
