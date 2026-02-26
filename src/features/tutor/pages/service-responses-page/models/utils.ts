import type { ResponseStatus, ResponseStatusInfo } from './types'

export function getResponseStatusInfo(status: string): ResponseStatusInfo {
  switch (status) {
    case 'PENDING':
      return { color: 'bg-orange-500', text: 'Ожидает ответа', textColor: 'text-orange-600' }
    case 'ACCEPTED':
      return { color: 'bg-telegram-success', text: 'Принят', textColor: 'text-telegram-success' }
    case 'REJECTED':
      return { color: 'bg-red-500', text: 'Отклонен', textColor: 'text-red-600' }
    case 'EXPIRED':
      return {
        color: 'bg-telegram-textSecondary',
        text: 'Истек',
        textColor: 'text-telegram-textSecondary',
      }
    default:
      return {
        color: 'bg-telegram-textSecondary',
        text: 'Неизвестно',
        textColor: 'text-telegram-textSecondary',
      }
  }
}

export function formatResponseDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatResponseDeadline(
  dateString: string | null,
  type?: string,
): string | null {
  if (!dateString) return null

  // Если студент выбрал предопределённую протяженность, показываем её явно
  switch (type) {
    case 'today':
      return 'Сегодня (срочно)'
    case 'week':
      return 'На этой неделе'
    case 'month':
      return 'В течение месяца'
    // custom и неизвестные типы — обрабатываем как обычную дату ниже
  }

  const date = new Date(dateString)
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)
  if (diffMs < 0) return 'Просрочен'
  if (diffHours < 1) return 'Скоро'
  if (diffHours < 24) return `Через ${diffHours} ч.`
  if (diffDays === 1) return 'Завтра'
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
