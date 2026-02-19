import type { TutorServicesTab } from './types'

export const TABS: { id: TutorServicesTab; label: string; icon: string }[] = [
  { id: 'services', label: 'Заявки', icon: '📋' },
  { id: 'responses', label: 'Отклики', icon: '📤' },
  { id: 'deals', label: 'Активные', icon: '🟢' },
]
