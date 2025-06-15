import { createRouter, createWebHistory } from 'vue-router'
import WelcomeView from '../views/WelcomeView.vue'
import { PATHS } from './paths'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: PATHS.HOME,
      name: 'welcome',
      component: WelcomeView,
    },

    // Student routes
    {
      path: PATHS.STUDENT,
      name: 'student',
      component: () => import('../features/student/pages/StudentPage.vue'),
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
      path: PATHS.STUDENT_TUTORS,
      name: 'student-tutors',
      component: () => import('../features/student/pages/TutorsListPage.vue'),
    },
    {
      path: PATHS.STUDENT_SERVICES,
      name: 'student-services',
      component: () => import('../features/student/pages/ServicesPage.vue'),
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

    // Tutor routes
    {
      path: PATHS.TUTOR,
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
      path: PATHS.TUTOR_ORDERS,
      name: 'tutor-orders',
      component: () => import('../features/tutor/pages/OrdersPage.vue'),
    },
    {
      path: PATHS.TUTOR_REQUESTS,
      name: 'tutor-requests',
      component: () => import('../features/tutor/pages/RequestsPage.vue'),
    },
    {
      path: PATHS.TUTOR_PROFILE,
      name: 'tutor-profile',
      component: () => import('../features/tutor/pages/ProfilePage.vue'),
    },
  ],
})

export default router
