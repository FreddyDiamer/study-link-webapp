import { DealStatus, ResponseStatus, ServiceStatus } from '@/shared/types'

/**
 * Единая палитра статус-бейджей (Defiant edition, см. claude-design/tokens.css).
 * `badge` — CSS-класс плашки из main.css (@layer components).
 * `label` — RU-строка из claude-design/translation.html.
 *
 * PENDING → gold · ACCEPTED → indigo · IN_PROGRESS → indigo-hi ·
 * COMPLETED/ACTIVE → teal · REJECTED/SUSPENDED → coral · прочее → neutral.
 */
export type StatusBadgeVariant =
  | 'badge-pending'
  | 'badge-accent'
  | 'badge-progress'
  | 'badge-teal'
  | 'badge-coral'
  | 'badge-neutral'

export interface StatusMeta {
  label: string
  badge: StatusBadgeVariant
}

// DealStatus — про сделку (ж. род): «Принята», «Завершена», «Отменена»
export const DEAL_STATUS_META: Record<DealStatus, StatusMeta> = {
  [DealStatus.PENDING]: { label: 'Ожидает', badge: 'badge-pending' },
  [DealStatus.ACCEPTED]: { label: 'Принята', badge: 'badge-accent' },
  [DealStatus.IN_PROGRESS]: { label: 'В работе', badge: 'badge-progress' },
  [DealStatus.COMPLETED]: { label: 'Завершена', badge: 'badge-teal' },
  [DealStatus.CANCELLED]: { label: 'Отменена', badge: 'badge-neutral' },
}

// ResponseStatus — про отклик (м. род): «Принят»
export const RESPONSE_STATUS_META: Record<ResponseStatus, StatusMeta> = {
  [ResponseStatus.PENDING]: { label: 'Ожидает', badge: 'badge-pending' },
  [ResponseStatus.ACCEPTED]: { label: 'Принят', badge: 'badge-accent' },
  [ResponseStatus.REJECTED]: { label: 'Отклонён', badge: 'badge-coral' },
  [ResponseStatus.EXPIRED]: { label: 'Истёк', badge: 'badge-neutral' },
}

export const SERVICE_STATUS_META: Record<ServiceStatus, StatusMeta> = {
  [ServiceStatus.ACTIVE]: { label: 'Активна', badge: 'badge-teal' },
  [ServiceStatus.INACTIVE]: { label: 'Скрыта', badge: 'badge-neutral' },
  [ServiceStatus.SUSPENDED]: { label: 'Заблокирована', badge: 'badge-coral' },
}
