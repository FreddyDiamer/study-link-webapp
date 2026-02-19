<script setup lang="ts">
import Card from '@/shared/components/ui/Card.vue'

defineEmits<{
  click: []
}>()
</script>

<template>
  <div class="relative mt-6 group cursor-pointer" @click="$emit('click')">
    <div
      class="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-xl opacity-75 group-hover:opacity-100 transition-all duration-300 blur-sm group-hover:blur-none"
    ></div>
    <Card
      class="relative p-6 backdrop-blur-sm bg-white/10 border border-white/20 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div
            class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300"
          >
            <div class="text-xl">🌟</div>
          </div>
          <div>
            <h3 class="text-white font-semibold text-lg mb-1">Сделаем платформу лучше!</h3>
            <p class="text-white/80 text-sm">Поделись опытом • Предложи улучшения 💪</p>
          </div>
        </div>
        <div
          class="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300"
        >
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      <div class="mt-4 pt-4 border-t border-white/20">
        <div class="flex items-center justify-between text-white/70 text-xs">
          <span>🎓 Твой опыт ценен</span>
          <span>🚀 Влияй на развитие</span>
        </div>
      </div>
    </Card>
  </div>
</template>
