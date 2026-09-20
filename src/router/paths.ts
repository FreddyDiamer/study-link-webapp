export const PATHS = {
  HOME: '/',
  // 3 таба дизайна
  MARKET: '/market',
  DEALS: '/deals',
  PROFILE: '/profile',
  MY_RESPONSES: '/profile/responses',
  PROFILE_EDIT: '/profile/edit',
  NOTIFICATIONS: '/profile/notifications',
  // под-экраны маркета · услуги (вы исполнитель)
  SERVICE_CREATE: '/market/services/create',
  SERVICE_DETAIL: '/market/services/:id',
  // под-экраны маркета · заявки (вы заказчик)
  REQUEST_CREATE: '/market/requests/create',
  REQUEST_DETAIL: '/market/requests/:id',
  REQUEST_EDIT: '/market/requests/:id/edit',
  REQUEST_RESPOND: '/market/requests/:id/respond',
} as const

export type AppPath = (typeof PATHS)[keyof typeof PATHS]

// помощники для навигации с параметром
export const serviceDetailPath = (id: string) => `/market/services/${id}`
export const requestDetailPath = (id: string) => `/market/requests/${id}`
export const requestEditPath = (id: string) => `/market/requests/${id}/edit`
export const requestRespondPath = (id: string) => `/market/requests/${id}/respond`

// сделки открываются на стороне, с которой пришли: с услуги — исполнитель, с заявки — заказчик
export const dealsPath = (role: 'customer' | 'worker') => `${PATHS.DEALS}?role=${role}`
