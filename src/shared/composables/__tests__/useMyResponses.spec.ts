import { beforeEach, describe, expect, it, vi } from 'vitest'

const orderService = {
  getMyRequestResponses: vi.fn(),
  getMyServiceResponses: vi.fn(),
  getDeals: vi.fn(),
}

vi.mock('@/services/business', () => ({ orderService }))

const { useMyResponses } = await import('../useMyResponses')
const { useDealsBadge } = await import('../useDealsBadge')

const requestResponse = (overrides: Record<string, unknown> = {}) => ({
  id: 'rr-1',
  status: 'PENDING',
  price: 130000,
  message: 'Разберём по шагам',
  createdAt: '2026-06-18T10:00:00.000Z',
  request: {
    status: 'OPEN',
    subject: { name: 'Химия' },
    teacher: { fullName: 'Белова Н.П.' },
    student: { name: 'Ольга Зайцева' },
  },
  ...overrides,
})

const page = (items: unknown[]) => ({ items, total: items.length })

describe('useMyResponses', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    orderService.getMyServiceResponses.mockResolvedValue(page([]))
  })

  it('ждущий отклик остаётся живым', async () => {
    orderService.getMyRequestResponses.mockResolvedValue(page([requestResponse()]))

    const my = useMyResponses()
    await my.load()

    expect(my.pending.value).toHaveLength(1)
    expect(my.items.value[0].label).toBe('Ждёт ответа')
    expect(my.items.value[0].message).toBe('Разберём по шагам')
  })

  it('различает «выбрали другого» и «заявку закрыли»', async () => {
    orderService.getMyRequestResponses.mockResolvedValue(
      page([
        requestResponse({
          id: 'rr-matched',
          status: 'REJECTED',
          request: { ...requestResponse().request, status: 'MATCHED' },
        }),
        requestResponse({
          id: 'rr-closed',
          status: 'REJECTED',
          request: { ...requestResponse().request, status: 'CLOSED' },
        }),
      ]),
    )

    const my = useMyResponses()
    await my.load()

    const labels = my.items.value.map((i) => i.label)
    expect(labels).toContain('Выбрали другого')
    expect(labels).toContain('Заявку закрыли')
    expect(my.closed.value).toHaveLength(2)
  })

  it('складывает отклики на заявки и на услуги в один список', async () => {
    orderService.getMyRequestResponses.mockResolvedValue(page([requestResponse()]))
    orderService.getMyServiceResponses.mockResolvedValue(
      page([
        {
          id: 'sr-1',
          status: 'ACCEPTED',
          price: null,
          createdAt: '2026-06-20T10:00:00.000Z',
          service: {
            price: 120000,
            subject: { name: 'Английский' },
            teacher: { fullName: 'Кузнецова О.В.' },
            tutor: { name: 'Мария Орлова' },
          },
        },
      ]),
    )

    const my = useMyResponses()
    await my.load()

    expect(my.items.value).toHaveLength(2)
    // свежий отклик идёт первым
    expect(my.items.value[0].kind).toBe('service')
    // цена берётся из услуги, когда своя не указана
    expect(my.items.value[0].price).toBe(120000)
    expect(my.accepted.value).toHaveLength(1)
  })

  it('сбой не роняет экран, а поднимает флаг', async () => {
    orderService.getMyRequestResponses.mockRejectedValue(new Error('network'))

    const my = useMyResponses()
    await my.load()

    expect(my.failed.value).toBe(true)
    expect(my.items.value).toHaveLength(0)
  })

  it('срок ожидания считается словами', () => {
    const my = useMyResponses()
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()

    expect(my.waitingLabel(twoDaysAgo)).toBe('2 дня')
    expect(my.waitingLabel(new Date().toISOString())).toBe('сегодня')
  })
})

describe('useDealsBadge', () => {
  beforeEach(() => vi.clearAllMocks())

  it('считает активной любую незавершённую сделку', async () => {
    orderService.getDeals.mockResolvedValue(
      page([
        { status: 'PENDING' },
        { status: 'ACCEPTED' },
        { status: 'IN_PROGRESS' },
        { status: 'COMPLETED' },
        { status: 'CANCELLED' },
      ]),
    )

    const badge = useDealsBadge()
    await badge.refresh()

    expect(badge.activeCount.value).toBe(3)
  })
})
