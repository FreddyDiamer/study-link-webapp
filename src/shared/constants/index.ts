// App constants
export const APP_NAME = 'Kai Repetitor'
export const APP_VERSION = '1.0.0'

// API endpoints
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const MOCK_INIT_DATA = import.meta.env.VITE_MOCK_TELEGRAM_INIT_DATA || ''

// Telegram constants
export const TELEGRAM_BOT_NAME = 'kai_repetitor_bot'

// User roles
export const USER_ROLES = {
  STUDENT: 'student',
  TUTOR: 'tutor',
  BOTH: 'both',
} as const

// Service formats
export const SERVICE_FORMATS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  HYBRID: 'hybrid',
} as const

// Order urgency levels
export const ORDER_URGENCY = {
  TODAY: 'today',
  THIS_WEEK: 'this_week',
  NOT_URGENT: 'not_urgent',
} as const

// Order statuses
export const ORDER_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

// Validation rules
export const VALIDATION = {
  MIN_PRICE: 100,
  MAX_PRICE: 10000,
  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 500,
} as const

// Local storage keys
export const STORAGE_KEYS = {
  USER: 'kai_user',
  AUTH_TOKEN: 'kai_auth_token',
  THEME: 'kai_theme',
} as const

export { ROLE_META, type Role, type RoleMeta } from './roles'
