export type TabType = 'requests' | 'responses' | 'deals'

export const TABS = [
  { id: 'requests' as const, label: 'Заявки', icon: '📋' },
  { id: 'responses' as const, label: 'Отклики', icon: '📤' },
  { id: 'deals' as const, label: 'Активные', icon: '🟢' },
] as const
