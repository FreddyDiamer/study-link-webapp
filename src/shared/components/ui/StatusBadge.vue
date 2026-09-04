<script setup lang="ts">
import { computed } from 'vue'
import { DealStatus, ResponseStatus, ServiceStatus } from '@/shared/types'
import {
  DEAL_STATUS_META,
  RESPONSE_STATUS_META,
  SERVICE_STATUS_META,
  type StatusMeta,
} from '@/shared/constants/status'

interface Props {
  // одно из трёх семейств статусов
  deal?: DealStatus
  response?: ResponseStatus
  service?: ServiceStatus
}

const props = defineProps<Props>()

const meta = computed<StatusMeta | null>(() => {
  if (props.deal) return DEAL_STATUS_META[props.deal]
  if (props.response) return RESPONSE_STATUS_META[props.response]
  if (props.service) return SERVICE_STATUS_META[props.service]
  return null
})
</script>

<template>
  <span v-if="meta" class="badge" :class="meta.badge">{{ meta.label }}</span>
</template>
