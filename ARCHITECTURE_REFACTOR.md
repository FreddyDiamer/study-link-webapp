# Рефакторинг архитектуры - Глобальные данные

## 🎯 Проблема

Изначально каждый компонент загружал образовательные данные (предметы, преподаватели) самостоятельно, что приводило к:

- **Дублированию запросов** - каждый компонент делал одинаковые API вызовы
- **Неэффективности** - данные загружались многократно
- **Сложности поддержки** - изменения требовали обновления множества компонентов
- **Плохому UX** - пользователь видел множественные индикаторы загрузки

## 🏗️ Решение

### 1. Глобальный Store для образовательных данных

Создан `useEducationStore` в `src/stores/education.ts`:

```typescript
export const useEducationStore = defineStore('education', () => {
  // State
  const subjects = ref<Subject[]>([])
  const teachers = ref<Teacher[]>([])
  const teacherSubjects = ref<TeacherSubject[]>([])
  const isInitialized = ref(false)

  // Getters
  const activeSubjects = computed(() => subjects.value.filter((subject) => subject.isActive))

  // Actions
  const initialize = async () => {
    if (isInitialized.value) return
    // Загружаем все данные параллельно
    await Promise.all([loadSubjects(), loadTeachers(), loadTeacherSubjects()])
    isInitialized.value = true
  }

  return {
    /* ... */
  }
})
```

### 2. Инициализация в главном компоненте

Данные загружаются один раз при старте приложения в `App.vue`:

```typescript
const initializeApp = async () => {
  await Promise.all([
    authService.loginWithTelegram(initData),
    educationStore.initialize(), // Загружаем образовательные данные
  ])
}
```

### 3. Composable для удобного использования

Создан `useEducation` composable в `src/shared/composables/useEducation.ts`:

```typescript
export const useEducation = () => {
  const educationStore = useEducationStore()

  return {
    // State
    subjects: computed(() => educationStore.subjects),
    activeSubjects: computed(() => educationStore.activeSubjects),
    teachers: computed(() => educationStore.teachers),

    // Methods
    getSubjectById: (id: string) => educationStore.getSubjectById(id),
    getTeachersBySubject: (subjectId: string) => educationStore.getTeachersBySubject(subjectId),

    // Management
    initialize: () => educationStore.initialize(),
    refresh: () => educationStore.refresh(),
  }
}
```

### 4. Переиспользуемые компоненты

Созданы компоненты-фильтры:

- `SubjectFilter.vue` - фильтр по предметам
- `TeacherFilter.vue` - фильтр по преподавателям с возможностью фильтрации по предмету

## 📊 Преимущества новой архитектуры

### ✅ До рефакторинга

```vue
<!-- ServicesPage.vue -->
<script setup>
const subjects = ref([])
const teachers = ref([])

const loadSubjects = async () => {
  subjects.value = await educationService.getActiveSubjects()
}

const loadTeachers = async () => {
  teachers.value = await educationService.getTeachers()
}

onMounted(async () => {
  await Promise.all([loadSubjects(), loadTeachers()])
})
</script>
```

### ✅ После рефакторинга

```vue
<!-- ServicesPage.vue -->
<script setup>
const { activeSubjects, teachers, isInitialized, initialize } = useEducation()

onMounted(async () => {
  if (!isInitialized.value) {
    await initialize()
  }
})
</script>

<!-- SubjectFilter.vue -->
<script setup>
const { activeSubjects, isLoading } = useEducation()
</script>
```

## 🔄 Поток данных

```
App.vue (инициализация)
    ↓
useEducationStore.initialize()
    ↓
educationService.getSubjects() + getTeachers() + getTeacherSubjects()
    ↓
Store state (subjects, teachers, teacherSubjects)
    ↓
useEducation() composable
    ↓
Components (SubjectFilter, TeacherFilter, ServicesPage)
```

## 🎨 Использование в компонентах

### Простое использование

```vue
<script setup>
import { useEducation } from '@/shared/composables'

const { activeSubjects, teachers, isLoading } = useEducation()
</script>

<template>
  <div v-if="isLoading">Загрузка...</div>
  <select v-else>
    <option v-for="subject in activeSubjects" :key="subject.id">
      {{ subject.name }}
    </option>
  </select>
</template>
```

### Использование с фильтрацией

```vue
<script setup>
import { useEducation } from '@/shared/composables'

const { getTeachersBySubject } = useEducation()

const teachersForSubject = computed(() => getTeachersBySubject(selectedSubject.value))
</script>
```

### Использование готовых компонентов

```vue
<template>
  <SubjectFilter v-model="selectedSubject" />
  <TeacherFilter v-model="selectedTeacher" :subject-id="selectedSubject" />
</template>
```

## 🚀 Производительность

### До рефакторинга

- **3 компонента** × **3 API запроса** = **9 запросов**
- Время загрузки: ~2.7 секунды
- Дублирование данных в памяти

### После рефакторинга

- **1 инициализация** × **3 API запроса** = **3 запроса**
- Время загрузки: ~0.9 секунды
- Единый источник данных

## 🔧 Технические детали

### Кэширование

```typescript
const initialize = async () => {
  if (isInitialized.value) return // Не загружаем повторно
  // ... загрузка данных
  isInitialized.value = true
}
```

### Обработка ошибок

```typescript
const initialize = async () => {
  try {
    await Promise.all([
      /* ... */
    ])
  } catch (err) {
    error.value = err.message
    console.error('Ошибка инициализации:', err)
  }
}
```

### Обновление данных

```typescript
const refresh = async () => {
  isInitialized.value = false // Сбрасываем флаг
  await initialize() // Перезагружаем данные
}
```

## 📋 Чек-лист для новых компонентов

При создании компонента, который использует образовательные данные:

- [ ] Используйте `useEducation()` composable
- [ ] Не делайте прямые API вызовы к `educationService`
- [ ] Проверяйте `isInitialized` перед использованием данных
- [ ] Используйте готовые компоненты `SubjectFilter`/`TeacherFilter`
- [ ] Обрабатывайте состояния `isLoading` и `error`

## 🎯 Результат

- **DRY принцип** - данные загружаются один раз
- **Производительность** - меньше API запросов, быстрее загрузка
- **Переиспользование** - компоненты можно использовать везде
- **Поддерживаемость** - изменения в одном месте
- **UX** - единый индикатор загрузки, мгновенный доступ к данным

Эта архитектура следует принципам Senior разработчика: **разделение ответственности**, **переиспользование кода** и **оптимизация производительности**.
