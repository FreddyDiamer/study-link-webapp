import { apiClient } from './client'

export interface Tutor {
  id: string
  name: string
  avatar?: string
  rating: number
  reviewsCount: number
  experience: number
  education: string
  subjects: string[]
  specializations: string[]
  price: number
  isOnline: boolean
  responseTime: string
  description: string
  format: string[]
  availability: string
  isVerified: boolean
  isTopRated: boolean
}

export interface TutorSearchParams {
  subject?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  format?: 'online' | 'offline' | 'both'
  availability?: string
  sortBy?: 'rating' | 'price' | 'experience' | 'reviews'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface TutorSearchResponse {
  tutors: Tutor[]
  total: number
  page: number
  totalPages: number
}

export const tutorsApi = {
  // Поиск репетиторов
  search: (params: TutorSearchParams) => apiClient.get<TutorSearchResponse>('/tutors', params),

  // Получение репетитора по ID
  getById: (id: string) => apiClient.get<Tutor>(`/tutors/${id}`),

  // Получение избранных репетиторов
  getFavorites: () => apiClient.get<Tutor[]>('/tutors/favorites'),

  // Добавление в избранное
  addToFavorites: (tutorId: string) => apiClient.post(`/tutors/${tutorId}/favorite`),

  // Удаление из избранного
  removeFromFavorites: (tutorId: string) => apiClient.delete(`/tutors/${tutorId}/favorite`),

  // Получение отзывов о репетиторе
  getReviews: (tutorId: string, page = 1, limit = 10) =>
    apiClient.get(`/tutors/${tutorId}/reviews`, { page, limit }),

  // Получение доступных предметов
  getSubjects: () => apiClient.get<string[]>('/tutors/subjects'),

  // Получение популярных репетиторов
  getPopular: (limit = 6) => apiClient.get<Tutor[]>('/tutors/popular', { limit }),
}
