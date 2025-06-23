export const PATHS = {
  // Core
  HOME: '/',

  // Student paths
  STUDENT_MAIN: '/student',
  STUDENT_ORDERS: '/student/orders',
  STUDENT_CREATE_ORDER: '/student/orders/create',
  STUDENT_ORDER_DETAILS: '/student/orders/:id',
  STUDENT_TUTORS: '/student/tutors',
  STUDENT_SERVICES: '/student/services',
  STUDENT_FAVORITES: '/student/favorites',
  STUDENT_PROFILE: '/student/profile',

  // Tutor paths
  TUTOR_MAIN: '/tutor',
  TUTOR_SERVICES: '/tutor/services',
  TUTOR_CREATE_SERVICE: '/tutor/services/create',
  TUTOR_SERVICE_RESPONSES: '/tutor/services/:id/responses',
  TUTOR_ORDERS: '/tutor/orders',
  TUTOR_REQUESTS: '/tutor/requests',
  TUTOR_PROFILE: '/tutor/profile',
} as const

export type AppPath = (typeof PATHS)[keyof typeof PATHS]
