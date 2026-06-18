<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useService, useOrder } from '@/shared/composables'
import { useAuthStore } from '@/stores'
import { useTelegramStore } from '@/stores/telegram'
import { serviceDetailPath } from '@/router/paths'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import type { Service } from '@/shared/types'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const telegramStore = useTelegramStore()
const { getService } = useService()
const { createServiceResponse } = useOrder()

const id = route.params.id as string
const service = ref<Service | null>(null)
const message = ref('')
const price = ref<string>('')
const submitting = ref(false)
const toast = ref(false)

const formatPrice = (kopeks: number) =>
  `${Math.round(kopeks / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₽`

const submit = async () => {
  if (submitting.value || !auth.user?.id) return
  submitting.value = true
  try {
    await createServiceResponse({
      studentId: auth.user.id,
      serviceId: id,
      message: message.value || undefined,
      price: price.value ? Number(price.value) : undefined,
    })
    telegramStore.hapticFeedback('medium')
    toast.value = true
    setTimeout(() => router.push(serviceDetailPath(id)), 900)
  } catch (e) {
    console.error('Не удалось отправить отклик:', e)
    telegramStore.showAlert('Не удалось отправить отклик')
    submitting.value = false
  }
}

onMounted(async () => {
  try {
    service.value = await getService(id)
  } catch (e) {
    console.error(e)
  }
})
</script>

<template>
  <div class="relative flex flex-col h-full">
    <AppHeader title="Ваш отклик" :sub="service?.tutor?.name" back />

    <!-- toast -->
    <Transition name="toast">
      <div
        v-if="toast"
        class="absolute top-10 left-4 right-4 z-30 flex items-center gap-2.5 bg-d-surface border border-d-border-soft rounded-[12px] px-4 py-3 text-subhead font-semibold shadow-d-toast animate-d-toastin"
      >
        <span
          class="w-[18px] h-[18px] rounded-full bg-d-accent text-d-ink flex items-center justify-center text-[12px] font-bold"
          >✓</span
        >
        Отклик отправлен
      </div>
    </Transition>

    <div class="flex-1 overflow-y-auto px-[18px] pb-[18px]">
      <div
        v-if="service"
        class="reveal bg-d-panel border-l-[3px] border-d-accent rounded-[10px] px-4 py-3.5 mb-5"
      >
        <div class="text-subhead font-semibold mb-0.5">
          {{ service.subject?.name }} · {{ service.teacher?.fullName }}
        </div>
        <div class="text-caption text-d-text-hint">
          {{ service.tutor?.name }} · {{ formatPrice(service.price) }}
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
      <div
        class="flex items-center h-[52px] rounded-[12px] bg-d-panel border border-d-border-soft px-4 focus-within:border-d-accent transition-colors"
      >
        <span class="text-body text-d-text-hint">₽</span>
        <input
          v-model="price"
          type="number"
          inputmode="numeric"
          placeholder="1 400"
          class="flex-1 bg-transparent text-right text-[20px] font-bold tnum focus:outline-none placeholder:text-d-text-hint placeholder:font-normal"
        />
      </div>
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

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
}
</style>
