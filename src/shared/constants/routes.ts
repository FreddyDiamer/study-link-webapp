export const ROUTES = {
  HOME: '/',

  STUDENT: {
    ROOT: '/student',
    ORDERS: '/student/orders',
    CREATE_ORDER: '/student/orders/create',
    TUTORS: '/student/tutors',
    FAVORITES: '/student/favorites',
    PROFILE: '/student/profile',
  },

  TUTOR: {
    ROOT: '/tutor',
    SERVICES: '/tutor/services',
    CREATE_SERVICE: '/tutor/services/create',
    ORDERS: '/tutor/orders',
    REQUESTS: '/tutor/requests',
    PROFILE: '/tutor/profile',
  },
} as const
