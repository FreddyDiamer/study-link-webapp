import { nextTick, onActivated, onDeactivated, ref, type Ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

// скроллер экрана, который сейчас на виду: повторный тап по активному табу листает его наверх
let activeScroller: Ref<HTMLElement | null> | null = null

export const scrollActiveToTop = () => {
  activeScroller?.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

/**
 * Экран-список под <KeepAlive>: при возврате он там же, где его оставили.
 * Страницы скроллятся во внутреннем блоке, а не в окне, поэтому scrollBehavior роутера
 * тут не помогает; а отсоединённый от DOM блок теряет scrollTop — запоминаем его сами.
 *
 * @param onReturn тихое обновление данных при возврате — без скелетона, чтобы список не прыгал
 */
export const useKeptScroll = (scroller: Ref<HTMLElement | null>, onReturn?: () => unknown) => {
  let top = 0
  let mounted = false
  // при возврате карточки уже знакомы: повторное «всплытие» читалось бы как перезагрузка
  const revisited = ref(false)

  // onDeactivated уже поздно — блок отсоединён и scrollTop сброшен
  onBeforeRouteLeave(() => {
    top = scroller.value?.scrollTop ?? 0
  })

  onDeactivated(() => {
    revisited.value = true
    if (activeScroller === scroller) activeScroller = null
  })

  onActivated(async () => {
    activeScroller = scroller
    // первая активация совпадает с монтированием: данные грузит сам экран
    if (!mounted) {
      mounted = true
      return
    }
    await nextTick()
    if (scroller.value) scroller.value.scrollTop = top
    onReturn?.()
  })

  /** Экран открывают ради другого содержимого — прежняя позиция к нему не относится. */
  const resetScroll = () => {
    top = 0
    if (scroller.value) scroller.value.scrollTop = 0
  }

  return {
    // State
    revisited,

    // Methods
    resetScroll,
  }
}
