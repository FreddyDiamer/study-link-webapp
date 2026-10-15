<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDealsBadge, useInboxBadge, useOrder, useToast } from '@/shared/composables'
import { useAuthStore } from '@/stores'
import { useTelegramStore } from '@/stores/telegram'
import { dealsPath, requestDetailPath, requestEditPath, requestRespondPath } from '@/router/paths'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import { ActionsSheet, ConfirmSheet, type SheetAction } from '@/shared/components/ui'
import AvatarChip from '@/shared/components/AvatarChip.vue'
import IncomingResponseCard from '../components/IncomingResponseCard.vue'
import { countWithWord, formatDeadline, formatKopeks } from '@/shared/utils'
import { RequestStatus, ResponseStatus, type Request, type RequestResponse } from '@/shared/types'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const telegramStore = useTelegramStore()
const { getRequest, getRequestResponses, acceptRequestResponse, closeRequest, reopenRequest } =
  useOrder()
const { showToast } = useToast()
const { refresh: refreshDealsBadge } = useDealsBadge()
const { refresh: refreshInboxBadge } = useInboxBadge()

const id = route.params.id as string
const loading = ref(true)
const accepting = ref(false)
const request = ref<Request | null>(null)
const responses = ref<RequestResponse[]>([])
const actionsSheet = ref(false)
const closeSheet = ref(false)

const isMine = computed(() => request.value?.studentId === auth.user?.id)
const isOpen = computed(() => request.value?.status === RequestStatus.OPEN)

const headerSub = computed(() => {
  if (!request.value) return ''
  if (request.value.status === RequestStatus.MATCHED) return 'Репетитор найден'
  if (request.value.status === RequestStatus.CLOSED) return 'Закрыта'
  return isMine.value ? `Активна · ${responsesLabel.value}` : request.value.subject?.name
})

// все действия над своим объектом живут в одном меню, ни одно не дублируется
const actions = computed<SheetAction[]>(() => {
  if (!isOpen.value) return [{ id: 'reopen', label: 'Переоткрыть заявку', icon: '↻' }]
  return [
    { id: 'edit', label: 'Редактировать', icon: '✎' },
    { id: 'deadline', label: 'Продлить срок', icon: '↻' },
    { id: 'close', label: 'Закрыть заявку', icon: '✕', destructive: true },
  ]
})

// кого коснётся закрытие: имена честнее, чем «трое откликнувшихся»
const pendingTutors = computed(() =>
  responses.value
    .filter((r) => r.status === ResponseStatus.PENDING)
    .map((r) => ({ id: r.id, name: r.tutor?.name || 'Репетитор' })),
)

// полный список откликов бэкенд отдаёт только автору заявки; чужим он лежит в самой заявке —
// этого хватает для счётчика и отметки «вы откликнулись»
const visibleResponses = computed(() =>
  isMine.value ? responses.value : (request.value?.responses ?? []),
)

const responsesLabel = computed(() =>
  countWithWord(visibleResponses.value.length, 'отклик', 'отклика', 'откликов'),
)

const budgetShort = computed(() =>
  request.value?.budget && request.value.budget > 0 ? formatKopeks(request.value.budget) : '—',
)
const deadlineShort = computed(() =>
  request.value?.deadline ? formatDeadline(request.value.deadline, '') : '—',
)

// сделка уже создана — остальные отклики закрыты
const decided = computed(() => responses.value.some((r) => r.status === ResponseStatus.ACCEPTED))

// в заявке у отклика есть только tutor.id, без плоского tutorId
const myResponse = computed(() =>
  visibleResponses.value.find((r) => (r.tutorId ?? r.tutor?.id) === auth.user?.id),
)

const load = async () => {
  loading.value = true
  try {
    request.value = await getRequest(id)
    responses.value =
      request.value?.studentId === auth.user?.id ? await getRequestResponses(id) : []
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
    await Promise.all([refreshDealsBadge(), refreshInboxBadge()])
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

// отклики принимает автор заявки — в этой сделке он заказчик
const goDeals = () => router.push(dealsPath('customer'))

const onAction = (id: string) => {
  if (id === 'edit' || id === 'deadline') goEdit()
  else if (id === 'close') closeSheet.value = true
  else if (id === 'reopen') reopen()
}

const close = async () => {
  closeSheet.value = false
  try {
    await closeRequest(id)
    showToast('Заявка закрыта')
    await load()
    await refreshInboxBadge()
  } catch (e) {
    console.error('Не удалось закрыть заявку:', e)
  }
}

const reopen = async () => {
  try {
    const created = await reopenRequest(id)
    showToast('Заявка снова в ленте')
    if (created?.id) router.replace(requestDetailPath(created.id))
  } catch (e) {
    console.error('Не удалось переоткрыть заявку:', e)
  }
}

const delay = (i: number) => `${i * 0.06}s`

onMounted(load)
</script>

<template>
  <div class="flex flex-col h-full">
    <AppHeader
      :title="isMine ? 'Моя заявка' : 'Заявка'"
      :sub="headerSub"
      back
      :menu="isMine"
      @menu="actionsSheet = true"
    />

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
        <!-- заявка закрыта: кнопки нет, вместо неё объяснение -->
        <p v-if="!isOpen" class="text-subhead text-d-text-hint text-center py-3">
          {{
            request.status === 'MATCHED'
              ? 'Автор уже выбрал репетитора — отклики закрыты.'
              : 'Автор закрыл заявку — отклики больше не принимаются.'
          }}
        </p>
        <div
          v-else-if="myResponse"
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

    <ActionsSheet
      v-model="actionsSheet"
      title="Действия с заявкой"
      :actions="actions"
      @pick="onAction"
    />

    <ConfirmSheet
      v-model="closeSheet"
      :title="`Закрыть заявку по ${request?.subject?.name ?? 'предмету'}?`"
      :text="`Заявка уйдёт из ленты, и откликнувшиеся увидят, что вы выбрали кого-то другого. Каждый из них получит уведомление.`"
      confirm-label="Закрыть заявку"
      cancel-label="Не закрывать"
      :affected="pendingTutors"
      reassurance="Заявку можно будет переоткрыть"
      @confirm="close"
    />
  </div>
</template>
