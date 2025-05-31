import { createRouter, createWebHistory } from 'vue-router'
import WelcomeView from '../views/WelcomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomeView,
    },

    // Student routes
    {
      path: '/student',
      name: 'student',
      component: () => import('../features/student/pages/StudentPage.vue'),
    },
    {
      path: '/student/orders',
      name: 'student-orders',
      component: () => import('../features/student/pages/OrdersPage.vue'),
    },
    {
      path: '/student/orders/create',
      name: 'student-create-order',
      component: () => import('../features/student/pages/CreateOrderPage.vue'),
    },
    {
      path: '/student/tutors',
      name: 'student-tutors',
      component: () => import('../features/student/pages/TutorsListPage.vue'),
    },
    {
      path: '/student/favorites',
      name: 'student-favorites',
      component: () => import('../features/student/pages/FavoritesPage.vue'),
    },
    {
      path: '/student/profile',
      name: 'student-profile',
      component: () => import('../features/student/pages/ProfilePage.vue'),
    },

    // Tutor routes
    {
      path: '/tutor',
      name: 'tutor',
      component: () => import('../features/tutor/pages/TutorPage.vue'),
    },
    {
      path: '/tutor/services',
      name: 'tutor-services',
      component: () => import('../features/tutor/pages/ServicesPage.vue'),
    },
    {
      path: '/tutor/services/create',
      name: 'tutor-create-service',
      component: () => import('../features/tutor/pages/CreateServicePage.vue'),
    },
    {
      path: '/tutor/orders',
      name: 'tutor-orders',
      component: () => import('../features/tutor/pages/OrdersPage.vue'),
    },
    {
      path: '/tutor/requests',
      name: 'tutor-requests',
      component: () => import('../features/tutor/pages/RequestsPage.vue'),
    },
    {
      path: '/tutor/profile',
      name: 'tutor-profile',
      component: () => import('../features/tutor/pages/ProfilePage.vue'),
    },
  ],
})

export default router
