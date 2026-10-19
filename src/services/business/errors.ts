/**
 * Причина сбоя для человека. apiClient уже положил в error.message русский текст бэкенда
 * (или «нет связи»), валидация бизнес-слоя бросает Error со своим текстом — их и показываем.
 * Права и пропажа записи — своими словами, падение сервера — без технических подробностей.
 */
export const toUserMessage = (
  error: unknown,
  fallback: string,
  notFound = 'Запись не найдена',
): string => {
  const status = (error as { response?: { status?: number } })?.response?.status
  if (status === 403) return 'Недостаточно прав для выполнения операции'
  if (status === 404) return notFound
  if (status !== undefined && status >= 500) return 'Проблемы на сервере. Попробуйте позже'
  const message = error instanceof Error ? error.message : ''
  return message || fallback
}

/** Ошибка отправки формы: форма показывает её у кнопки, без модального алерта. */
export const formError = (error: unknown, fallback: string, notFound?: string) =>
  new Error(toUserMessage(error, fallback, notFound))
