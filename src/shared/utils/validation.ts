import { VALIDATION } from '@/shared/constants'

export const validatePrice = (price: number): string | null => {
  if (price < VALIDATION.MIN_PRICE) {
    return `Цена не может быть меньше ${VALIDATION.MIN_PRICE} ₽`
  }
  if (price > VALIDATION.MAX_PRICE) {
    return `Цена не может быть больше ${VALIDATION.MAX_PRICE} ₽`
  }
  return null
}

export const validateDescription = (description: string): string | null => {
  if (description.length < VALIDATION.MIN_DESCRIPTION_LENGTH) {
    return `Описание должно содержать минимум ${VALIDATION.MIN_DESCRIPTION_LENGTH} символов`
  }
  if (description.length > VALIDATION.MAX_DESCRIPTION_LENGTH) {
    return `Описание не может содержать больше ${VALIDATION.MAX_DESCRIPTION_LENGTH} символов`
  }
  return null
}

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} обязательно для заполнения`
  }
  return null
}

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return 'Введите корректный email'
  }
  return null
}

export const validatePhoneNumber = (phone: string): string | null => {
  const phoneRegex = /^(\+7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/
  if (!phoneRegex.test(phone)) {
    return 'Введите корректный номер телефона'
  }
  return null
}
