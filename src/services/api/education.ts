import { apiClient } from './client'
import type { Subject, Teacher, TeacherSubject, Group } from '@/shared/types'

export const educationApi = {
  // =============================================================================
  // SUBJECTS
  // =============================================================================

  getSubjects(): Promise<Subject[]> {
    return apiClient.get('/education/subjects')
  },

  getActiveSubjects(): Promise<Subject[]> {
    return apiClient.get('/education/subjects/active')
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

  getTeacherSubjects(): Promise<TeacherSubject[]> {
    return apiClient.get('/education/teacher-subjects')
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

  createGroup(data: { number: string }): Promise<Group> {
    return apiClient.post('/education/groups', data)
  },

  deleteGroup(id: string): Promise<void> {
    return apiClient.delete(`/education/groups/${id}`)
  },
}
