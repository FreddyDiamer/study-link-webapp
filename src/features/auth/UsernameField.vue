<script setup lang="ts">
import { computed, onMounted, useId, useTemplateRef } from 'vue'

interface Props {
  loading?: boolean
  disabled?: boolean
  /** ошибка именно этого поля: красит рамку и читается скринридером */
  error?: string
}
const props = withDefaults(defineProps<Props>(), { loading: false, disabled: false, error: '' })
const emit = defineEmits<{ submit: [] }>()

/** username без «@»: префикс уже нарисован в поле, а бэкенду он не нужен */
const model = defineModel<string>({ required: true })

const id = useId()
const errorId = `${id}-error`
const input = useTemplateRef<HTMLInputElement>('input')

const canSubmit = computed(() => model.value.length > 0 && !props.loading && !props.disabled)

// ни «@», ни пробелов в username не бывает: вставленное «@anna_math » чистим на лету
const handleInput = (event: Event) => {
  const el = event.target as HTMLInputElement
  const clean = el.value.replace(/[@\s]+/g, '')
  if (clean !== el.value) el.value = clean
  model.value = clean
}

const handleSubmit = () => {
  if (!canSubmit.value) return
  emit('submit')
}

// экран открывают, чтобы войти: курсор сразу в поле
onMounted(() => input.value?.focus())
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <label :for="id" class="block text-overline uppercase text-d-text-hint mb-2.5">
      Войти по username
    </label>

    <div
      class="flex items-center h-[52px] rounded-card bg-d-panel border pl-4 pr-1.5 transition-colors"
      :class="error ? 'border-d-coral' : 'border-d-border-soft focus-within:border-d-act'"
    >
      <span class="text-body text-d-text-hint" aria-hidden="true">@</span>
      <input
        :id="id"
        ref="input"
        :value="model"
        type="text"
        placeholder="username"
        autocomplete="username"
        autocapitalize="off"
        autocorrect="off"
        spellcheck="false"
        enterkeyhint="go"
        :aria-invalid="!!error"
        :aria-describedby="error ? errorId : undefined"
        class="flex-1 min-w-0 bg-transparent text-body pl-0.5 pr-2 focus:outline-none placeholder:text-d-text-hint"
        @input="handleInput"
      />
      <!-- стрелка загорается, как только есть что отправить; Enter работает так же -->
      <button
        type="submit"
        class="press shrink-0 w-10 h-10 rounded-chip flex items-center justify-center transition-colors"
        :class="canSubmit || loading ? 'bg-d-accent text-d-ink' : 'bg-d-surface text-d-text-hint'"
        :disabled="!canSubmit"
        aria-label="Войти"
      >
        <span
          v-if="loading"
          class="w-4 h-4 rounded-full border-2 border-current/30 border-t-current animate-d-spin"
          aria-hidden="true"
        />
        <svg
          v-else
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </div>

    <p v-if="error" :id="errorId" role="alert" class="text-caption text-d-coral mt-2">
      {{ error }}
    </p>
  </form>
</template>
