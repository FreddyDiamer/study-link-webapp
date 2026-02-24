export type TabType = 'requests' | 'responses' | 'deals' | 'deals-completed'

export const TABS = [
  { id: 'requests' as const, label: 'Заявки', icon: '📋' },
  { id: 'responses' as const, label: 'Отклики', icon: '📤' },
  { id: 'deals' as const, label: 'Активные', icon: '🟢' },
  { id: 'deals-completed' as const, label: 'Завершённые', icon: '✅' },
] as const
