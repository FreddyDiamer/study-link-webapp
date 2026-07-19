// API endpoints
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export const MOCK_INIT_DATA = import.meta.env.VITE_MOCK_TELEGRAM_INIT_DATA || ''

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
} as const
