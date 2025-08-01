# Интеграция Frontend с Backend API

## 📋 Обзор

Данный документ описывает интеграцию Vue.js клиента с NestJS backend API для платформы репетиторства.

## 🏗️ Архитектура

### Слои приложения

```
┌─────────────────────────────────────┐
│           Components                │  ← Vue компоненты
├─────────────────────────────────────┤
│           Services                  │  ← Бизнес-логика
├─────────────────────────────────────┤
│           API Clients               │  ← HTTP запросы
├─────────────────────────────────────┤
│           Stores                    │  ← Состояние (Pinia)
└─────────────────────────────────────┘
```

### Принципы

1. **Разделение ответственности** - каждый слой выполняет свою задачу
2. **Dependency Flow** - зависимости идут сверху вниз
3. **Типизация** - полная типизация TypeScript
4. **Обработка ошибок** - централизованная обработка ошибок
5. **Telegram интеграция** - haptic feedback и уведомления

## 🔧 Настройка

### 1. Переменные окружения

Создайте файл `.env` в корне frontend проекта:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_TELEGRAM_BOT_NAME=kai_repetitor_bot
```

### 2. Запуск backend

```bash
cd backend
npm install
npm run start:dev
```

### 3. Запуск frontend

```bash
cd stydy-link
npm install
npm run dev
```

## 📡 API Endpoints

### Авторизация

- `POST /auth/telegram` - авторизация через Telegram
- `GET /auth/profile` - получение профиля
- `GET /auth/refresh` - обновление токена

### Пользователи

- `GET /users/profile` - профиль пользователя
- `PATCH /users/profile` - обновление профиля
- `GET /users/{id}` - получение пользователя по ID
- `GET /users/balance` - баланс пользователя

### Образование

- `GET /education/subjects` - все предметы
- `GET /education/subjects/active` - активные предметы
- `GET /education/teachers` - все преподаватели
- `GET /education/teacher-subjects` - связи преподаватель-предмет

### Маркетплейс

#### Услуги

- `GET /marketplace/services` - список услуг
- `GET /marketplace/services/active` - активные услуги
- `GET /marketplace/services/popular` - популярные услуги
- `GET /marketplace/services/my` - мои услуги
- `POST /marketplace/services` - создание услуги
- `PATCH /marketplace/services/{id}` - обновление услуги
- `DELETE /marketplace/services/{id}` - удаление услуги

#### Заявки

- `GET /marketplace/requests` - список заявок
- `GET /marketplace/requests/my` - мои заявки
- `POST /marketplace/requests` - создание заявки
- `PATCH /marketplace/requests/{id}` - обновление заявки
- `DELETE /marketplace/requests/{id}` - удаление заявки

#### Сделки

- `GET /marketplace/deals` - список сделок
- `GET /marketplace/deals/my-student` - мои сделки как студент
- `GET /marketplace/deals/my-tutor` - мои сделки как репетитор
- `PATCH /marketplace/deals/{id}/accept` - принятие сделки
- `PATCH /marketplace/deals/{id}/reject` - отклонение сделки
- `PATCH /marketplace/deals/{id}/complete` - завершение сделки
- `PATCH /marketplace/deals/{id}/cancel` - отмена сделки

#### Отклики

- `GET /marketplace/service-responses` - отклики на услуги
- `POST /marketplace/service-responses` - создание отклика на услугу
- `GET /marketplace/request-responses` - отклики на заявки
- `POST /marketplace/request-responses` - создание отклика на заявку

### Отзывы

- `GET /reviews/user/{id}` - отзывы пользователя
- `POST /reviews` - создание отзыва
- `PATCH /reviews/{id}` - обновление отзыва
- `DELETE /reviews/{id}` - удаление отзыва

## 💰 Работа с ценами

### Конвертация валют

Backend хранит все цены в **копейках**, frontend работает с **рублями**.

```typescript
// Конвертация рублей в копейки
const priceInKopeks = convertRublesToKopeks(1000) // 100000

// Конвертация копеек в рубли
const priceInRubles = convertKopeksToRubles(100000) // 1000
```

### Автоматическая конвертация

Все сервисы автоматически конвертируют цены:

```typescript
// В API клиентах - отправляем в копейках
const serviceData = {
  price: convertRublesToKopeks(1000), // 100000
}

// В бизнес-сервисах - получаем в рублях
const service = await serviceService.getService(id)
console.log(service.price) // 1000 (рубли)
```

## 🔐 Авторизация

### Telegram WebApp

1. **Инициализация** - приложение получает `initData` от Telegram
2. **Парсинг** - извлекаем данные пользователя
3. **API запрос** - отправляем на `/auth/telegram`
4. **Токен** - получаем JWT токен
5. **Хранение** - сохраняем в localStorage

### Автоматическое обновление токена

```typescript
// В apiClient.ts настроены interceptors
// При 401 ошибке - автоматический logout
// При успешном запросе - токен добавляется в заголовки
```

## 🎯 Использование в компонентах

### Правильный подход

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { serviceService } from '@/services/business'

const services = ref([])
const isLoading = ref(false)
const error = ref(null)

const loadServices = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await serviceService.getActiveServices()
    services.value = response.items
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadServices()
})
</script>
```

### Неправильный подход

```vue
<script setup lang="ts">
// ❌ НЕ используйте API напрямую в компонентах
import { tutorsApi } from '@/services/api'

const loadServices = async () => {
  const response = await tutorsApi.getActiveServices() // Плохо!
}
</script>
```

## 🎨 Telegram интеграция

### Haptic Feedback

```typescript
import { useTelegramStore } from '@/stores'

const telegramStore = useTelegramStore()

// Легкая вибрация
telegramStore.hapticFeedback('light')

// Средняя вибрация
telegramStore.hapticFeedback('medium')

// Сильная вибрация
telegramStore.hapticFeedback('heavy')

// Успешная операция
telegramStore.hapticFeedback('success')
```

### Уведомления

```typescript
// Показать уведомление
telegramStore.showAlert('Операция выполнена успешно!')

// Показать ошибку
telegramStore.showAlert('Произошла ошибка', 'error')
```

## 🧪 Тестирование

### API тесты

```typescript
// tests/api/auth.test.ts
describe('Auth API', () => {
  it('should authenticate with Telegram', async () => {
    const mockData = {
      /* ... */
    }
    const response = await authApi.telegramAuth(mockData)
    expect(response.accessToken).toBeDefined()
  })
})
```

### Сервис тесты

```typescript
// tests/services/service.test.ts
describe('ServiceService', () => {
  it('should convert prices correctly', async () => {
    const service = await serviceService.getService('id')
    expect(typeof service.price).toBe('number')
    expect(service.price).toBeGreaterThan(0)
  })
})
```

## 🚀 Развертывание

### Production

1. **Backend** - настройте переменные окружения
2. **Frontend** - обновите `VITE_API_BASE_URL`
3. **Telegram Bot** - настройте WebApp URL

### Docker

```bash
# Backend
cd backend
docker-compose up -d

# Frontend
cd stydy-link
docker build -t kai-repetitor-frontend .
docker run -p 3000:3000 kai-repetitor-frontend
```

## 🔍 Отладка

### Логирование

```typescript
// Включите логирование в development
if (import.meta.env.DEV) {
  console.log('API Request:', { url, data })
  console.log('API Response:', response)
}
```

### Network Tab

Проверяйте:

- HTTP статусы
- Request/Response headers
- Request payload
- Response data

### Vue DevTools

- Состояние Pinia stores
- Компонентные props
- Реактивные данные

## 📚 Дополнительные ресурсы

- [NestJS Documentation](https://docs.nestjs.com/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Telegram WebApp API](https://core.telegram.org/bots/webapps)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Поддержка

При возникновении проблем:

1. Проверьте логи в консоли браузера
2. Убедитесь в корректности API endpoints
3. Проверьте переменные окружения
4. Убедитесь в запуске backend сервера
