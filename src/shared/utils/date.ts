/**
 * Поле даты отдаёт «2026-10-14», а бэкенд хранит дату-время и ждёт полный ISO.
 * Срок «до 14 октября» — это конец этого дня по местному времени: так заявка не истекает
 * утром того дня, который человек сам назвал крайним.
 */
export const dateInputToIso = (value: string): string | undefined => {
  if (!value) return undefined
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return undefined
  return new Date(year, month - 1, day, 23, 59, 59, 999).toISOString()
}

/** Обратно — для формы редактирования: местная дата, а не UTC-кусок строки. */
export const isoToDateInput = (iso?: string | null): string => {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** Сегодня в формате поля даты — нижняя граница срока. */
export const todayDateInput = (): string => isoToDateInput(new Date().toISOString())

/** Срок раньше сегодняшнего дня. Пустой срок прошедшим не считается. */
export const isPastDateInput = (value: string): boolean => !!value && value < todayDateInput()
