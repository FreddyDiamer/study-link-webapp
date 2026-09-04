<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { userService } from '@/services/business'
import { useToast } from '@/shared/composables'
import { PATHS } from '@/router/paths'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import { ToggleRow } from '@/shared/components/ui'
import type { NotificationPreferences } from '@/shared/types'

const { showToast } = useToast()

const loading = ref(true)
const saving = ref(false)
/** главный тумблер — отписка одним движением, ради которой блокировали бота */
const enabled = ref(true)

// по умолчанию включено только то, что двигает сделку
const prefs = reactive<Required<NotificationPreferences>>({
  onResponse: true,
  onDeal: true,
  onReview: true,
  onDigest: false,
})

const EVENTS: { key: keyof NotificationPreferences; label: string; hint: string }[] = [
  { key: 'onResponse', label: 'Отклик на мою заявку', hint: 'Кто-то предложил помощь' },
  { key: 'onDeal', label: 'Меня выбрали', hint: 'Отклик стал сделкой' },
  {
    key: 'onReview',
    label: 'Новый отзыв обо мне',
    hint: 'Оценка после сделки',
  },
  {
    key: 'onDigest',
    label: 'Новые заявки по моим предметам',
    hint: 'Не чаще раза в день',
  },
]

let ready = false

const save = async () => {
  if (!ready || saving.value) return
  saving.value = true
  try {
    await userService.updateProfile({
      telegramNotificationsEnabled: enabled.value,
      notificationPreferences: { ...prefs },
    })
  } catch (e) {
    console.error('Не удалось сохранить настройки уведомлений:', e)
    showToast('Не удалось сохранить настройки')
  } finally {
    saving.value = false
  }
}

watch([enabled, prefs], save, { deep: true })

onMounted(async () => {
  try {
    const me = await userService.getProfile()
    enabled.value = me.telegramNotificationsEnabled ?? true
    Object.assign(prefs, me.notificationPreferences ?? {})
  } catch (e) {
    console.error('Не удалось загрузить настройки:', e)
  } finally {
    loading.value = false
    ready = true
  }
})
</script>

<template>
  <div class="flex flex-col h-full">
    <AppHeader
      title="Уведомления"
      sub="Приходят в Telegram от бота"
      back
      :back-to="PATHS.PROFILE"
    />

    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <span
        class="w-6 h-6 rounded-full border-2 border-d-border-soft border-t-d-accent animate-d-spin"
      />
    </div>

    <div v-else class="flex-1 overflow-y-auto px-[18px] py-4">
      <div class="bg-d-panel border border-d-border rounded-sheet p-4 mb-4">
        <ToggleRow v-model="enabled" label="Все уведомления" hint="Выключить, не блокируя бота" />
      </div>

      <div class="text-overline uppercase text-d-text-hint mb-2.5">По событиям</div>
      <div class="bg-d-panel border border-d-border rounded-sheet p-4 flex flex-col gap-4">
        <ToggleRow
          v-for="event in EVENTS"
          :key="event.key"
          v-model="prefs[event.key]"
          :label="event.label"
          :hint="event.hint"
          :disabled="!enabled"
        />
        <ToggleRow
          :model-value="true"
          label="Подтверждение сделки"
          hint="Вторая сторона подтвердила или ждёт вас"
          disabled
          @update:model-value="() => {}"
        />
      </div>

      <!-- без этого человек ждёт занятие, которого не будет -->
      <div class="flex gap-2.5 mt-4">
        <span class="shrink-0 text-d-rating">!</span>
        <p class="text-caption text-d-text-hint">
          О сорванной или отменённой сделке мы сообщим всегда — это нельзя отключить.
        </p>
      </div>
    </div>
  </div>
</template>
