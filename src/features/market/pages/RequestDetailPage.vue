<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDealsBadge, useOrder, useToast } from '@/shared/composables'
import { useAuthStore } from '@/stores'
import { useTelegramStore } from '@/stores/telegram'
import { PATHS, requestEditPath, requestRespondPath } from '@/router/paths'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import AvatarChip from '@/shared/components/AvatarChip.vue'
import IncomingResponseCard from '../components/IncomingResponseCard.vue'
import { countWithWord, formatDeadline, formatKopeks } from '@/shared/utils'
import { ResponseStatus, type Request, type RequestResponse } from '@/shared/types'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const telegramStore = useTelegramStore()
const { getRequest, getRequestResponses, acceptRequestResponse } = useOrder()
const { showToast } = useToast()
const { refresh: refreshDealsBadge } = useDealsBadge()

const id = route.params.id as string
const loading = ref(true)
const accepting = ref(false)
const request = ref<Request | null>(null)
const responses = ref<RequestResponse[]>([])

const isMine = computed(() => request.value?.studentId === auth.user?.id)

const responsesLabel = computed(() =>
  countWithWord(responses.value.length, 'отклик', 'отклика', 'откликов'),
)

const budgetShort = computed(() =>
  request.value?.budget && request.value.budget > 0 ? formatKopeks(request.value.budget) : '—',
)
const deadlineShort = computed(() =>
  request.value?.deadline ? formatDeadline(request.value.deadline, '') : '—',
)

// сделка уже создана — остальные отклики закрыты
const decided = computed(() => responses.value.some((r) => r.status === ResponseStatus.ACCEPTED))

const myResponse = computed(() => responses.value.find((r) => r.tutorId === auth.user?.id))

const load = async () => {
  loading.value = true
  try {
    request.value = await getRequest(id)
    responses.value = await getRequestResponses(id)
  } catch (e) {
    console.error('Не удалось загрузить заявку:', e)
  } finally {
    loading.value = false
  }
}

const accept = async (responseId: string) => {
  if (accepting.value) return
  accepting.value = true
  try {
    await acceptRequestResponse(responseId)
    showToast('Сделка создана')
    responses.value = await getRequestResponses(id)
    await refreshDealsBadge()
  } catch (e) {
    console.error('Не удалось принять отклик:', e)
  } finally {
    accepting.value = false
  }
}

const goRespond = () => {
  telegramStore.hapticFeedback('light')
  router.push(requestRespondPath(id))
}

const goEdit = () => {
  telegramStore.hapticFeedback('light')
  router.push(requestEditPath(id))
}

const goDeals = () => router.push(PATHS.DEALS)

const delay = (i: number) => `${i * 0.06}s`

onMounted(load)
</script>

<template>
  <div class="flex flex-col h-full">
    <AppHeader title="Заявка" :sub="request?.subject?.name" back />

    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <span
        class="w-6 h-6 rounded-full border-2 border-d-border-soft border-t-d-accent animate-d-spin"
      />
    </div>

    <template v-else-if="request">
      <div class="flex-1 overflow-y-auto px-[18px] pt-4 pb-[18px]">
        <!-- автор -->
        <div class="reveal flex items-center gap-3 mb-4">
          <AvatarChip :name="request.student?.name" size="lg" />
          <div class="flex-1 min-w-0">
            <div class="text-[16px] font-semibold truncate">
              {{ request.student?.name || 'Студент' }}
            </div>
            <div class="text-caption text-d-text-hint mt-px">{{ responsesLabel }}</div>
          </div>
          <button
            v-if="isMine"
            class="press shrink-0 text-subhead font-semibold text-d-accent"
            @click="goEdit"
          >
            Изменить
          </button>
        </div>

        <h1 class="reveal text-title-l mb-4" style="animation-delay: 0.04s">
          {{ request.subject?.name }} · {{ request.teacher?.fullName }}
        </h1>

        <!-- бюджет и срок -->
        <div class="reveal flex gap-3 mb-[18px]" style="animation-delay: 0.07s">
          <div class="flex-1 bg-d-panel border border-d-border rounded-[13px] p-3.5">
            <div class="text-overline uppercase text-d-text-hint mb-1.5">Бюджет</div>
            <div class="text-[20px] font-bold tnum">{{ budgetShort }}</div>
          </div>
          <div class="flex-1 bg-d-panel border border-d-border rounded-[13px] p-3.5">
            <div class="text-overline uppercase text-d-text-hint mb-1.5">Срок</div>
            <div class="text-[20px] font-bold">{{ deadlineShort }}</div>
          </div>
        </div>

        <template v-if="request.description">
          <div
            class="reveal text-overline uppercase text-d-text-hint mb-2.5"
            style="animation-delay: 0.1s"
          >
            Описание
          </div>
          <p class="reveal text-body text-d-text-bright mb-[22px]" style="animation-delay: 0.1s">
            {{ request.description }}
          </p>
        </template>

        <!-- отклики: выбор репетитора доступен только автору заявки -->
        <template v-if="isMine">
          <div class="text-overline uppercase text-d-text-hint mb-3">
            Отклики · выберите репетитора
          </div>
          <div v-if="responses.length" class="flex flex-col gap-3">
            <IncomingResponseCard
              v-for="(r, i) in responses"
              :key="r.id"
              :response="r"
              :decided="decided"
              :busy="accepting"
              :delay="delay(i)"
              @accept="accept"
              @open-deal="goDeals"
            />
          </div>
          <p v-else class="text-subhead text-d-text-hint">Пока никто не откликнулся</p>
        </template>
      </div>

      <!-- чужая заявка: отклик репетитора -->
      <div
        v-if="!isMine"
        class="shrink-0 px-[18px] pt-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))] bg-d-ink border-t border-d-border"
      >
        <div
          v-if="myResponse"
          class="h-[52px] rounded-[13px] border-[1.5px] border-d-accent text-d-accent flex items-center justify-center gap-2 text-[15px] font-semibold"
        >
          ✓ Вы откликнулись
        </div>
        <button
          v-else
          class="press w-full h-[52px] rounded-[13px] bg-d-accent text-d-ink text-body font-bold"
          @click="goRespond"
        >
          Откликнуться
        </button>
      </div>
    </template>
  </div>
</template>
