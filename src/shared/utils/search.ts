/** «ивт21» находит «ИВТ-21-1»: регистр, пробелы, дефисы и точки при поиске не важны. */
export const normalizeSearch = (value: string): string =>
  value
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^\p{L}\p{N}]/gu, '')

/**
 * Локальный поиск по уже загруженному списку. Совпадения с начала идут первыми —
 * так же ранжирует серверный поиск, и списки в одном листе не спорят друг с другом.
 * sort стабилен: внутри каждой половины сохраняется исходный (алфавитный) порядок.
 */
export const filterByQuery = <T>(items: readonly T[], query: string, text: (item: T) => string) => {
  const q = normalizeSearch(query)
  if (!q) return [...items]
  return items
    .filter((item) => normalizeSearch(text(item)).includes(q))
    .sort(
      (a, b) =>
        Number(!normalizeSearch(text(a)).startsWith(q)) -
        Number(!normalizeSearch(text(b)).startsWith(q)),
    )
}
