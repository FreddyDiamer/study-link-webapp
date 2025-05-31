# Архитектура API и Сервисов

## 📁 Структура проекта

```
src/
├── api/                    # HTTP API клиенты (низкий уровень)
│   ├── client.ts          # Базовый HTTP клиент с interceptors
│   ├── auth.ts            # API методы авторизации
│   ├── tutors.ts          # API методы репетиторов
│   ├── orders.ts          # API методы заказов
│   └── index.ts           # Экспорт всех API модулей
│
├── services/              # Бизнес-логика (высокий уровень)
│   ├── tutorService.ts    # Сервис работы с репетиторами
│   ├── orderService.ts    # Сервис работы с заказами
│   ├── telegram/          # Telegram WebApp сервисы
│   └── index.ts           # Экспорт всех сервисов
│
└── stores/                # Pinia stores для состояния
    ├── auth.ts            # Store авторизации
    └── telegram.ts        # Store Telegram WebApp
```

## 🏗️ Принципы архитектуры

### 1. **Разделение ответственности**

- **API слой** (`/api`) - чистые HTTP запросы без бизнес-логики
- **Services слой** (`/services`) - бизнес-логика + управление состоянием
- **Stores слой** (`/stores`) - глобальное состояние приложения

### 2. **Dependency Flow**

```
Components → Services → API + Stores
```

- Компоненты используют только **Services**
- Services используют **API** для запросов и **Stores** для состояния
- API модули независимы и переиспользуемы

## 📋 API Layer

### Назначение

- Чистые HTTP запросы к серверу
- Типизация запросов и ответов
- Обработка базовых HTTP ошибок

### Пример использования

```typescript
// ❌ НЕ используйте API напрямую в компонентах
import { tutorsApi } from '@/api/tutors'

// ✅ Используйте через сервисы
import { tutorService } from '@/services'
```

### Структура API модуля

```typescript
// api/tutors.ts
import { apiClient } from './client'

export interface Tutor {
  id: string
  name: string
  // ... другие поля
}

export interface TutorSearchParams {
  subject?: string
  search?: string
  // ... другие параметры
}

export const tutorsApi = {
  search: (params: TutorSearchParams) => apiClient.get<TutorSearchResponse>('/tutors', params),

  getById: (id: string) => apiClient.get<Tutor>(`/tutors/${id}`),
}
```

## 🔧 Services Layer

### Назначение

- Бизнес-логика приложения
- Валидация данных
- Обработка ошибок с понятными сообщениями
- Интеграция с Telegram WebApp (haptic feedback, уведомления)
- Управление состоянием через stores

### Пример использования

```typescript
// В компоненте
import { tutorService } from '@/services'

const searchTutors = async () => {
  try {
    const response = await tutorService.searchTutors({
      subject: 'Математика',
      search: 'ЕГЭ',
    })

    tutors.value = response.tutors
  } catch (error) {
    // Получаем понятное сообщение об ошибке
    errorMessage.value = error.message
  }
}
```

### Структура Service

```typescript
// services/tutorService.ts
export class TutorService {
  private telegramStore = useTelegramStore()

  async searchTutors(params: TutorSearchParams) {
    // 1. Валидация входных данных
    this.validateSearchParams(params)

    try {
      // 2. API запрос
      const response = await tutorsApi.search(params)

      // 3. Дополнительная логика
      this.logSearchEvent(params, response.total)

      return response
    } catch (error) {
      // 4. Обработка ошибок
      throw new Error(this.getErrorMessage(error))
    }
  }

  async addToFavorites(tutorId: string) {
    // Haptic feedback
    this.telegramStore.hapticFeedback('light')

    await tutorsApi.addToFavorites(tutorId)

    // Уведомление пользователю
    this.showNotification('Добавлено в избранное')
  }
}
```

## 🗄️ Stores Integration

### Auth Store

```typescript
// В сервисе
export class OrderService {
  private authStore = useAuthStore()

  async createOrder(data: CreateOrderData) {
    // Проверка прав доступа
    if (!this.authStore.isStudent) {
      throw new Error('Только студенты могут создавать заказы')
    }

    // Создание заказа
    return await ordersApi.create(data)
  }
}
```

### Telegram Store

```typescript
// Haptic feedback
this.telegramStore.hapticFeedback('medium')

// Показ главной кнопки
this.telegramStore.showMainButton('Создать заказ', () => {
  // callback
})
```

## 🚀 Использование в компонентах

### Правильный подход

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { tutorService, orderService } from '@/services'

const tutors = ref([])
const isLoading = ref(false)
const error = ref(null)

const loadTutors = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await tutorService.searchTutors({
      subject: 'Математика',
    })

    tutors.value = response.tutors
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

const createOrder = async (orderData) => {
  try {
    await orderService.createOrder(orderData)
    // Успех - сервис сам покажет уведомление
  } catch (err) {
    // Показываем ошибку пользователю
    alert(err.message)
  }
}

onMounted(() => {
  loadTutors()
})
</script>
```

## 🔄 Обработка ошибок

### В API слое

```typescript
// Базовые HTTP ошибки обрабатываются в apiClient
// Возвращаем чистые данные или бросаем исключение
```

### В Services слое

```typescript
private getErrorMessage(error: any): string {
  if (error.response?.status === 404) {
    return 'Репетитор не найден'
  }
  if (error.response?.status === 403) {
    return 'Недостаточно прав'
  }
  if (error.response?.status >= 500) {
    return 'Проблемы на сервере. Попробуйте позже'
  }
  return 'Произошла ошибка'
}
```

## 📝 Лучшие практики

### ✅ DO

- Используйте сервисы в компонентах, а не API напрямую
- Валидируйте данные в сервисах
- Показывайте понятные сообщения об ошибках
- Используйте haptic feedback для UX
- Логируйте события для аналитики

### ❌ DON'T

- Не импортируйте API модули в компонентах
- Не дублируйте бизнес-логику
- Не игнорируйте ошибки
- Не показывайте технические ошибки пользователю

## 🧪 Тестирование

### API слой

```typescript
// Тестируем HTTP запросы с mock данными
test('tutorsApi.search should return tutors', async () => {
  const mockResponse = { tutors: [], total: 0 }
  jest.spyOn(apiClient, 'get').mockResolvedValue(mockResponse)

  const result = await tutorsApi.search({ subject: 'Math' })
  expect(result).toEqual(mockResponse)
})
```

### Services слой

```typescript
// Тестируем бизнес-логику с mock API
test('tutorService.searchTutors should validate params', async () => {
  await expect(tutorService.searchTutors({ minPrice: 100, maxPrice: 50 })).rejects.toThrow(
    'Минимальная цена не может быть больше максимальной',
  )
})
```

## 🔧 Расширение

### Добавление нового API модуля

1. Создайте файл в `/api`
2. Определите интерфейсы
3. Создайте API методы
4. Экспортируйте в `/api/index.ts`

### Добавление нового сервиса

1. Создайте класс сервиса в `/services`
2. Добавьте бизнес-логику
3. Интегрируйте с stores
4. Экспортируйте в `/services/index.ts`

Эта архитектура обеспечивает:

- **Масштабируемость** - легко добавлять новые модули
- **Тестируемость** - четкое разделение слоев
- **Переиспользование** - API модули независимы
- **Поддерживаемость** - понятная структура кода
