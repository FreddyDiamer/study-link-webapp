import { QueryClient } from '@tanstack/vue-query'
import { watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

// Создаем QueryClient с настройками по умолчанию
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // По умолчанию автообновление отключено - настраивается индивидуально для каждого запроса
      refetchInterval: false,
      // Обновление при монтировании компонента
      refetchOnMount: true,
      // Обновление при фокусе окна
      refetchOnWindowFocus: true,
      // Обновление при переподключении
      refetchOnReconnect: true,
      // Данные считаются устаревшими сразу - это позволяет refetchInterval работать
      staleTime: 0,
      // Время хранения неактивных запросов (10 минут)
      gcTime: 10 * 60 * 1000,
      // Количество повторных попыток при ошибке
      retry: 2,
      // Задержка между повторными попытками
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Количество повторных попыток при ошибке мутаций
      retry: 1,
    },
  },
})

// Функция для очистки кэша при смене пользователя
export const setupQueryCacheWatcher = () => {
  const authStore = useAuthStore()
  
  // Следим за изменением пользователя
  watch(
    () => {
      // Используем computed для получения актуального значения из readonly ref
      const user = authStore.user as any
      return user?.id || null
    },
    (newUserId, oldUserId) => {
      console.log('🔄 User changed:', { oldUserId, newUserId })
      if (newUserId !== oldUserId && oldUserId !== null) {
        console.log('🗑️ Clearing Vue Query cache due to user change')
        // Очищаем весь кэш при смене пользователя
        queryClient.clear()
        // Инвалидируем все запросы для перезагрузки с новым пользователем
        queryClient.invalidateQueries()
      }
    },
    { immediate: false }
  )
}
