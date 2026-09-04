import { onBeforeUnmount, ref, type Ref } from 'vue'

/**
 * Обновление ленты жестом — привычно по Telegram и не занимает место в шапке,
 * где уже стоит «+». Кнопка «Повторить» остаётся только там, где жест бесполезен.
 */
export const usePullToRefresh = (
  scroller: Ref<HTMLElement | null>,
  onRefresh: () => Promise<unknown>,
) => {
  const THRESHOLD = 64
  const MAX = 96

  const pull = ref(0)
  const refreshing = ref(false)

  let startY = 0
  let active = false

  const onTouchStart = (event: TouchEvent) => {
    if (refreshing.value) return
    const el = scroller.value
    if (!el || el.scrollTop > 0) return
    startY = event.touches[0].clientY
    active = true
  }

  const onTouchMove = (event: TouchEvent) => {
    if (!active) return
    const delta = event.touches[0].clientY - startY
    if (delta <= 0) {
      pull.value = 0
      return
    }
    // сопротивление: тянуть дальше становится тяжелее
    pull.value = Math.min(MAX, delta * 0.5)
  }

  const onTouchEnd = async () => {
    if (!active) return
    active = false
    if (pull.value >= THRESHOLD) {
      refreshing.value = true
      pull.value = THRESHOLD
      try {
        await onRefresh()
      } finally {
        refreshing.value = false
        pull.value = 0
      }
    } else {
      pull.value = 0
    }
  }

  const bind = () => ({
    onTouchstart: onTouchStart,
    onTouchmove: onTouchMove,
    onTouchend: onTouchEnd,
    onTouchcancel: onTouchEnd,
  })

  onBeforeUnmount(() => {
    active = false
  })

  return {
    // State
    pull,
    refreshing,

    // Methods
    bind,
  }
}
