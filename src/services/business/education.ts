import { educationApi } from '@/services/api'
import { useTelegramStore } from '@/stores'
import type { Subject, Teacher, TeacherSubject } from '@/shared/types'

export class EducationService {
  private get telegramStore() {
    return useTelegramStore()
  }

  // =============================================================================
  // SUBJECTS
  // =============================================================================

  async getSubjects(): Promise<Subject[]> {
    try {
      return await educationApi.getSubjects()
    } catch (error) {
      this.handleError(error, 'Ошибка при получении предметов')
      throw error
    }
  }

  async getActiveSubjects(): Promise<Subject[]> {
    try {
      return await educationApi.getActiveSubjects()
    } catch (error) {
      this.handleError(error, 'Ошибка при получении активных предметов')
      throw error
    }
  }

  async getSubject(id: string): Promise<Subject> {
    try {
      return await educationApi.getSubject(id)
    } catch (error) {
      this.handleError(error, 'Ошибка при получении предмета')
      throw error
    }
  }

  // =============================================================================
  // TEACHERS
  // =============================================================================

  async getTeachers(): Promise<Teacher[]> {
    try {
      return await educationApi.getTeachers()
    } catch (error) {
      this.handleError(error, 'Ошибка при получении преподавателей')
      throw error
    }
  }

  async getTeacher(id: string): Promise<Teacher> {
    try {
      return await educationApi.getTeacher(id)
    } catch (error) {
      this.handleError(error, 'Ошибка при получении преподавателя')
      throw error
    }
  }

  // =============================================================================
  // TEACHER SUBJECTS
  // =============================================================================

  async getTeacherSubjects(): Promise<TeacherSubject[]> {
    try {
      return await educationApi.getTeacherSubjects()
    } catch (error) {
      this.handleError(error, 'Ошибка при получении связей преподаватель-предмет')
      throw error
    }
  }

  async getTeacherSubjectsByTeacher(teacherId: string): Promise<TeacherSubject[]> {
    try {
      return await educationApi.getTeacherSubjectsByTeacher(teacherId)
    } catch (error) {
      this.handleError(error, 'Ошибка при получении предметов преподавателя')
      throw error
    }
  }

  async getTeacherSubjectsBySubject(subjectId: string): Promise<TeacherSubject[]> {
    try {
      return await educationApi.getTeacherSubjectsBySubject(subjectId)
    } catch (error) {
      this.handleError(error, 'Ошибка при получении преподавателей предмета')
      throw error
    }
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  async getSubjectsWithTeachers(): Promise<Array<Subject & { teachers: Teacher[] }>> {
    try {
      const [subjects, teacherSubjects] = await Promise.all([
        this.getActiveSubjects(),
        this.getTeacherSubjects(),
      ])

      return subjects.map((subject) => ({
        ...subject,
        teachers: teacherSubjects
          .filter((ts) => ts.subjectId === subject.id && ts.isActive)
          .map((ts) => ts.teacher),
      }))
    } catch (error) {
      this.handleError(error, 'Ошибка при получении предметов с преподавателями')
      throw error
    }
  }

  async getTeachersWithSubjects(): Promise<Array<Teacher & { subjects: Subject[] }>> {
    try {
      const [teachers, teacherSubjects] = await Promise.all([
        this.getTeachers(),
        this.getTeacherSubjects(),
      ])

      return teachers.map((teacher) => ({
        ...teacher,
        subjects: teacherSubjects
          .filter((ts) => ts.teacherId === teacher.id && ts.isActive)
          .map((ts) => ts.subject),
      }))
    } catch (error) {
      this.handleError(error, 'Ошибка при получении преподавателей с предметами')
      throw error
    }
  }

  // =============================================================================
  // ERROR HANDLING
  // =============================================================================

  private handleError(error: any, defaultMessage: string): void {
    let message = defaultMessage

    if (error.response?.status === 404) {
      message = 'Данные не найдены'
    } else if (error.response?.status >= 500) {
      message = 'Проблемы на сервере. Попробуйте позже'
    } else if (error.message) {
      message = error.message
    }

    this.telegramStore.showAlert(message)
  }
}

export const educationService = new EducationService()
