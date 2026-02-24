import { useAuthStore } from '@/stores/auth'

/**
 * Фабрика для создания query keys с зависимостью от текущего пользователя
 * Это гарантирует, что при смене пользователя все запросы будут перезагружены
 * 
 * ВАЖНО: Эта функция должна вызываться внутри setup функции компонента или composable,
 * так как она использует useAuthStore()
 */
export const createQueryKey = (baseKey: string | string[], params?: Record<string, any>) => {
  // Получаем store - это безопасно, так как функция вызывается в контексте setup
  const authStore = useAuthStore()
  const userId = authStore.user?.id || 'anonymous'
  
  const keyArray = Array.isArray(baseKey) ? baseKey : [baseKey]
  
  // Добавляем userId в начало ключа для зависимости от пользователя
  const keys: (string | Record<string, unknown>)[] = ['user', userId, ...keyArray]
  
  // Добавляем параметры в конец, если они есть
  if (params && Object.keys(params).length > 0) {
    keys.push(params)
  }
  
  return keys
}

/**
 * Предопределенные query keys для удобства
 */
export const queryKeys = {
  // Orders
  requests: (params?: any) => createQueryKey('requests', params),
  myRequests: () => createQueryKey('requests', { my: true }),
  request: (id: string) => createQueryKey(['requests', id]),
  
  // Deals
  deals: (params?: any) => createQueryKey('deals', params),
  myTutorDeals: () => createQueryKey('deals', { tutor: true }),
  myStudentDeals: () => createQueryKey('deals', { student: true }),
  deal: (id: string) => createQueryKey(['deals', id]),
  
  // Services
  services: (params?: any) => createQueryKey('services', params),
  activeServices: () => createQueryKey('services', { active: true }),
  myServices: () => createQueryKey('services', { my: true }),
  service: (id: string) => createQueryKey(['services', id]),
  
  // Service Responses
  serviceResponses: (serviceId: string) => createQueryKey(['service-responses', serviceId]),
  myServiceResponses: () => createQueryKey('service-responses', { my: true }),
  
  // Request Responses
  requestResponses: (requestId: string) => createQueryKey(['request-responses', requestId]),
  myRequestResponses: () => createQueryKey('request-responses', { my: true }),
  
  // Tutors
  tutors: (params?: any) => createQueryKey('tutors', params),
  tutor: (id: string) => createQueryKey(['tutors', id]),
  favoriteTutors: () => createQueryKey('tutors', { favorites: true }),
  popularTutors: (limit?: number) => createQueryKey('tutors', { popular: true, limit }),
  tutorStats: () => createQueryKey(['tutors', 'stats']),
  
  // User
  user: () => createQueryKey('user'),
  userProfile: () => createQueryKey(['user', 'profile', 'me']),
}
