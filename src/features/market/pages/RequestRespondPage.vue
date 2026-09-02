<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrder, useToast } from '@/shared/composables'
import { useAuthStore } from '@/stores'
import { useTelegramStore } from '@/stores/telegram'
import { requestDetailPath } from '@/router/paths'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import { DateField, MoneyInput } from '@/shared/components/ui'
import { formatKopeks } from '@/shared/utils'
import type { Request } from '@/shared/types'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const telegramStore = useTelegramStore()
const { getRequest, createRequestResponse } = useOrder()
const { showToast } = useToast()

const id = route.params.id as string
const request = ref<Request | null>(null)
const message = ref('')
const price = ref('')
const deadline = ref('')
const submitting = ref(false)

const budgetText = computed(() =>
  request.value?.budget && request.value.budget > 0
    ? `до ${formatKopeks(request.value.budget)}`
    : 'Бюджет не указан',
)

const submit = async () => {
  if (submitting.value || !auth.user?.id) return
  submitting.value = true
  try {
    await createRequestResponse({
      tutorId: auth.user.id,
      requestId: id,
      message: message.value || undefined,
      // ввод в рублях, бэкенд и весь UI работают в копейках
      price: price.value ? Math.round(Number(price.value) * 100) : undefined,
      proposedDeadline: deadline.value || undefined,
    })
    telegramStore.hapticFeedback('medium')
    showToast('Отклик отправлен')
    router.push(requestDetailPath(id))
  } catch (e) {
    console.error('Не удалось отправить отклик:', e)
    submitting.value = false
  }
}

onMounted(async () => {
  try {
    request.value = await getRequest(id)
  } catch (e) {
    console.error('Не удалось загрузить заявку:', e)
  }
})
</script>

<template>
  <div class="flex flex-col h-full">
    <AppHeader
      title="Ваш отклик"
      :sub="request?.student?.name"
      back
      :back-to="requestDetailPath(id)"
    />

    <div class="flex-1 overflow-y-auto px-[18px] pt-4 pb-[18px]">
      <div
        v-if="request"
        class="reveal bg-d-panel border-l-[3px] border-d-accent rounded-[10px] px-4 py-3.5 mb-5"
      >
        <div class="text-[15px] font-semibold mb-0.5">
          {{ request.subject?.name }} · {{ request.teacher?.fullName }}
        </div>
        <div class="text-caption text-d-text-hint">
          {{ request.student?.name }} · {{ budgetText }}
        </div>
      </div>

      <label class="block text-overline uppercase text-d-text-second mb-2.5">Сообщение</label>
      <textarea
        v-model="message"
        rows="3"
        placeholder="Готов помочь, есть опыт с этим преподавателем…"
        class="w-full min-h-[94px] rounded-[12px] bg-d-panel border border-d-border-soft focus:border-d-accent focus:outline-none px-4 py-3.5 text-body leading-[1.45] resize-none mb-5 transition-colors"
      />

      <label class="block text-overline uppercase text-d-text-second mb-2.5">Ваша цена</label>
      <MoneyInput v-model="price" placeholder="1 400" class="mb-5" />

      <label class="block text-overline uppercase text-d-text-second mb-2.5">Срок</label>
      <DateField v-model="deadline" />
    </div>

    <div
      class="shrink-0 px-[18px] pt-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))] bg-d-ink border-t border-d-border"
    >
      <button
        class="press w-full h-[52px] rounded-[13px] bg-d-accent text-d-ink text-body font-bold disabled:opacity-40"
        :disabled="submitting"
        @click="submit"
      >
        Отправить отклик
      </button>
    </div>
  </div>
</template>
