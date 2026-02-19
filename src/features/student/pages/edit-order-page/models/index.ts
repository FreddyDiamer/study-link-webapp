export const DEADLINES = [
  { value: 'day', label: 'День', description: 'Исполнение в течение дня' },
  { value: 'week', label: 'Неделя', description: 'Исполнение в течение недели' },
  { value: 'endOfSemester', label: 'До конца семестра', description: 'Исполнение до конца семестра' },
  { value: 'custom', label: 'Выбрать день', description: 'Указать конкретную дату' },
] as const

export const URGENCY_OPTIONS = [
  { value: 'low', label: 'Низкая' },
  { value: 'normal', label: 'Средняя' },
  { value: 'high', label: 'Высокая' },
] as const
