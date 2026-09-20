import { useRouter } from 'vue-router'

/**
 * Выход из формы после успешной отправки. Форма не должна оставаться в истории:
 * иначе «назад» с экрана результата возвращает в уже отправленную форму, а не в список.
 */
export const useFormExit = () => {
  const router = useRouter()

  const exitTo = (path: string) => {
    // цель — предыдущий экран: возвращаемся на него, а не кладём его копию сверху
    if (window.history.state?.back === path) router.back()
    else router.replace(path)
  }

  return {
    // Methods
    exitTo,
  }
}
