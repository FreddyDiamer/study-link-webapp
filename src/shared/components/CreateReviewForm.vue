<script setup lang="ts">
import { ref } from 'vue'
import { useTelegramStore } from '@/stores/telegram'
import Card from '@/shared/components/ui/Card.vue'
import Button from '@/shared/components/ui/Button.vue'
import Input from '@/shared/components/ui/Input.vue'
import { Rating } from '@/shared/components/ui'

interface Props {
  dealId: string
  targetId: string
  targetRole: 'TUTOR' | 'STUDENT'
  onSubmit?: (review: { rating: number; comment: string }) => void
}

const props = defineProps<Props>()
const telegramStore = useTelegramStore()

const rating = ref(5)
const comment = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  if (rating.value < 1) {
    return
  }

  isLoading.value = true
  try {
    await props.onSubmit?.({
      rating: rating.value,
      comment: comment.value.trim(),
    })

    // Сброс формы
    rating.value = 5
    comment.value = ''
  } catch (error) {
    console.error('Ошибка отправки отзыва:', error)
  } finally {
    isLoading.value = false
  }
}

const targetLabel = props.targetRole === 'TUTOR' ? 'репетитора' : 'студента'
</script>

<template>
  <Card class="p-6">
    <div class="space-y-6">
      <!-- Header -->
      <div class="text-center">
        <h3 class="text-title-m font-semibold text-d-text mb-2">
          Оставить отзыв о {{ targetLabel }}
        </h3>
        <p class="text-subhead text-d-text-second">Поделитесь своим опытом работы</p>
      </div>

      <!-- Rating -->
      <div class="text-center">
        <label class="block text-subhead font-medium text-d-text mb-3"> Оценка </label>
        <Rating v-model:rating="rating" size="lg" :show-count="false" :readonly="false" />
      </div>

      <!-- Comment -->
      <div>
        <label class="block text-subhead font-medium text-d-text mb-2">
          Комментарий (необязательно)
        </label>
        <textarea
          v-model="comment"
          rows="4"
          placeholder="Расскажите о своем опыте работы..."
          class="w-full px-4 py-3 bg-d-surface border border-d-border rounded-field text-d-text placeholder-d-text-second focus:outline-none focus:border-d-accent transition-colors resize-none"
        />
      </div>

      <!-- Submit -->
      <Button @click="handleSubmit" :loading="isLoading" :disabled="rating < 1" class="w-full">
        Отправить отзыв
      </Button>
    </div>
  </Card>
</template>
