import { createRouter, createWebHistory } from 'vue-router'
import { PATHS } from './paths'
import { useAppStore } from '@/stores/app'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // Если есть сохраненная позиция (например, при использовании кнопки "назад")
    if (savedPosition) {
      return savedPosition
    }

    // Если есть hash в URL (например, #section), скроллим к элементу
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }

    // Для всех остальных случаев скроллим наверх
    return { top: 0 }
  },
  routes: [
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/test-view'),
    },
    {
      path: PATHS.HOME,
      name: 'welcome',
      component: () => import('../views/welcome-view'),
    },

    // Student routes
    {
      path: PATHS.STUDENT_MAIN,
      name: 'student',
      component: () => import('../features/student/pages/student-page'),
    },
    {
      path: PATHS.STUDENT_SERVICES,
      name: 'student-services',
      component: () => import('../features/student/pages/services-page'),
    },
    {
      path: PATHS.STUDENT_ORDERS,
      name: 'student-orders',
      component: () => import('../features/student/pages/orders-page'),
    },
    {
      path: PATHS.STUDENT_CREATE_ORDER,
      name: 'student-create-order',
      component: () => import('../features/student/pages/create-order-page'),
    },
    {
      path: PATHS.STUDENT_EDIT_ORDER,
      name: 'student-edit-order',
      component: () => import('../features/student/pages/edit-order-page'),
    },
    {
      path: PATHS.STUDENT_ORDER_DETAILS,
      name: 'student-order-details',
      component: () => import('../features/student/pages/order-details-page'),
    },
    {
      path: PATHS.STUDENT_DEAL_DETAILS,
      name: 'student-deal-details',
      component: () => import('../features/student/pages/deal-details-page/DealDetailsPage.vue'),
    },
    {
      path: PATHS.STUDENT_TUTORS,
      name: 'student-tutors',
      component: () => import('../features/student/pages/tutors-list-page'),
    },
    {
      path: PATHS.STUDENT_FAVORITES,
      name: 'student-favorites',
      component: () => import('../features/student/pages/favorites-page'),
    },
    {
      path: PATHS.STUDENT_PROFILE,
      name: 'student-profile',
      component: () => import('../features/student/pages/profile-page'),
    },
    {
      path: PATHS.STUDENT_EDIT_PROFILE,
      name: 'student-edit-profile',
      component: () => import('../features/student/pages/edit-profile-page'),
    },
    {
      path: PATHS.STUDENT_NOTIFICATIONS,
      name: 'student-notifications',
      component: () => import('../features/settings/NotificationsSettingsPage.vue'),
    },
    {
      path: PATHS.STUDENT_REVIEWS,
      name: 'student-reviews',
      component: () => import('../features/tutor/pages/reviews-page'),
    },

    // Tutor routes
    {
      path: PATHS.TUTOR_MAIN,
      name: 'tutor',
      component: () => import('../features/tutor/pages/tutor-page'),
    },
    {
      path: PATHS.TUTOR_SERVICES,
      name: 'tutor-services',
      component: () => import('../features/tutor/pages/services-page'),
    },
    {
      path: PATHS.TUTOR_CREATE_SERVICE,
      name: 'tutor-create-service',
      component: () => import('../features/tutor/pages/create-service-page'),
    },
    {
      path: PATHS.TUTOR_EDIT_SERVICE,
      name: 'tutor-edit-service',
      component: () => import('../features/tutor/pages/edit-service-page'),
    },
    {
      path: PATHS.TUTOR_SERVICE_RESPONSES,
      name: 'tutor-service-responses',
      component: () => import('../features/tutor/pages/service-responses-page'),
    },
    {
      path: PATHS.TUTOR_DEAL_DETAILS,
      name: 'tutor-deal-details',
      component: () => import('../features/tutor/pages/deal-details-page/DealDetailsPage.vue'),
    },
    {
      path: PATHS.TUTOR_ORDERS,
      name: 'tutor-orders',
      component: () => import('../features/tutor/pages/orders-page'),
    },
    {
      path: PATHS.TUTOR_PROFILE,
      name: 'tutor-profile',
      component: () => import('../features/tutor/pages/profile-page'),
    },
    {
      path: PATHS.TUTOR_EDIT_PROFILE,
      name: 'tutor-edit-profile',
      component: () => import('../features/tutor/pages/edit-profile-page'),
    },
    {
      path: PATHS.TUTOR_NOTIFICATIONS,
      name: 'tutor-notifications',
      component: () => import('../features/settings/NotificationsSettingsPage.vue'),
    },
    {
      path: PATHS.TUTOR_REVIEWS,
      name: 'tutor-reviews',
      component: () => import('../features/tutor/pages/reviews-page'),
    },

    // Public user profile (available in both flows)
    {
      path: '/user/:id',
      name: 'user-profile',
      component: () => import('../features/user-profile/UserProfilePage.vue'),
    },
  ],
})

// Навигационные гарды для проверки роли пользователя
router.beforeEach((to, from, next) => {
  const appStore = useAppStore()
  const currentFlow = appStore.currentFlow

  // Разрешаем доступ к welcome странице и test странице без проверки роли
  if (to.path === PATHS.HOME || to.path === '/test') {
    next()
    return
  }

  // Просмотр чужого профиля доступен в обоих потоках
  if (to.path.startsWith('/user/')) {
    next()
    return
  }

  // Проверяем, является ли путь студентским
  const isStudentPath = to.path.startsWith('/student')
  
  // Проверяем, является ли путь репетиторским
  const isTutorPath = to.path.startsWith('/tutor')

  // Если пользователь пытается зайти на студентскую страницу, будучи репетитором
  if (isStudentPath && currentFlow === 'tutor') {
    next(PATHS.TUTOR_MAIN)
    return
  }

  // Если пользователь пытается зайти на страницу репетитора, будучи студентом
  if (isTutorPath && currentFlow === 'student') {
    next(PATHS.STUDENT_MAIN)
    return
  }

  // Если роль не установлена, разрешаем переход (возможно, пользователь еще не выбрал роль)
  if (!currentFlow) {
    next()
    return
  }

  // Во всех остальных случаях разрешаем переход
  next()
})

export default router
