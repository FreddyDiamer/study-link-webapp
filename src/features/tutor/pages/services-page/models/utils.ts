import type { ServiceStatus, TutorActiveDeal, TutorRequestResponse } from './types'

export function getStatusLabel(status: ServiceStatus): string {
  switch (status) {
    case 'active':
      return 'Активна'
    case 'frozen':
      return 'Заморожена'
    case 'deleted':
      return 'Удалена'
  }
}

export function getStatusClass(status: ServiceStatus): string {
  switch (status) {
    case 'active':
      return 'bg-telegram-success/20 text-telegram-success'
    case 'frozen':
      return 'bg-yellow-500/20 text-yellow-600'
    case 'deleted':
      return 'bg-red-500/20 text-red-600'
  }
}

export function getResponseStatusLabel(status: TutorRequestResponse['status']): string {
  switch (status) {
    case 'pending':
      return 'Ожидает ответа'
    case 'accepted':
      return 'Принят'
    case 'rejected':
      return 'Отклонен'
    case 'expired':
      return 'Истек срок'
  }
}

export function getResponseStatusClass(status: TutorRequestResponse['status']): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-600'
    case 'accepted':
      return 'bg-telegram-success/20 text-telegram-success'
    case 'rejected':
      return 'bg-red-500/20 text-red-600'
    case 'expired':
      return 'bg-gray-500/20 text-gray-600'
  }
}

export function getResponseStatusVariant(
  status: TutorRequestResponse['status'],
): 'pending' | 'success' | 'error' | 'neutral' {
  switch (status) {
    case 'pending':
      return 'pending'
    case 'accepted':
      return 'success'
    case 'rejected':
      return 'error'
    case 'expired':
      return 'neutral'
  }
}

export function getUrgencyLabel(urgency?: TutorRequestResponse['urgency']): string {
  switch (urgency) {
    case 'high':
      return 'Срочно'
    case 'medium':
      return 'Средняя'
    case 'low':
      return 'Не срочно'
    default:
      return ''
  }
}

export function getUrgencyClass(urgency?: TutorRequestResponse['urgency']): string {
  switch (urgency) {
    case 'high':
      return 'text-red-600'
    case 'medium':
      return 'text-yellow-600'
    case 'low':
      return 'text-green-600'
    default:
      return 'text-telegram-textSecondary'
  }
}

export function getDealStatusLabel(status: TutorActiveDeal['status']): string {
  switch (status) {
    case 'pending':
      return 'Ожидает подтверждения'
    case 'accepted':
      return 'Принята'
    case 'in_progress':
      return 'В процессе'
    case 'completed':
      return 'Завершена'
  }
}

export function getDealStatusClass(status: TutorActiveDeal['status']): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-600'
    case 'accepted':
      return 'bg-blue-500/20 text-blue-600'
    case 'in_progress':
      return 'bg-telegram-accent/20 text-telegram-accent'
    case 'completed':
      return 'bg-telegram-success/20 text-telegram-success'
  }
}
