/**
 * Роль пользователя — свойство объекта: на своей заявке и на чужой услуге вы заказчик,
 * на своей услуге и на чужой заявке — исполнитель. У каждой роли свой цвет, и он
 * красит только метки и акценты; главные кнопки остаются единым акцентом действия.
 * Классы записаны целиком — Tailwind собирает их из исходников.
 */
export type Role = 'worker' | 'customer'

export interface RoleMeta {
  /** «Исполнитель» / «Заказчик» */
  label: string
  /** «Вы исполнитель» / «Вы заказчик» */
  you: string
  /** цвет текста роли */
  text: string
  /** мягкая плашка: фон роли + текст роли */
  soft: string
  /** сплошная заливка (активный сегмент, точка-подсказка) */
  solid: string
  /** обёртка: всё «действие» внутри (кнопки, фокус, выбор) — цветом роли */
  scope: string
}

export const ROLE_META: Record<Role, RoleMeta> = {
  worker: {
    label: 'Исполнитель',
    you: 'Вы исполнитель',
    text: 'text-d-role-worker',
    soft: 'bg-d-role-worker/[0.16] text-d-role-worker',
    solid: 'bg-d-role-worker',
    scope: 'role-worker',
  },
  customer: {
    label: 'Заказчик',
    you: 'Вы заказчик',
    text: 'text-d-role-customer',
    soft: 'bg-d-role-customer/[0.14] text-d-role-customer',
    solid: 'bg-d-role-customer',
    scope: 'role-customer',
  },
}
