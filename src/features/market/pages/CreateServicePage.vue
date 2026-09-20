<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useFormExit, useService, useToast } from '@/shared/composables'
import { useEducationStore } from '@/stores'
import { useTelegramStore } from '@/stores/telegram'
import { PATHS } from '@/router/paths'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import { ActionButton } from '@/shared/components/ui'

const { exitTo } = useFormExit()
const edu = useEducationStore()
const telegramStore = useTelegramStore()
const { createService } = useService()
const { showToast } = useToast()

const subjectId = ref('')
const teacherId = ref('')
const price = ref('')
const description = ref('')
const submitting = ref(false)
const error = ref('')

const teachersForSubject = computed(() => {
  const list = subjectId.value ? edu.getTeachersBySubject(subjectId.value) : []
  return list.length ? list : edu.teachers
})

// при смене предмета сбрасываем выбранного преподавателя
watch(subjectId, () => {
  if (!teachersForSubject.value.some((t) => t.id === teacherId.value)) teacherId.value = ''
})

const canSubmit = computed(
  () => !!subjectId.value && !!teacherId.value && Number(price.value) > 0 && !submitting.value,
)

const submit = async () => {
  if (!canSubmit.value) return
  submitting.value = true
  error.value = ''
  try {
    await createService({
      subjectId: subjectId.value,
      teacherId: teacherId.value,
      price: Math.round(Number(price.value) * 100), // рубли → копейки
      description: description.value || undefined,
    })
    telegramStore.hapticFeedback('success')
    showToast('Услуга опубликована')
    exitTo(PATHS.MARKET)
  } catch (e) {
    console.error('Не удалось создать услугу:', e)
    error.value = 'Не удалось создать услугу. Попробуйте ещё раз.'
    submitting.value = false
  }
}

onMounted(() => {
  if (!edu.isInitialized) edu.initialize().catch((e) => console.error(e))
})
</script>

<template>
  <div class="flex flex-col h-full">
    <AppHeader title="Новая услуга" sub="Вы исполнитель" back />

    <div class="flex-1 overflow-y-auto px-[18px] py-4 flex flex-col gap-5">
      <!-- предмет -->
      <div>
        <label class="block text-overline uppercase text-d-text-second mb-2.5">Предмет</label>
        <div class="relative">
          <select
            v-model="subjectId"
            class="d-select w-full h-[52px] rounded-[12px] bg-d-panel border border-d-border-soft px-4 pr-10 text-body appearance-none focus:border-d-accent focus:outline-none transition-colors"
            :class="subjectId ? 'text-d-text' : 'text-d-text-hint'"
          >
            <option value="" disabled>Выберите предмет</option>
            <option v-for="s in edu.activeSubjects" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
          <span
            class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-d-text-hint"
            >▾</span
          >
        </div>
      </div>

      <!-- преподаватель -->
      <div>
        <label class="block text-overline uppercase text-d-text-second mb-2.5">Преподаватель</label>
        <div class="relative">
          <select
            v-model="teacherId"
            :disabled="!subjectId"
            class="d-select w-full h-[52px] rounded-[12px] bg-d-panel border border-d-border-soft px-4 pr-10 text-body appearance-none focus:border-d-accent focus:outline-none transition-colors disabled:opacity-40"
            :class="teacherId ? 'text-d-text' : 'text-d-text-hint'"
          >
            <option value="" disabled>Выберите преподавателя</option>
            <option v-for="t in teachersForSubject" :key="t.id" :value="t.id">
              {{ t.fullName }}
            </option>
          </select>
          <span
            class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-d-text-hint"
            >▾</span
          >
        </div>
      </div>

      <!-- цена -->
      <div>
        <label class="block text-overline uppercase text-d-text-second mb-2.5">Цена занятия</label>
        <div
          class="flex items-center h-[52px] rounded-[12px] bg-d-panel border border-d-border-soft px-4 focus-within:border-d-accent transition-colors"
        >
          <span class="text-body text-d-text-hint">₽</span>
          <input
            v-model="price"
            type="number"
            inputmode="numeric"
            placeholder="1 500"
            class="flex-1 bg-transparent text-right text-[20px] font-bold tnum focus:outline-none placeholder:text-d-text-hint placeholder:font-normal"
          />
        </div>
      </div>

      <!-- описание -->
      <div>
        <label class="block text-overline uppercase text-d-text-second mb-2.5">
          Описание <span class="text-d-text-hint normal-case font-normal">· необязательно</span>
        </label>
        <textarea
          v-model="description"
          rows="3"
          placeholder="Помогу с пределами, производными и интегралами…"
          class="w-full min-h-[94px] rounded-[12px] bg-d-panel border border-d-border-soft focus:border-d-accent focus:outline-none px-4 py-3.5 text-body leading-[1.45] resize-none transition-colors"
        />
      </div>

      <p v-if="error" class="text-caption text-d-coral">{{ error }}</p>
    </div>

    <div
      class="shrink-0 px-[18px] pt-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))] bg-d-ink border-t border-d-border"
    >
      <ActionButton :loading="submitting" :disabled="!canSubmit" @click="submit">
        Опубликовать услугу
      </ActionButton>
    </div>
  </div>
</template>

<style scoped>
/* тёмная нативная выпадашка/календарь */
.d-select {
  color-scheme: dark;
}
</style>
