import { describe, expect, it } from 'vitest'
import { filterByQuery, normalizeSearch } from '../search'

describe('normalizeSearch', () => {
  it('убирает регистр, пробелы, дефисы и точки, ё = е', () => {
    expect(normalizeSearch('ИВТ-21-1')).toBe('ивт211')
    expect(normalizeSearch('  Иванов И. И. ')).toBe('ивановии')
    expect(normalizeSearch('Королёв')).toBe('королев')
  })
})

describe('filterByQuery', () => {
  const names = ['Высшая математика', 'Математика', 'Дискретная математика', 'Физика']
  const self = (s: string) => s

  it('пустой запрос — весь список в исходном порядке', () => {
    expect(filterByQuery(names, '  ', self)).toEqual(names)
  })

  it('совпадения с начала идут первыми, остальные — в исходном порядке', () => {
    expect(filterByQuery(names, 'матем', self)).toEqual([
      'Математика',
      'Высшая математика',
      'Дискретная математика',
    ])
  })

  it('номер группы находится без дефисов', () => {
    expect(filterByQuery(['4312', 'ИВТ-21-1', 'ИВТ-22-3'], 'ивт21', self)).toEqual(['ИВТ-21-1'])
  })

  it('не мутирует исходный список', () => {
    const source = [...names]
    filterByQuery(source, 'матем', self)
    expect(source).toEqual(names)
  })
})
