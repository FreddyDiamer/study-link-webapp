export const PATHS = {
  HOME: '/',
  // 3 таба дизайна
  MARKET: '/market',
  DEALS: '/deals',
  PROFILE: '/profile',
  // под-экраны маркета
  SERVICE_CREATE: '/market/create',
  SERVICE_DETAIL: '/market/:id',
  SERVICE_RESPOND: '/market/:id/respond',
} as const

export type AppPath = (typeof PATHS)[keyof typeof PATHS]

// помощники для навигации с параметром
export const serviceDetailPath = (id: string) => `/market/${id}`
export const serviceRespondPath = (id: string) => `/market/${id}/respond`
