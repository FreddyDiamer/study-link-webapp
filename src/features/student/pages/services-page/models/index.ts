import type { SelectOption } from '@/shared/components/ui'

export interface Service {
  id: string
  title: string
  description: string
  price: number
  priceType: 'hour' | 'lesson' | 'month'
  subject: string
  teacher: {
    id: string
    name: string
    experience: number
    rating: number
    reviewsCount: number
  }
  format: 'online' | 'offline' | 'both'
  workingHours: string
  availability: 'available' | 'busy' | 'limited'
  tags: string[]
}

export interface ServiceFilters {
  search: string
  subject: string
  teacher: string | null
  availability: 'all' | 'available' | 'busy' | 'limited'
  sortBy: 'price' | 'rating' | 'experience' | 'date'
  sortOrder: 'asc' | 'desc'
}

export const SORT_OPTIONS: SelectOption[] = [
  { value: 'rating', label: 'По рейтингу' },
  { value: 'price', label: 'По цене' },
  { value: 'experience', label: 'По опыту' },
  { value: 'date', label: 'По дате' },
]

export const SORT_ORDER_OPTIONS: SelectOption[] = [
  { value: 'asc', label: 'По возрастанию' },
  { value: 'desc', label: 'По убыванию' },
]
