import { apiClient } from './client'
import type { Subject, Teacher, TeacherSubject, Group } from '@/shared/types'

export const educationApi = {
  // =============================================================================
  // SUBJECTS
  // =============================================================================

  getSubjects(): Promise<Subject[]> {
    return apiClient.get('/education/subjects')
  },

  getSubject(id: string): Promise<Subject> {
    return apiClient.get(`/education/subjects/${id}`)
  },

  // =============================================================================
  // TEACHERS
  // =============================================================================

  getTeachers(): Promise<Teacher[]> {
    return apiClient.get('/education/teachers')
  },

  getTeacher(id: string): Promise<Teacher> {
    return apiClient.get(`/education/teachers/${id}`)
  },

  // =============================================================================
  // TEACHER SUBJECTS
  // =============================================================================

  // `/education/teacher-subjects` отдаёт страницу (по умолчанию 10 связей), а фильтру
  // «преподаватели по предмету» нужны все. У `/subjects/active` связи вложены целиком
  // и без пагинации — разворачиваем их, подставляя предмет-родителя.
  async getTeacherSubjects(): Promise<TeacherSubject[]> {
    const subjects = await apiClient.get<{
      items: (Subject & {
        teacherSubjects?: (Omit<TeacherSubject, 'subject'> & { teacher: Teacher })[]
      })[]
    }>('/education/subjects/active')
    return (subjects.items ?? []).flatMap((subject) =>
      (subject.teacherSubjects ?? []).map((ts) => ({ ...ts, subject })),
    )
  },

  getTeacherSubjectsByTeacher(teacherId: string): Promise<TeacherSubject[]> {
    return apiClient.get(`/education/teacher-subjects/teacher/${teacherId}`)
  },

  getTeacherSubjectsBySubject(subjectId: string): Promise<TeacherSubject[]> {
    return apiClient.get(`/education/teacher-subjects/subject/${subjectId}`)
  },

  // =============================================================================
  // GROUPS
  // =============================================================================

  getGroups(): Promise<Group[]> {
    return apiClient.get('/education/groups')
  },

  getGroup(id: string): Promise<Group> {
    return apiClient.get(`/education/groups/${id}`)
  },
}
