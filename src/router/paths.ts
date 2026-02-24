export const PATHS = {
  // Core
  HOME: '/',

  // Student paths
  STUDENT_MAIN: '/student',
  STUDENT_ORDERS: '/student/orders',
  STUDENT_CREATE_ORDER: '/student/orders/create',
  STUDENT_EDIT_ORDER: '/student/orders/:id/edit',
  STUDENT_ORDER_DETAILS: '/student/orders/:id',
  STUDENT_DEAL_DETAILS: '/student/deals/:id',
  STUDENT_TUTORS: '/student/tutors',
  STUDENT_SERVICES: '/student/services',
  STUDENT_FAVORITES: '/student/favorites',
  STUDENT_PROFILE: '/student/profile',
  STUDENT_EDIT_PROFILE: '/student/profile/edit',
  STUDENT_NOTIFICATIONS: '/student/profile/notifications',

  // Tutor paths
  TUTOR_MAIN: '/tutor',
  TUTOR_SERVICES: '/tutor/services',
  TUTOR_CREATE_SERVICE: '/tutor/services/create',
  TUTOR_EDIT_SERVICE: '/tutor/services/:id/edit',
  TUTOR_SERVICE_RESPONSES: '/tutor/services/:id/responses',
  TUTOR_DEAL_DETAILS: '/tutor/deals/:id',
  TUTOR_ORDERS: '/tutor/orders',
  TUTOR_PROFILE: '/tutor/profile',
  TUTOR_EDIT_PROFILE: '/tutor/profile/edit',
  TUTOR_NOTIFICATIONS: '/tutor/profile/notifications',
  TUTOR_REVIEWS: '/tutor/reviews',
  STUDENT_REVIEWS: '/student/reviews',

  // Public profile (any role)
  USER_PROFILE: '/user/:id',
} as const

export type AppPath = (typeof PATHS)[keyof typeof PATHS]
