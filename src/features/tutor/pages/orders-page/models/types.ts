import type { SelectOption } from '@/shared/components/ui'

export interface DealFilters {
  search: string
  subject: string | null
  teacher: string | null
  status: 'all' | 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  source: 'all' | 'request' | 'service'
  sortBy: 'price' | 'date' | 'deadline' | 'updated'
  sortOrder: 'asc' | 'desc'
}

export type OrdersTab = 'all' | 'active' | 'completed'

export const SORT_OPTIONS: SelectOption[] = [
  { value: 'price', label: 'По цене' },
  { value: 'date', label: 'По дате создания' },
  { value: 'deadline', label: 'По дедлайну' },
  { value: 'updated', label: 'По обновлению' },
]

export const SORT_ORDER_OPTIONS: SelectOption[] = [
  { value: 'asc', label: 'По возрастанию' },
  { value: 'desc', label: 'По убыванию' },
]

export const DEFAULT_FILTERS: DealFilters = {
  search: '',
  subject: null,
  teacher: null,
  status: 'all',
  source: 'all',
  sortBy: 'date',
  sortOrder: 'desc',
}
