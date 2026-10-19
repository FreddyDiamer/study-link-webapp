<script setup lang="ts">
import { ROLE_META } from '@/shared/constants'
import { formatKopeks } from '@/shared/utils'
import type { MyResponse } from '@/shared/composables'

interface Props {
  items: MyResponse[]
  pending: MyResponse[]
  accepted: MyResponse[]
  closed: MyResponse[]
  waitingLabel: (iso: string) => string
}
const props = defineProps<Props>()

const emit = defineEmits<{ open: []; browse: [] }>()

// последние две строки: блок — вход, а не список
const recent = () => props.items.slice(0, 2)
</script>

<template>
  <div class="bg-d-panel border border-d-border rounded-sheet p-[18px]">
    <div class="flex items-center mb-3.5">
      <span class="text-overline uppercase text-d-text-hint">Мои отклики</span>
      <button
        v-if="items.length"
        class="press ml-auto text-caption font-semibold text-d-accent"
        @click="emit('open')"
      >
        Все {{ items.length }}
      </button>
    </div>

    <!-- счётчики нулями не показываем: пустой блок объясняет механику -->
    <template v-if="items.length">
      <div class="flex gap-2.5 mb-4">
        <div class="flex-1 bg-d-ink border border-d-border rounded-[12px] px-3 py-2.5">
          <div class="text-[20px] font-bold tnum leading-none">{{ pending.length }}</div>
          <div class="text-[11px] text-d-text-hint mt-1.5">ждут</div>
        </div>
        <div class="flex-1 bg-d-ink border border-d-border rounded-[12px] px-3 py-2.5">
          <div class="text-[20px] font-bold tnum leading-none text-d-teal">
            {{ accepted.length }}
          </div>
          <div class="text-[11px] text-d-text-hint mt-1.5">выбрали</div>
        </div>
        <div class="flex-1 bg-d-ink border border-d-border rounded-[12px] px-3 py-2.5">
          <!-- «не выбрали» серым: это статистика, а не провал -->
          <div class="text-[20px] font-bold tnum leading-none text-d-text-second">
            {{ closed.length }}
          </div>
          <div class="text-[11px] text-d-text-hint mt-1.5">не выбрали</div>
        </div>
      </div>

      <button
        v-for="item in recent()"
        :key="item.id"
        class="press w-full text-left border-t border-d-border pt-3 mt-3 first:border-t-0 first:pt-0 first:mt-0"
        @click="emit('open')"
      >
        <div class="text-subhead font-semibold mb-0.5">{{ item.subject }} · {{ item.teacher }}</div>
        <div class="text-caption text-d-text-hint">
          <span :class="ROLE_META[item.kind === 'request' ? 'worker' : 'customer'].text">{{
            ROLE_META[item.kind === 'request' ? 'worker' : 'customer'].label
          }}</span>
          ·
          <template v-if="item.state === 'pending'">
            {{ item.price ? `${formatKopeks(item.price)} · ` : ''
            }}{{ waitingLabel(item.createdAt) }}
            в ожидании
          </template>
          <template v-else-if="item.state === 'accepted'">
            {{ item.label }} · перешло в сделку
          </template>
          <template v-else>{{ item.label }}</template>
        </div>
      </button>
    </template>

    <template v-else>
      <div class="text-subhead text-d-text-second mb-2">Вы ещё никуда не откликались</div>
      <p class="text-caption text-d-text-hint mb-4">
        Отклик — это короткое сообщение и ваша цена. Автор заявки выбирает одного из откликнувшихся,
        и отклик становится сделкой.
      </p>
      <button
        class="press w-full h-11 rounded-[12px] bg-d-act text-d-ink text-subhead font-bold"
        :class="ROLE_META.worker.scope"
        @click="emit('browse')"
      >
        Смотреть заявки
      </button>
    </template>
  </div>
</template>
