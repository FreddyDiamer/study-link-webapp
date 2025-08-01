<script setup lang="ts">
interface Props {
  title: string
  description: string
  icon: string
  actionText?: string
  actionIcon?: string
}

const props = withDefaults(defineProps<Props>(), {
  actionText: '',
  actionIcon: '',
})

const emit = defineEmits<{
  action: []
}>()

const handleAction = () => {
  emit('action')
}
</script>

<template>
  <div class="text-center py-16">
    <div
      class="w-20 h-20 bg-telegram-secondary rounded-full mx-auto mb-6 flex items-center justify-center"
    >
      <span class="text-3xl">{{ icon }}</span>
    </div>

    <h2 class="text-xl font-semibold text-telegram-text mb-3">{{ title }}</h2>

    <p class="text-telegram-textSecondary mb-8 max-w-sm mx-auto">
      {{ description }}
    </p>

    <Button v-if="actionText" @click="handleAction" class="mx-auto">
      <span v-if="actionIcon" class="mr-2">{{ actionIcon }}</span>
      {{ actionText }}
    </Button>
  </div>
</template>
