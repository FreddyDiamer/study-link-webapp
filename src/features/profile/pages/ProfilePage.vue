<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { reviewService, userService } from '@/services/business'
import { useMyResponses, useOrder, useService, useToast } from '@/shared/composables'
import { useAuthStore } from '@/stores'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import AvatarChip from '@/shared/components/AvatarChip.vue'
import ReviewItem from '@/shared/components/ReviewItem.vue'
import { LoadError, StatusBadge } from '@/shared/components/ui'
import ReputationPair from '../components/ReputationPair.vue'
import GroupSheet from '../components/GroupSheet.vue'
import MyResponsesBlock from '../components/MyResponsesBlock.vue'
import { countWithWord, formatDayMonth, formatJoined, formatKopeks } from '@/shared/utils'
import { requestDetailPath, serviceDetailPath } from '@/router/paths'
import { PATHS } from '@/router/paths'
import {
  RequestStatus,
  ServiceStatus,
  type Reputation,
  type Request,
  type Review,
  type Service,
  type User,
} from '@/shared/types'

const router = useRouter()
const auth = useAuthStore()
const { getMyRequests } = useOrder()
const { getMyServices } = useService()
const myResponses = useMyResponses()
const { showToast } = useToast()

const loading = ref(true)
const groupSheet = ref(false)
const profile = ref<User | null>(null)
const reviews = ref<Review[]>([])
// имя и username есть локально — сбой отбирает только репутацию
const reputationFailed = ref(false)
const myRequests = ref<Request[]>([])
const myServices = ref<Service[]>([])
// две репутации: за работу исполнителем и за поведение заказчиком, считает бэкенд
const reputation = ref<Reputation>({
  tutor: { rating: 0, count: 0 },
  student: { rating: 0, count: 0 },
})

const recentReviews = computed(() => reviews.value.slice(0, 3))

const load = async () => {
  loading.value = true
  try {
    const me = await userService.getProfile()
    profile.value = me
    if (me?.id) {
      try {
        const [userReviews, userReputation] = await Promise.all([
          reviewService.getUserReviews(me.id),
          reviewService.getReputation(me.id),
        ])
        reviews.value = userReviews
        reputation.value = userReputation
        reputationFailed.value = false
      } catch (e) {
        console.error('Не удалось загрузить репутацию:', e)
        reputationFailed.value = true
      }
    }
    const [requests, services] = await Promise.all([
      getMyRequests(),
      getMyServices(),
      myResponses.load(),
    ])
    myRequests.value = requests?.items ?? []
    myServices.value = services?.items ?? []
  } catch (e) {
    console.error('Не удалось загрузить профиль:', e)
    profile.value = (auth.user as User) ?? null
  } finally {
    loading.value = false
  }
}

const pickGroup = async (groupId: string) => {
  try {
    profile.value = await userService.updateGroup(groupId)
    showToast('Группа обновлена')
  } catch (e) {
    console.error('Не удалось сменить группу:', e)
  }
}

const budgetText = (request: Request) =>
  request.budget && request.budget > 0 ? `до ${formatKopeks(request.budget)}` : 'Бюджет не указан'

const responsesLabel = (request: Request) =>
  countWithWord(request.responses?.length ?? 0, 'отклик', 'отклика', 'откликов')

const responsesCount = (count: number) => countWithWord(count, 'запись', 'записи', 'записей')

const roleOf = (review: Review) => (review.targetRole === 'TUTOR' ? 'tutor' : 'student')

const isRequestOpen = (request: Request) => request.status === RequestStatus.OPEN
const isServiceListed = (service: Service) => service.status === ServiceStatus.ACTIVE

onMounted(load)
</script>

<template>
  <div class="flex flex-col h-full">
    <AppHeader title="Профиль" />

    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <span
        class="w-6 h-6 rounded-full border-2 border-d-border-soft border-t-d-accent animate-d-spin"
      />
    </div>

    <div v-else-if="profile" class="flex-1 overflow-y-auto px-[18px] pt-4 pb-[18px]">
      <!-- кто вы -->
      <div class="reveal flex items-center gap-3.5 mb-[18px]">
        <AvatarChip :name="profile.name" size="xl" />
        <div>
          <div class="text-title-l">{{ profile.name }}</div>
          <div class="text-caption text-d-text-hint mt-0.5">
            <span v-if="profile.telegramUsername">@{{ profile.telegramUsername }} · </span>
            {{ formatJoined(profile.createdAt) }}
          </div>
        </div>
      </div>

      <!-- группа: единственная настройка, оставшаяся в MVP -->
      <button
        class="press reveal w-full flex items-center bg-d-panel border border-d-border rounded-[14px] px-4 py-[15px] mb-3.5 text-left"
        style="animation-delay: 0.04s"
        @click="groupSheet = true"
      >
        <span>
          <span class="block text-overline uppercase text-d-text-hint mb-1">Группа</span>
          <span class="block text-[16px] font-semibold">
            {{ profile.group?.number || 'Не выбрана' }}
          </span>
        </span>
        <span class="ml-auto text-subhead font-semibold text-d-accent">Изменить</span>
      </button>

      <!-- настройки: две строки, обе ведут на свой экран -->
      <div class="reveal flex flex-col gap-2.5 mb-3.5" style="animation-delay: 0.05s">
        <button
          class="press w-full flex items-center bg-d-panel border border-d-border rounded-[14px] px-4 py-[15px] text-left"
          @click="router.push(PATHS.PROFILE_EDIT)"
        >
          <span>
            <span class="block text-overline uppercase text-d-text-hint mb-1">О себе</span>
            <span class="block text-subhead text-d-text-second line-clamp-1">
              {{ profile.description || 'Расскажите, что и как вы ведёте' }}
            </span>
          </span>
          <span class="ml-auto pl-3 text-subhead font-semibold text-d-accent">Изменить</span>
        </button>

        <button
          class="press w-full flex items-center bg-d-panel border border-d-border rounded-[14px] px-4 py-[15px] text-left"
          @click="router.push(PATHS.NOTIFICATIONS)"
        >
          <span class="text-body">Уведомления</span>
          <span class="ml-auto text-d-text-hint text-[20px] leading-none">›</span>
        </button>
      </div>

      <LoadError
        v-if="reputationFailed"
        compact
        class="bg-d-panel border border-d-border rounded-sheet mb-3.5"
        title="Рейтинг и отзывы не загрузились"
        text="Это сбой связи, а не сброс репутации."
        @retry="load"
      />

      <ReputationPair
        v-else
        class="reveal mb-3.5"
        style="animation-delay: 0.07s"
        :tutor="reputation.tutor"
        :student="reputation.student"
      />

      <!-- отзывы -->
      <div
        class="reveal bg-d-panel border border-d-border rounded-sheet p-[18px] mb-3.5"
        style="animation-delay: 0.09s"
      >
        <div class="text-overline uppercase text-d-text-hint mb-1">Отзывы о вас</div>

        <template v-if="reviews.length">
          <ReviewItem
            v-for="r in recentReviews"
            :key="r.id"
            bare
            :author="r.author?.name || 'Аноним'"
            :rating="r.rating"
            :text="r.comment"
            :role="roleOf(r)"
          />
        </template>

        <template v-else>
          <p class="text-subhead text-d-text-second mt-3">
            Первый отзыв появится после первой закрытой сделки
          </p>
          <p class="text-caption text-d-text-hint mt-2 mb-4">
            Обе стороны подтверждают выполнение, потом каждая пишет отзыв. Так рейтинг нельзя
            нарисовать себе самому.
          </p>
          <button
            class="press w-full h-11 rounded-[12px] bg-d-accent text-d-ink text-subhead font-bold"
            @click="router.push(PATHS.MARKET)"
          >
            Найти первую заявку
          </button>
        </template>
      </div>

      <!-- мои отклики: ожидание нужно видеть в одном месте -->
      <MyResponsesBlock
        class="reveal mb-3.5"
        style="animation-delay: 0.1s"
        :items="myResponses.items.value"
        :pending="myResponses.pending.value"
        :accepted="myResponses.accepted.value"
        :closed="myResponses.closed.value"
        :waiting-label="myResponses.waitingLabel"
        @open="router.push(PATHS.MY_RESPONSES)"
        @browse="router.push(PATHS.MARKET)"
      />

      <!-- мои заявки -->
      <div
        class="reveal text-overline uppercase text-d-text-hint mb-2.5"
        style="animation-delay: 0.1s"
      >
        Мои заявки
      </div>
      <div v-if="myRequests.length" class="flex flex-col gap-2.5">
        <button
          v-for="request in myRequests"
          :key="request.id"
          class="press reveal w-full bg-d-panel border border-d-border rounded-[14px] p-[15px] text-left"
          :class="isRequestOpen(request) ? '' : 'opacity-[0.72]'"
          style="animation-delay: 0.1s"
          @click="router.push(requestDetailPath(request.id))"
        >
          <div class="flex items-center gap-2 mb-2">
            <span
              class="text-[11px] font-bold px-2.5 py-[3px] rounded-full"
              :class="
                isRequestOpen(request)
                  ? 'bg-d-teal/[0.16] text-d-teal'
                  : 'bg-d-text-mute/20 text-d-text-second'
              "
            >
              {{ isRequestOpen(request) ? 'Активна' : 'Закрыта' }}
            </span>
            <span class="ml-auto text-[12px] text-d-text-hint">
              {{
                isRequestOpen(request)
                  ? responsesLabel(request)
                  : `Закрыта ${formatDayMonth(request.closedAt)}`
              }}
            </span>
          </div>
          <div class="text-[16px] font-semibold mb-1.5">
            {{ request.subject?.name }} · {{ request.teacher?.fullName }}
          </div>
          <div class="text-[16px] font-bold tnum">{{ budgetText(request) }}</div>
        </button>
      </div>
      <p v-else class="text-subhead text-d-text-hint">Вы ещё не создавали заявок</p>

      <template v-if="myServices.length">
        <div class="text-overline uppercase text-d-text-hint mt-5 mb-2.5">Мои услуги</div>
        <div class="flex flex-col gap-2.5">
          <!-- записи принимаются на экране услуги: карточка ведёт туда -->
          <button
            v-for="service in myServices"
            :key="service.id"
            class="press card w-full text-left"
            :class="isServiceListed(service) ? '' : 'opacity-70'"
            @click="router.push(serviceDetailPath(service.id))"
          >
            <div class="flex items-center gap-2 mb-1.5">
              <span class="text-title-m">
                {{ service.subject?.name }} · {{ service.teacher?.fullName }}
              </span>
              <StatusBadge
                v-if="!isServiceListed(service)"
                class="shrink-0"
                :service="service.status"
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-[16px] font-bold tnum">{{ formatKopeks(service.price) }}</span>
              <span class="text-[12px] text-d-text-hint">
                {{
                  service.responses?.length
                    ? responsesCount(service.responses.length)
                    : 'Пока без записей'
                }}
              </span>
            </div>
          </button>
        </div>
      </template>
    </div>

    <GroupSheet v-model="groupSheet" :current-id="profile?.groupId" @pick="pickGroup" />
  </div>
</template>
