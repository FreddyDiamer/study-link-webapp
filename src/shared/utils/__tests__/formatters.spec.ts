import { describe, expect, it } from 'vitest'
import {
  addDays,
  countWithWord,
  formatDayMonth,
  formatDeadline,
  formatJoined,
  formatKopeks,
  pluralize,
} from '../formatters'

describe('formatKopeks', () => {
  it('переводит копейки бэкенда в рубли', () => {
    // 150000 копеек — это 1500 ₽, а не 150 000 ₽
    expect(formatKopeks(150000)).toBe('1 500 ₽')
  })

  it('группирует разряды', () => {
    expect(formatKopeks(1500000)).toBe('15 000 ₽')
    expect(formatKopeks(50000)).toBe('500 ₽')
  })

  it('не показывает ноль вместо отсутствующей суммы', () => {
    expect(formatKopeks(undefined)).toBe('—')
    expect(formatKopeks(null)).toBe('—')
  })

  it('ноль остаётся нулём', () => {
    expect(formatKopeks(0)).toBe('0 ₽')
  })
})

describe('pluralize', () => {
  it.each([
    [1, 'отклик'],
    [2, 'отклика'],
    [4, 'отклика'],
    [5, 'откликов'],
    [11, 'откликов'],
    [14, 'откликов'],
    [21, 'отклик'],
    [22, 'отклика'],
    [25, 'откликов'],
    [101, 'отклик'],
    [111, 'откликов'],
  ])('%i → %s', (n, expected) => {
    expect(pluralize(n, 'отклик', 'отклика', 'откликов')).toBe(expected)
  })

  it('ноль склоняется как «много»', () => {
    expect(countWithWord(0, 'отзыв', 'отзыва', 'отзывов')).toBe('0 отзывов')
  })
})

describe('formatDeadline', () => {
  it('пишет срок словами без года', () => {
    expect(formatDeadline('2026-06-28T00:00:00.000Z')).toBe('до 28 июня')
  })

  it('меняет предлог', () => {
    expect(formatDeadline('2026-06-28T00:00:00.000Z', 'к')).toBe('к 28 июня')
  })

  it('без даты говорит словами, а не пустотой', () => {
    expect(formatDeadline(null)).toBe('Срок не указан')
    expect(formatDeadline('не дата')).toBe('Срок не указан')
  })
})

describe('formatDayMonth и formatJoined', () => {
  it('дата без года', () => {
    expect(formatDayMonth('2026-06-24T10:00:00.000Z')).toBe('24 июня')
  })

  it('дата регистрации — опора доверия на пустом профиле', () => {
    expect(formatJoined('2026-06-02T10:00:00.000Z')).toBe('с 2 июня')
  })

  it('пустое значение не превращается в «Invalid Date»', () => {
    expect(formatDayMonth(null)).toBe('')
    expect(formatJoined(undefined)).toBe('')
  })
})

describe('addDays', () => {
  it('считает срок авто-закрытия сделки', () => {
    const from = new Date('2026-06-24T00:00:00.000Z')
    expect(formatDayMonth(addDays(from, 7))).toBe('1 июля')
  })

  it('не мутирует исходную дату', () => {
    const from = new Date('2026-06-24T00:00:00.000Z')
    addDays(from, 7)
    expect(from.toISOString()).toBe('2026-06-24T00:00:00.000Z')
  })
})
