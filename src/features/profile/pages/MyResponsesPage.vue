<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useKeptScroll, useMyResponses } from '@/shared/composables'
import { PATHS, dealsPath } from '@/router/paths'
import { ROLE_META } from '@/shared/constants'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import { formatDayMonth, formatKopeks } from '@/shared/utils'

const router = useRouter()
const { items, isLoading, pending, accepted, load, waitingLabel } = useMyResponses()

type Filter = 'all' | 'pending' | 'accepted'
const filter = ref<Filter>('all')

const filters = computed(() => [
  { id: 'all' as const, label: `Все ${items.value.length}` },
  { id: 'pending' as const, label: `Ждут ${pending.value.length}` },
  { id: 'accepted' as const, label: `Выбрали ${accepted.value.length}` },
])

const visible = computed(() => {
  if (filter.value === 'pending') return pending.value
  if (filter.value === 'accepted') return accepted.value
  return items.value
})

// на заявку откликаются исполнителем, на услугу записываются заказчиком
const goDeals = (kind: 'request' | 'service') =>
  router.push(dealsPath(kind === 'request' ? 'worker' : 'customer'))

const scroller = ref<HTMLElement | null>(null)
const { revisited } = useKeptScroll(scroller, load)

onMounted(load)
</script>

<template>
  <div class="flex flex-col h-full" :class="{ 'no-reveal': revisited }">
    <AppHeader title="Мои отклики" sub="Куда я откликался" back :back-to="PATHS.PROFILE" />

    <div v-if="items.length" class="shrink-0 flex gap-2 px-[18px] pt-3.5 pb-2.5 overflow-x-auto">
      <button
        v-for="f in filters"
        :key="f.id"
        class="press shrink-0 px-3.5 py-2 rounded-full text-caption font-semibold whitespace-nowrap transition-colors"
        :class="filter === f.id ? 'bg-d-accent text-d-ink' : 'bg-d-panel text-d-text-second'"
        @click="filter = f.id"
      >
        {{ f.label }}
      </button>
    </div>

    <div
      ref="scroller"
      class="flex-1 overflow-y-auto px-[18px] pt-1.5 pb-[18px] flex flex-col gap-3"
    >
      <!-- при обновлении список остаётся на месте: спиннер только пока показать нечего -->
      <div v-if="isLoading && !items.length" class="flex items-center justify-center py-16">
        <span
          class="w-6 h-6 rounded-full border-2 border-d-border-soft border-t-d-accent animate-d-spin"
        />
      </div>

      <template v-else>
        <!-- живые отклики держат полный вид, отработавшие сжимаются до строки -->
        <article
          v-for="item in visible"
          :key="item.id"
          class="reveal bg-d-panel border border-d-border rounded-card p-4"
          :class="item.state === 'closed' ? 'opacity-[0.72] py-3' : ''"
        >
          <div class="flex items-center gap-2 mb-2">
            <span
              class="text-[11px] font-bold px-2.5 py-[3px] rounded-full"
              :class="
                item.state === 'accepted'
                  ? 'bg-d-teal/[0.16] text-d-teal'
                  : item.state === 'pending'
                    ? 'bg-d-accent/[0.16] text-d-accent'
                    : 'bg-d-text-mute/20 text-d-text-second'
              "
            >
              {{ item.label }}
            </span>
            <span
              class="text-micro uppercase"
              :class="ROLE_META[item.kind === 'request' ? 'worker' : 'customer'].text"
            >
              {{ ROLE_META[item.kind === 'request' ? 'worker' : 'customer'].label }}
            </span>
            <span class="ml-auto text-[12px] text-d-text-hint">
              {{
                item.state === 'pending'
                  ? waitingLabel(item.createdAt)
                  : formatDayMonth(item.createdAt)
              }}
            </span>
          </div>

          <div class="text-title-m mb-1">{{ item.subject }} · {{ item.teacher }}</div>

          <div v-if="item.state !== 'closed'" class="text-caption text-d-text-hint">
            {{ item.counterparty
            }}<span v-if="item.price">
              · {{ item.kind === 'request' ? 'ваша цена ' : ''
              }}{{ formatKopeks(item.price) }}</span
            >
          </div>
          <p
            v-if="item.state === 'pending' && item.message"
            class="text-review text-d-text-second mt-2"
          >
            «{{ item.message }}»
          </p>

          <button
            v-if="item.state === 'accepted'"
            class="press w-full h-11 rounded-[12px] bg-d-teal/[0.12] text-d-teal text-[15px] font-bold mt-3"
            @click="goDeals(item.kind)"
          >
            Открыть сделку
          </button>
        </article>

        <p v-if="!visible.length" class="text-center text-d-text-hint text-subhead py-10">
          Здесь пока пусто
        </p>
      </template>
    </div>
  </div>
</template>
