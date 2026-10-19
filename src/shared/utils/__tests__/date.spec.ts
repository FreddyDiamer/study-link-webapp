import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { dateInputToIso, isoToDateInput, isPastDateInput, todayDateInput } from '../date'

describe('dateInputToIso', () => {
  it('отдаёт полный ISO, который принимает бэкенд', () => {
    const iso = dateInputToIso('2026-10-14')
    expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
  })

  it('срок — конец названного дня по местному времени', () => {
    const date = new Date(dateInputToIso('2026-10-14') as string)
    expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([2026, 9, 14])
    expect([date.getHours(), date.getMinutes()]).toEqual([23, 59])
  })

  it('пустое и битое значение — без срока', () => {
    expect(dateInputToIso('')).toBeUndefined()
    expect(dateInputToIso('не дата')).toBeUndefined()
  })
})

describe('isoToDateInput', () => {
  it('возвращает ту же дату, что ввели', () => {
    expect(isoToDateInput(dateInputToIso('2026-12-31'))).toBe('2026-12-31')
  })

  it('пустое и битое — пустая строка', () => {
    expect(isoToDateInput(null)).toBe('')
    expect(isoToDateInput('мусор')).toBe('')
  })
})

describe('прошедший срок', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 9, 19, 12, 0))
  })
  afterEach(() => vi.useRealTimers())

  it('сегодня — ещё можно, вчера — уже нет, пусто — не ошибка', () => {
    expect(todayDateInput()).toBe('2026-10-19')
    expect(isPastDateInput('2026-10-19')).toBe(false)
    expect(isPastDateInput('2026-10-18')).toBe(true)
    expect(isPastDateInput('')).toBe(false)
  })
})
