import type { Request } from '@/shared/types'

export function getDealDescription(item: Request | null): string {
  if (!item) return ''
  if (typeof item?.description === 'string' && item.description) return item.description
  const rr = item as any
  if (rr?.requestResponse?.request?.description) return rr.requestResponse.request.description
  if (rr?.serviceResponse?.service?.description) return rr.serviceResponse.service.description ?? ''
  return rr?.requestResponse?.message || rr?.serviceResponse?.message || ''
}

export function formatOrderDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)
  if (diffHours < 1) return 'Только что'
  if (diffHours < 24) return `${diffHours} ч. назад`
  if (diffDays === 1) return 'Вчера'
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function formatDeadlineInfo(deadlineString: string): { text: string; className: string } {
  const deadline = new Date(deadlineString)
  const todayStart = startOfDay(new Date())
  const deadlineStart = startOfDay(deadline)
  if (deadlineStart.getTime() === todayStart.getTime()) {
    return { text: 'сегодня', className: 'text-telegram-accent font-medium' }
  }
  if (deadlineStart.getTime() < todayStart.getTime()) {
    return { text: 'Срок истек', className: 'text-telegram-destructive font-medium' }
  }
  return {
    text: deadline.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
    className: 'text-telegram-textSecondary',
  }
}
