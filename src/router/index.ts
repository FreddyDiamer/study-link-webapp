import { createRouter, createWebHistory } from 'vue-router'
import { PATHS } from './paths'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
  routes: [
    { path: PATHS.HOME, redirect: PATHS.MARKET },
    {
      path: PATHS.MARKET,
      name: 'market',
      component: () => import('../features/market/pages/MarketPage.vue'),
    },
    {
      path: PATHS.SERVICE_CREATE,
      name: 'service-create',
      component: () => import('../features/market/pages/CreateServicePage.vue'),
    },
    {
      path: PATHS.SERVICE_DETAIL,
      name: 'service-detail',
      component: () => import('../features/market/pages/ServiceDetailPage.vue'),
    },
    {
      path: PATHS.SERVICE_RESPOND,
      name: 'service-respond',
      component: () => import('../features/market/pages/RespondPage.vue'),
    },
    {
      path: PATHS.DEALS,
      name: 'deals',
      component: () => import('../features/deals/pages/DealsPage.vue'),
    },
    {
      path: PATHS.PROFILE,
      name: 'profile',
      component: () => import('../features/profile/pages/ProfilePage.vue'),
    },
  ],
})

export default router
