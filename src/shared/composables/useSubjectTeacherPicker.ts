import { computed, ref, watch, type Ref } from 'vue'
import { educationService } from '@/services/business'
import { filterByQuery } from '@/shared/utils'
import type { PickerOption, PickerSection } from '@/shared/components/ui'
import type { SubjectOption, TeacherOption } from '@/shared/types'
import { useMyGroupSubjects } from './useMyGroupSubjects'

/** Серверный поиск начинается со второй буквы: по одной находится полсправочника. */
const MIN_SEARCH = 2
const SEARCH_DELAY = 300

// связи почти не меняются — один запрос на предмет/преподавателя за жизнь приложения
const teachersBySubject = new Map<string, Promise<TeacherOption[]>>()
const subjectsByTeacher = new Map<string, Promise<SubjectOption[]>>()

const cached = <T>(store: Map<string, Promise<T>>, id: string, load: () => Promise<T>) => {
  let pending = store.get(id)
  if (!pending) {
    pending = load()
    pending.catch(() => store.delete(id))
    store.set(id, pending)
  }
  return pending
}

/** «Иванов Иван Иванович» → «Иванов И. И.»: в подсказке под предметом хватает инициалов. */
export const shortName = (fullName: string) => {
  const [last, ...rest] = fullName.trim().split(/\s+/)
  return [last, ...rest.map((part) => `${part[0]}.`)].join(' ')
}

const withoutIds = <T extends { id: string }>(items: readonly T[], ids: Set<string>) =>
  items.filter((item) => !ids.has(item.id))

/** Поиск по справочнику с задержкой: ответ на устаревший запрос не перетирает свежий. */
const createRemoteSearch = <T>(fetch: (query: string) => Promise<T[]>) => {
  const results = ref<T[]>([]) as Ref<T[]>
  const loading = ref(false)
  const failed = ref(false)
  let seq = 0
  let timer: ReturnType<typeof setTimeout> | undefined

  const run = (query: string) => {
    clearTimeout(timer)
    const current = ++seq
    failed.value = false
    const q = query.trim()
    if (q.length < MIN_SEARCH) {
      results.value = []
      loading.value = false
      return
    }
    loading.value = true
    timer = setTimeout(async () => {
      try {
        const found = await fetch(q)
        if (current === seq) results.value = found
      } catch (e) {
        console.error('Поиск по справочнику не удался:', e)
        if (current === seq) failed.value = true
      } finally {
        if (current === seq) loading.value = false
      }
    }, SEARCH_DELAY)
  }

  return { results, loading, failed, run }
}

/**
 * Связанный выбор предмета и преподавателя. Начинать можно с любого поля: выбранное сужает
 * соседнее, поэтому неподходящую пару собрать нельзя, а бэкенд такую и не примет.
 * Сверху — расписание группы, остальное — поиском по всему справочнику.
 */
export const useSubjectTeacherPicker = (
  subject: Ref<SubjectOption | null>,
  teacher: Ref<TeacherOption | null>,
) => {
  const { subjects: mySubjects, isLoading: myLoading, hasGroup } = useMyGroupSubjects()

  const subjectQuery = ref('')
  const teacherQuery = ref('')

  // --- связи выбранного соседа ---

  const subjectTeachers = ref<TeacherOption[] | null>(null)
  const teacherSubjects = ref<SubjectOption[] | null>(null)
  const relationLoading = ref(false)
  const relationFailed = ref(false)

  const loadSubjectTeachers = async (id: string) => {
    relationLoading.value = true
    relationFailed.value = false
    try {
      const list = await cached(teachersBySubject, id, () =>
        educationService.getTeachersBySubject(id),
      )
      if (subject.value?.id === id) subjectTeachers.value = list
      return list
    } catch (e) {
      console.error('Не удалось загрузить преподавателей предмета:', e)
      relationFailed.value = true
      return null
    } finally {
      relationLoading.value = false
    }
  }

  const loadTeacherSubjects = async (id: string) => {
    relationLoading.value = true
    relationFailed.value = false
    try {
      const list = await cached(subjectsByTeacher, id, () =>
        educationService.getSubjectsByTeacher(id),
      )
      if (teacher.value?.id === id) teacherSubjects.value = list
      return list
    } catch (e) {
      console.error('Не удалось загрузить предметы преподавателя:', e)
      relationFailed.value = true
      return null
    } finally {
      relationLoading.value = false
    }
  }

  watch(
    () => subject.value?.id,
    (id) => {
      subjectTeachers.value = null
      if (id) loadSubjectTeachers(id)
    },
    { immediate: true },
  )
  watch(
    () => teacher.value?.id,
    (id) => {
      teacherSubjects.value = null
      if (id) loadTeacherSubjects(id)
    },
    { immediate: true },
  )

  // --- серверный поиск, когда сосед не выбран; у каждого листа свой ---

  const subjectSearch = createRemoteSearch((q) => educationService.searchSubjects(q))
  const teacherSearch = createRemoteSearch((q) => educationService.searchTeachers(q))

  watch(subjectQuery, (q) => {
    if (!teacher.value) subjectSearch.run(q)
  })
  watch(teacherQuery, (q) => {
    if (!subject.value) teacherSearch.run(q)
  })

  // --- разделы листа предметов ---

  const groupSubjectOptions = computed(() =>
    mySubjects.value.map((s) => ({
      id: s.id,
      label: s.name,
      hint: s.teachers.map((t) => shortName(t.fullName)).join(', ') || undefined,
    })),
  )

  const subjectSections = computed<PickerSection[]>(() => {
    const query = subjectQuery.value
    const byLabel = (o: PickerOption) => o.label

    if (teacher.value) {
      const teacherId = teacher.value.id
      const group = groupSubjectOptions.value.filter((o) =>
        mySubjects.value.find((s) => s.id === o.id)?.teachers.some((t) => t.id === teacherId),
      )
      const groupIds = new Set(group.map((o) => o.id))
      const others = withoutIds(teacherSubjects.value ?? [], groupIds).map((s) => ({
        id: s.id,
        label: s.name,
      }))
      return [
        { key: 'group', title: 'Вашей группы', options: filterByQuery(group, query, byLabel) },
        {
          key: 'others',
          title: group.length ? 'Другие предметы преподавателя' : undefined,
          options: filterByQuery(others, query, byLabel),
        },
      ]
    }

    const group = filterByQuery(groupSubjectOptions.value, query, byLabel)
    const groupIds = new Set(groupSubjectOptions.value.map((o) => o.id))
    const found = withoutIds(subjectSearch.results.value, groupIds).map((s) => ({
      id: s.id,
      label: s.name,
    }))
    return [
      { key: 'group', title: 'Вашей группы', options: group },
      { key: 'all', title: 'Все предметы', options: query ? found : [] },
    ]
  })

  // --- разделы листа преподавателей ---

  const groupTeacherOptions = computed(() => {
    const byId = new Map<string, { teacher: TeacherOption; subjects: string[] }>()
    for (const s of mySubjects.value) {
      for (const t of s.teachers) {
        const entry = byId.get(t.id) ?? {
          teacher: { id: t.id, fullName: t.fullName },
          subjects: [] as string[],
        }
        entry.subjects.push(s.name)
        byId.set(t.id, entry)
      }
    }
    return [...byId.values()]
      .sort((a, b) => a.teacher.fullName.localeCompare(b.teacher.fullName, 'ru'))
      .map(({ teacher: t, subjects }) => ({
        id: t.id,
        label: t.fullName,
        hint: subjects.join(', '),
      }))
  })

  const teacherSections = computed<PickerSection[]>(() => {
    const query = teacherQuery.value
    const byLabel = (o: PickerOption) => o.label

    if (subject.value) {
      const groupTeachers = mySubjects.value.find((s) => s.id === subject.value?.id)?.teachers ?? []
      const group = groupTeachers.map((t) => ({ id: t.id, label: t.fullName }))
      const groupIds = new Set(group.map((o) => o.id))
      const others = withoutIds(subjectTeachers.value ?? [], groupIds).map((t) => ({
        id: t.id,
        label: t.fullName,
      }))
      return [
        {
          key: 'group',
          title: 'Ведут у вашей группы',
          options: filterByQuery(group, query, byLabel),
        },
        {
          key: 'others',
          title: group.length ? 'Другие преподаватели предмета' : undefined,
          options: filterByQuery(others, query, byLabel),
        },
      ]
    }

    const group = filterByQuery(groupTeacherOptions.value, query, byLabel)
    const groupIds = new Set(groupTeacherOptions.value.map((o) => o.id))
    const found = withoutIds(teacherSearch.results.value, groupIds).map((t) => ({
      id: t.id,
      label: t.fullName,
    }))
    return [
      { key: 'group', title: 'Вашей группы', options: group },
      { key: 'all', title: 'Все преподаватели', options: query ? found : [] },
    ]
  })

  // --- состояние и подсказки ---

  const subjectLoading = computed(() =>
    teacher.value ? relationLoading.value : myLoading.value || subjectSearch.loading.value,
  )
  const teacherLoading = computed(() =>
    subject.value ? relationLoading.value : myLoading.value || teacherSearch.loading.value,
  )
  const subjectFailed = computed(() =>
    teacher.value ? relationFailed.value : subjectSearch.failed.value,
  )
  const teacherFailed = computed(() =>
    subject.value ? relationFailed.value : teacherSearch.failed.value,
  )

  // «ничего не нашлось» — только когда искали по-настоящему, а не на пустом листе
  const NOTHING_FOUND = 'Ничего не нашлось — проверьте написание'
  const searched = (query: string, constrained: boolean) =>
    constrained ? !!query.trim() : query.trim().length >= MIN_SEARCH
  const subjectEmptyText = computed(() =>
    searched(subjectQuery.value, !!teacher.value) ? NOTHING_FOUND : undefined,
  )
  const teacherEmptyText = computed(() =>
    searched(teacherQuery.value, !!subject.value) ? NOTHING_FOUND : undefined,
  )

  // что ещё можно сделать, когда сосед не выбран и список опирается на поиск
  const freeHint = (query: string, what: string) => {
    if (query && query.trim().length < MIN_SEARCH) return 'Ещё буква — и поищем по всему списку'
    if (query) return undefined
    if (!hasGroup.value)
      return `Укажите группу в профиле — здесь появятся ${what} вашего расписания. А пока найдите поиском`
    if (!myLoading.value && !mySubjects.value.length)
      return 'Расписания вашей группы пока нет — найдите поиском'
    return `Нет нужного? Начните вводить — найдём среди всех`
  }

  const subjectHint = computed(() =>
    teacher.value ? undefined : freeHint(subjectQuery.value, 'предметы'),
  )
  const teacherHint = computed(() =>
    subject.value ? undefined : freeHint(teacherQuery.value, 'преподаватели'),
  )

  const subjectSheetSub = computed(() =>
    teacher.value ? `Которые ведёт ${shortName(teacher.value.fullName)}` : undefined,
  )
  const teacherSheetSub = computed(() =>
    subject.value ? `Ведут «${subject.value.name}»` : undefined,
  )

  // --- выбор ---

  const pickSubject = async (option: PickerOption) => {
    subject.value = { id: option.id, name: option.label }
    if (teacher.value) return
    // однозначная пара подставляется сама: у большинства предметов группы один преподаватель
    const groupTeachers = mySubjects.value.find((s) => s.id === option.id)?.teachers ?? []
    if (groupTeachers.length === 1) {
      teacher.value = { ...groupTeachers[0] }
      return
    }
    if (groupTeachers.length) return
    const all = await loadSubjectTeachers(option.id)
    if (all?.length === 1 && !teacher.value && subject.value?.id === option.id) {
      teacher.value = { ...all[0] }
    }
  }

  const pickTeacher = async (option: PickerOption) => {
    teacher.value = { id: option.id, fullName: option.label }
    if (subject.value) return
    const groupSubjects = mySubjects.value.filter((s) => s.teachers.some((t) => t.id === option.id))
    if (groupSubjects.length === 1) {
      subject.value = { id: groupSubjects[0].id, name: groupSubjects[0].name }
      return
    }
    if (groupSubjects.length) return
    const all = await loadTeacherSubjects(option.id)
    if (all?.length === 1 && !subject.value && teacher.value?.id === option.id) {
      subject.value = { ...all[0] }
    }
  }

  const retrySubjects = () => {
    if (teacher.value) loadTeacherSubjects(teacher.value.id)
    else subjectSearch.run(subjectQuery.value)
  }
  const retryTeachers = () => {
    if (subject.value) loadSubjectTeachers(subject.value.id)
    else teacherSearch.run(teacherQuery.value)
  }

  return {
    // State
    subjectQuery,
    teacherQuery,
    subjectSections,
    teacherSections,
    subjectLoading,
    teacherLoading,
    subjectFailed,
    teacherFailed,
    subjectHint,
    teacherHint,
    subjectSheetSub,
    teacherSheetSub,
    subjectEmptyText,
    teacherEmptyText,

    // Methods
    pickSubject,
    pickTeacher,
    retrySubjects,
    retryTeachers,
  }
}
