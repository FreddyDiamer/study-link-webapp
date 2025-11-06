<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { ArrowIcon, LoupeIcon } from '../icons'
import { Input } from '.'

export interface SelectOption {
  value: string
  label: string
}

interface Props {
  modelValue?: SelectOption | null
  value?: string | null
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
  'update:modelValue': [value: SelectOption | null]
  'update:value': [value: string | null]
}>()

const isOpen = ref(false)
const inputValue = ref('')
const highlightedIndex = ref(-1)
const selectId = computed(() => `select-${Math.random().toString(36).substr(2, 9)}`)
const selectedOption = ref<SelectOption | null>(null)

const filteredOptions = computed(() => {
  let options = props.options

  if (inputValue.value) {
    const query = inputValue.value.toLowerCase()
    options = options.filter((option) => option.label.toLowerCase().includes(query))
  }

  // Добавляем опцию сброса если что-то выбрано
  if (selectedOption.value && !inputValue.value) {
    return [{ value: '', label: 'Отменить выбор' }, ...options]
  }

  return options
})

const handleValueChange = (value: string | null | undefined) => {
  if (props.value !== undefined) {
    selectedOption.value = props.options.find((opt) => opt.value === props.value) ?? null
  }
}

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
    // Очищаем поле поиска при открытии, чтобы показать все опции
    inputValue.value = ''
  }
}

const toggleDropdown = () => {
  if (!props.disabled) {
    if (isOpen.value) {
      closeDropdown()
    } else {
      openDropdown()
    }
  }
}

const closeDropdown = () => {
  isOpen.value = false
  highlightedIndex.value = -1

  // Восстанавливаем значение, если ничего не выбрано
  const option = props.options.find((opt) => opt.value === selectedOption?.value?.value)
  inputValue.value = option ? option.label : ''
}

const selectOption = (option: SelectOption) => {
  if (option.value === '') {
    // Отмена выбора
    selectedOption.value = null
    emit('update:modelValue', null)
    emit('update:value', null)
    inputValue.value = ''
  } else {
    selectedOption.value = option
    emit('update:modelValue', option)
    emit('update:value', option.value)
    inputValue.value = option.label
  }
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

// Синхронизация inputValue с выбранным значением
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== undefined) selectedOption.value = newValue
  },
)

watch(() => props.value, handleValueChange)

watch(
  () => selectedOption.value,
  (newValue) => {
    const option = props.options.find((opt) => opt.value === newValue?.value)
    inputValue.value = option ? option.label : ''
  },
  { immediate: true },
)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  handleValueChange(props.value)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="relative">
    <Input
      v-model="inputValue"
      type="text"
      :id="selectId"
      :label="label"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="{ 'opacity-50 cursor-not-allowed': disabled }"
      @input="handleInput"
      @click="toggleDropdown"
      @keydown.esc="closeDropdown"
      @keydown.enter.prevent="selectFirstFiltered"
      @keydown.up.prevent="navigateUp"
      @keydown.down.prevent="navigateDown"
      @keydown.tab="closeDropdown"
    >
      <template v-if="$slots.prepend" #prepend>
        <slot name="prepend" />
      </template>

      <template #append>
        <ArrowIcon
          class="w-5 h-5 transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
        />
      </template>
    </Input>

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
            'bg-telegram-accent/10 text-telegram-accent':
              selectedOption?.value === option.value && option.value !== '',
            'text-telegram-textSecondary italic': option.value === '',
            'text-telegram-text': selectedOption?.value !== option.value && option.value !== '',
            'bg-telegram-secondary': highlightedIndex === index,
          }"
          @mouseenter="highlightedIndex = index"
        >
          <div class="flex items-center justify-between">
            <span class="font-medium" v-html="highlightSearchText(option.label)"></span>
            <svg
              v-if="selectedOption?.value === option.value && option.value !== ''"
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
        <LoupeIcon class="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p class="text-sm">Ничего не найдено</p>
        <p class="text-xs mt-1">Попробуйте изменить запрос</p>
      </div>
    </div>

    <p v-if="error" class="text-sm text-telegram-destructive">
      {{ error }}
    </p>
  </div>
</template>
