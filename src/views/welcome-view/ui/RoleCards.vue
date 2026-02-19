<script setup lang="ts">
import Card from '@/shared/components/ui/Card.vue'
import type { UserFlow } from '../models'

defineProps<{
  isLoaded: boolean
}>()

const emit = defineEmits<{
  selectRole: [flow: UserFlow]
}>()
</script>

<template>
  <div
    class="flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 delay-300"
    :class="{ 'animate-slide-up': isLoaded }"
  >
    <Card
      class="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] p-4 bg-white/20 backdrop-blur-sm border border-white/30 hover:border-white/60 hover:bg-white/30 transition-all duration-300 cursor-pointer transform hover:scale-[1.05] active:scale-[0.98] flex flex-col items-center justify-center text-center"
      @click="emit('selectRole', 'student')"
    >
      <div
        class="w-12 h-12 sm:w-14 sm:h-14 bg-white/40 rounded-xl flex items-center justify-center mb-3"
      >
        <svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>
      <h3 class="text-base sm:text-lg font-semibold text-white">Я студент</h3>
    </Card>

    <Card
      class="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] p-4 bg-white/20 backdrop-blur-sm border border-white/30 hover:border-white/60 hover:bg-white/30 transition-all duration-300 cursor-pointer transform hover:scale-[1.05] active:scale-[0.98] flex flex-col items-center justify-center text-center"
      @click="emit('selectRole', 'tutor')"
    >
      <div
        class="w-12 h-12 sm:w-14 sm:h-14 bg-white/40 rounded-xl flex items-center justify-center mb-3"
      >
        <svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      </div>
      <h3 class="text-base sm:text-lg font-semibold text-white">Я репетитор</h3>
    </Card>
  </div>
</template>
