<script setup lang="ts">
import { WelcomeHeader, RoleCards, BenefitsCard } from './ui'
import { useWelcome } from './hooks'

const { isLoaded, selectRole } = useWelcome()
</script>

<template>
  <div class="min-h-screen bg-telegram-bg">
    <WelcomeHeader :is-loaded="isLoaded">
      <RoleCards :is-loaded="isLoaded" @select-role="selectRole" />
    </WelcomeHeader>

    <div class="px-4 pt-6 pb-8">
      <BenefitsCard :is-loaded="isLoaded" />
    </div>
  </div>
</template>

<style scoped>
:deep(.animate-bounce-subtle) {
  animation: bounce-subtle 2s infinite;
}

:deep(.animate-fade-in) {
  opacity: 0;
  animation: fade-in 0.8s ease-out forwards;
}

:deep(.animate-slide-up) {
  opacity: 0;
  transform: translateY(20px);
  animation: slide-up 0.6s ease-out forwards;
}

@keyframes bounce-subtle {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes fade-in {
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
