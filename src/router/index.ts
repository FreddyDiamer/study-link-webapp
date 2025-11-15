import { createRouter, createWebHistory } from 'vue-router'
import WelcomeView from '../views/WelcomeView.vue'
import { PATHS } from './paths'

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
      component: () => import('../views/TestView.vue'),
    },
    {
      path: PATHS.HOME,
      name: 'welcome',
      component: WelcomeView,
    },

    // Student routes
    {
      path: PATHS.STUDENT_MAIN,
      name: 'student',
      component: () => import('../features/student/pages/StudentPage.vue'),
    },
    {
      path: PATHS.STUDENT_SERVICES,
      name: 'student-services',
      component: () => import('../features/student/pages/ServicesPage.vue'),
    },
    {
      path: PATHS.STUDENT_ORDERS,
      name: 'student-orders',
      component: () => import('../features/student/pages/OrdersPage.vue'),
    },
    {
      path: PATHS.STUDENT_CREATE_ORDER,
      name: 'student-create-order',
      component: () => import('../features/student/pages/CreateOrderPage.vue'),
    },
    {
      path: PATHS.STUDENT_EDIT_ORDER,
      name: 'student-edit-order',
      component: () => import('../features/student/pages/EditOrderPage.vue'),
    },
    {
      path: PATHS.STUDENT_ORDER_DETAILS,
      name: 'student-order-details',
      component: () => import('../features/student/pages/OrderDetailsPage.vue'),
    },
    {
      path: PATHS.STUDENT_TUTORS,
      name: 'student-tutors',
      component: () => import('../features/student/pages/TutorsListPage.vue'),
    },
    {
      path: PATHS.STUDENT_FAVORITES,
      name: 'student-favorites',
      component: () => import('../features/student/pages/FavoritesPage.vue'),
    },
    {
      path: PATHS.STUDENT_PROFILE,
      name: 'student-profile',
      component: () => import('../features/student/pages/ProfilePage.vue'),
    },
    {
      path: PATHS.STUDENT_EDIT_PROFILE,
      name: 'student-edit-profile',
      component: () => import('../features/student/pages/EditProfilePage.vue'),
    },

    // Tutor routes
    {
      path: PATHS.TUTOR_MAIN,
      name: 'tutor',
      component: () => import('../features/tutor/pages/TutorPage.vue'),
    },
    {
      path: PATHS.TUTOR_SERVICES,
      name: 'tutor-services',
      component: () => import('../features/tutor/pages/ServicesPage.vue'),
    },
    {
      path: PATHS.TUTOR_CREATE_SERVICE,
      name: 'tutor-create-service',
      component: () => import('../features/tutor/pages/CreateServicePage.vue'),
    },
    {
      path: PATHS.TUTOR_EDIT_SERVICE,
      name: 'tutor-edit-service',
      component: () => import('../features/tutor/pages/EditServicePage.vue'),
    },
    {
      path: PATHS.TUTOR_SERVICE_RESPONSES,
      name: 'tutor-service-responses',
      component: () => import('../features/tutor/pages/ServiceResponsesPage.vue'),
    },
    {
      path: PATHS.TUTOR_ORDERS,
      name: 'tutor-orders',
      component: () => import('../features/tutor/pages/OrdersPage.vue'),
    },
    {
      path: PATHS.TUTOR_PROFILE,
      name: 'tutor-profile',
      component: () => import('../features/tutor/pages/ProfilePage.vue'),
    },
    {
      path: PATHS.TUTOR_EDIT_PROFILE,
      name: 'tutor-edit-profile',
      component: () => import('../features/tutor/pages/EditProfilePage.vue'),
    },
  ],
})

export default router
