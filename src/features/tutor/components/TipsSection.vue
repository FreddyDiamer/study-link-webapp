<script setup lang="ts">
import { Card } from '@components/ui'
</script>

<template>
  <Card class="p-6 bg-d-accent/5 border-d-accent/20">
    <div class="flex items-start space-x-3">
      <div
        class="w-8 h-8 bg-d-accent rounded-full flex items-center justify-center flex-shrink-0"
      >
        <svg class="w-4 h-4 text-d-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <div>
        <h3 class="text-d-accent font-semibold mb-2">Совет для начала работы</h3>
        <p class="text-d-text text-subhead leading-relaxed">
          Добавьте подробное описание ваших услуг с указанием предметов, опыта и стоимости. Студенты
          чаще выбирают репетиторов с полной информацией о себе.
        </p>
      </div>
    </div>
  </Card>
</template>
