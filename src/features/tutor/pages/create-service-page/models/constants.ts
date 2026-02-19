import type { SelectOption } from '@/shared/components/ui'

export const DEADLINES: SelectOption[] = [
  { value: '1', label: '1 день' },
  { value: '3', label: '3 дня' },
  { value: '7', label: '1 неделя' },
  { value: 'custom', label: 'Другой срок' },
]
