<script setup lang="ts">
interface Row {
  done?: boolean
  timedOut?: boolean
  text: string
}

interface Props {
  rows: Row[]
}
defineProps<Props>()
</script>

<template>
  <!-- чек-лист вместо степпера: он объясняет, чего именно ждёт сделка -->
  <div class="flex flex-col gap-2">
    <div v-for="(row, i) in rows" :key="i" class="flex items-center gap-2.5">
      <span
        class="shrink-0 w-[18px] h-[18px] rounded-full flex items-center justify-center text-[11px] font-bold transition-colors duration-300"
        :key="`${row.done}-${row.timedOut}`"
        :class="
          row.done
            ? 'bg-d-act text-d-ink animate-d-pop'
            : row.timedOut
              ? 'bg-d-surface text-d-text-hint'
              : 'border border-d-border-soft text-transparent'
        "
      >
        {{ row.done ? '✓' : row.timedOut ? '⏱' : '·' }}
      </span>
      <span class="text-subhead" :class="row.done ? 'text-d-text' : 'text-d-text-second'">
        {{ row.text }}
      </span>
    </div>
  </div>
</template>
