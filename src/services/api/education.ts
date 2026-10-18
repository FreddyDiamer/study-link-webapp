import { apiClient } from './client'
import type { Group, GroupSubject, SubjectOption, TeacherOption } from '@/shared/types'

// Справочник большой (≈1400 предметов и столько же преподавателей), целиком его не грузим:
// выбор строится из расписания группы и серверного поиска.
export const educationApi = {
  getGroups(): Promise<Group[]> {
    return apiClient.get('/education/groups')
  },

  // предметы расписания группы, у каждого — преподаватели именно этой группы
  getGroupSubjects(groupId: string): Promise<GroupSubject[]> {
    return apiClient.get(`/education/groups/${groupId}/subjects`)
  },

  // поиск: сначала названия, начинающиеся с запроса, потом содержащие его
  searchSubjects(search: string, limit = 20): Promise<SubjectOption[]> {
    return apiClient.get('/education/subjects', { search, limit })
  },

  searchTeachers(search: string, limit = 20): Promise<TeacherOption[]> {
    return apiClient.get('/education/teachers', { search, limit })
  },

  // все преподаватели предмета по университету, без пагинации
  getTeachersBySubject(subjectId: string): Promise<{ items: TeacherOption[]; total: number }> {
    return apiClient.get(`/education/teachers/by-subject/${subjectId}`)
  },

  // все активные предметы преподавателя; id элемента — id связи, предмет лежит в subject
  getSubjectsByTeacher(
    teacherId: string,
  ): Promise<{ items: { id: string; subject: SubjectOption }[]; total: number }> {
    return apiClient.get(`/education/teacher-subjects/teacher/${teacherId}`)
  },
}
