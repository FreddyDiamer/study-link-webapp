import { describe, expect, it } from 'vitest'
import { userFacingMessage } from '../client'

const withBody = (message: unknown) => ({
  message: 'Request failed with status code 400',
  response: { data: { message } },
})

describe('userFacingMessage', () => {
  it('поднимает русскую причину из тела ответа', () => {
    expect(userFacingMessage(withBody('Преподаватель не ведёт этот предмет'))).toBe(
      'Преподаватель не ведёт этот предмет',
    )
  })

  it('ошибки валидации полей (массив) заменяет общим текстом', () => {
    expect(userFacingMessage(withBody(['limit must not be greater than 100']))).toBe(
      'Проверьте введённые данные',
    )
  })

  it('без ответа сервера — про связь, а не «Network Error»', () => {
    expect(userFacingMessage({ message: 'Network Error' })).toBe(
      'Нет связи с сервером. Проверьте интернет и попробуйте ещё раз',
    )
  })

  it('пустое тело — оставляет исходное сообщение', () => {
    expect(userFacingMessage(withBody(undefined))).toBe('Request failed with status code 400')
  })
})
