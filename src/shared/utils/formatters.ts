export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj)
}

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInMs = now.getTime() - dateObj.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInMinutes < 1) return 'только что'
  if (diffInMinutes < 60) return `${diffInMinutes} мин. назад`
  if (diffInHours < 24) return `${diffInHours} ч. назад`
  if (diffInDays < 7) return `${diffInDays} дн. назад`

  return formatDate(dateObj)
}

export const formatUserName = (firstName: string, lastName?: string): string => {
  return lastName ? `${firstName} ${lastName}` : firstName
}

export const formatRating = (rating: number, reviewsCount: number): string => {
  if (reviewsCount === 0) return 'Нет отзывов'
  return `${rating.toFixed(1)} (${reviewsCount})`
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Цена из копеек бэкенда в рублёвую строку: 150000 → «1 500 ₽».
 * Единая точка форматирования денег в UI (см. money-правило в .agents/rules).
 */
export const formatKopeks = (kopeks?: number | null): string => {
  if (kopeks == null) return '—'
  const rubles = Math.round(kopeks / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return `${rubles} ₽`
}

/** Русское склонение по числу: pluralize(3, 'отклик', 'отклика', 'откликов') → «отклика». */
export const pluralize = (n: number, one: string, few: string, many: string): string => {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 14) return many
  if (mod10 === 1) return one
  if (mod10 >= 2 && mod10 <= 4) return few
  return many
}

/** «3 отклика» — число со склонённым словом. */
export const countWithWord = (n: number, one: string, few: string, many: string): string =>
  `${n} ${pluralize(n, one, few, many)}`

/** Дедлайн в стиле дизайна: «до 28 июня». Без года, месяц в родительном падеже. */
export const formatDeadline = (date?: string | Date | null, prefix = 'до'): string => {
  if (!date) return 'Срок не указан'
  const dateObj = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(dateObj.getTime())) return 'Срок не указан'
  const formatted = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(
    dateObj,
  )
  return prefix ? `${prefix} ${formatted}` : formatted
}

/** Дата без года: «24 июня». Используется в чек-листах и отзывах. */
export const formatDayMonth = (date?: string | Date | null): string => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(dateObj.getTime())) return ''
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(dateObj)
}

/** «с 2 июня» — на новом профиле это одна из немногих проверяемых опор доверия. */
export const formatJoined = (date?: string | Date | null): string => {
  const formatted = formatDayMonth(date)
  return formatted ? `с ${formatted}` : ''
}

/** Прибавляет дни к дате — срок авто-закрытия сделки. */
export const addDays = (date: string | Date, days: number): Date => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const result = new Date(dateObj)
  result.setDate(result.getDate() + days)
  return result
}
