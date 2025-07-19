<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'

interface SelectOption {
  value: string
  label: string
}

interface Props {
  modelValue: string
  options: SelectOption[]
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Выберите...',
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isOpen = ref(false)
const inputValue = ref('')
const mainInput = ref<HTMLInputElement>()
const highlightedIndex = ref(-1)
const selectId = computed(() => `select-${Math.random().toString(36).substr(2, 9)}`)

const selectedOption = computed(() => {
  return props.options.find((option) => option.value === props.modelValue)
})

const filteredOptions = computed(() => {
  if (!inputValue.value) {
    return props.options
  }

  const query = inputValue.value.toLowerCase()
  return props.options.filter((option) => option.label.toLowerCase().includes(query))
})

// Синхронизация inputValue с выбранным значением
watch(
  () => props.modelValue,
  (newValue) => {
    const option = props.options.find((opt) => opt.value === newValue)
    inputValue.value = option ? option.label : ''
  },
  { immediate: true },
)

const handleInput = () => {
  if (!isOpen.value) {
    openDropdown()
  }
  highlightedIndex.value = -1
}

const openDropdown = () => {
  if (!props.disabled) {
    isOpen.value = true
    highlightedIndex.value = -1
  }
}

const toggleDropdown = () => {
  if (!props.disabled) {
    if (isOpen.value) {
      closeDropdown()
    } else {
      openDropdown()
      mainInput.value?.focus()
    }
  }
}

const closeDropdown = () => {
  isOpen.value = false
  highlightedIndex.value = -1

  // Восстанавливаем значение, если ничего не выбрано
  const option = props.options.find((opt) => opt.value === props.modelValue)
  inputValue.value = option ? option.label : ''
}

const selectOption = (option: SelectOption) => {
  emit('update:modelValue', option.value)
  inputValue.value = option.label
  closeDropdown()
}

const selectFirstFiltered = () => {
  if (filteredOptions.value.length > 0) {
    selectOption(filteredOptions.value[0])
  }
}

const navigateUp = () => {
  if (highlightedIndex.value > 0) {
    highlightedIndex.value--
  } else if (highlightedIndex.value === -1) {
    highlightedIndex.value = filteredOptions.value.length - 1
  }
}

const navigateDown = () => {
  if (highlightedIndex.value < filteredOptions.value.length - 1) {
    highlightedIndex.value++
  } else if (highlightedIndex.value === -1) {
    highlightedIndex.value = 0
  }
}

const highlightSearchText = (text: string) => {
  if (!inputValue.value) return text

  const query = inputValue.value.toLowerCase()
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark class="bg-telegram-accent/20 text-telegram-accent">$1</mark>')
}

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest(`#${selectId.value}`) && !target.closest('.absolute')) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="space-y-2">
    <label v-if="label" :for="selectId" class="block text-sm font-medium text-telegram-text">
      {{ label }}
      <span v-if="required" class="text-telegram-destructive">*</span>
    </label>

    <div class="relative">
      <div class="relative">
        <input
          :id="selectId"
          ref="mainInput"
          v-model="inputValue"
          type="text"
          :placeholder="placeholder"
          :disabled="disabled"
          :required="required"
          class="input w-full pr-10"
          :class="{
            'opacity-50 cursor-not-allowed': disabled,
            'border-telegram-accent': isOpen,
          }"
          @input="handleInput"
          @focus="openDropdown"
          @keydown.esc="closeDropdown"
          @keydown.enter.prevent="selectFirstFiltered"
          @keydown.up.prevent="navigateUp"
          @keydown.down.prevent="navigateDown"
          @keydown.tab="closeDropdown"
        />

        <button
          @click="toggleDropdown"
          :disabled="disabled"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-telegram-textSecondary hover:text-telegram-text transition-colors"
        >
          <svg
            class="w-5 h-5 transition-transform duration-200"
            :class="{ 'rotate-180': isOpen }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      <!-- Dropdown -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div
          v-if="isOpen && filteredOptions.length > 0"
          class="absolute z-50 mt-2 w-full bg-telegram-card border border-telegram-border rounded-xl shadow-lg max-h-60 overflow-y-auto"
        >
          <button
            v-for="(option, index) in filteredOptions"
            :key="option.value"
            @click="selectOption(option)"
            class="w-full px-4 py-3 text-left hover:bg-telegram-secondary transition-colors border-b border-telegram-border last:border-b-0"
            :class="{
              'bg-telegram-accent/10 text-telegram-accent': modelValue === option.value,
              'text-telegram-text': modelValue !== option.value,
              'bg-telegram-secondary': highlightedIndex === index,
            }"
            @mouseenter="highlightedIndex = index"
          >
            <div class="flex items-center justify-between">
              <span class="font-medium" v-html="highlightSearchText(option.label)"></span>
              <svg
                v-if="modelValue === option.value"
                class="w-4 h-4 text-telegram-accent"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </button>
        </div>
      </Transition>

      <!-- No results dropdown -->
      <div
        v-if="isOpen && filteredOptions.length === 0 && inputValue"
        class="absolute z-50 mt-2 w-full bg-telegram-card border border-telegram-border rounded-xl shadow-lg"
      >
        <div class="px-4 py-6 text-center text-telegram-textSecondary">
          <svg
            class="w-8 h-8 mx-auto mb-2 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p class="text-sm">Ничего не найдено</p>
          <p class="text-xs mt-1">Попробуйте изменить запрос</p>
        </div>
      </div>
    </div>

    <p v-if="error" class="text-sm text-telegram-destructive">
      {{ error }}
    </p>
  </div>
</template>
