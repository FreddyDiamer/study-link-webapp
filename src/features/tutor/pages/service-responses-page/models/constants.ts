import type { ResponseTabId } from './types'

export const RESPONSE_TABS: { id: ResponseTabId; label: string }[] = [
  { id: 'new', label: 'Новые отклики' },
  { id: 'active', label: 'Активные' },
  { id: 'completed', label: 'Завершенные' },
]
