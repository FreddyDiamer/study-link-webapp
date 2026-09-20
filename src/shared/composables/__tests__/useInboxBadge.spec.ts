import { beforeEach, describe, expect, it, vi } from 'vitest'

const orderService = { getMyRequests: vi.fn() }
const serviceService = { getMyServices: vi.fn() }

vi.mock('@/services/business', () => ({ orderService, serviceService }))

const { countPending, pendingLabel, pendingOnRequest, pendingOnService, useInboxBadge } =
  await import('../useInboxBadge')

const responses = (...statuses: string[]) => statuses.map((status) => ({ status }))
const page = (items: unknown[]) => ({ items, total: items.length })

describe('отклики, ждущие решения', () => {
  it('считает только PENDING', () => {
    expect(countPending(responses('PENDING', 'ACCEPTED', 'REJECTED', 'PENDING') as never)).toBe(2)
    expect(countPending(undefined)).toBe(0)
  })

  it('закрытая заявка и скрытая услуга никого не держат', () => {
    const pending = responses('PENDING')
    expect(pendingOnRequest({ status: 'OPEN', responses: pending } as never)).toBe(1)
    expect(pendingOnRequest({ status: 'CLOSED', responses: pending } as never)).toBe(0)
    expect(pendingOnRequest({ status: 'MATCHED', responses: pending } as never)).toBe(0)
    expect(pendingOnService({ status: 'ACTIVE', responses: pending } as never)).toBe(1)
    expect(pendingOnService({ status: 'INACTIVE', responses: pending } as never)).toBe(0)
  })

  it('склоняет глагол по числу', () => {
    expect(pendingLabel(1)).toBe('1 ждёт ответа')
    expect(pendingLabel(2)).toBe('2 ждут ответа')
    expect(pendingLabel(5)).toBe('5 ждут ответа')
    expect(pendingLabel(21)).toBe('21 ждёт ответа')
  })
})

describe('useInboxBadge', () => {
  beforeEach(() => {
    orderService.getMyRequests.mockReset()
    serviceService.getMyServices.mockReset()
  })

  it('складывает заявки и услуги', async () => {
    orderService.getMyRequests.mockResolvedValue(
      page([{ status: 'OPEN', responses: responses('PENDING', 'PENDING') }]),
    )
    serviceService.getMyServices.mockResolvedValue(
      page([{ status: 'ACTIVE', responses: responses('PENDING', 'ACCEPTED') }]),
    )

    const { pendingCount, refresh } = useInboxBadge()
    await refresh()

    expect(pendingCount.value).toBe(3)
  })

  it('при сбое оставляет прежнее значение', async () => {
    const { pendingCount, sync, refresh } = useInboxBadge()
    sync([{ status: 'OPEN', responses: responses('PENDING') }] as never, [])

    orderService.getMyRequests.mockRejectedValue(new Error('network'))
    serviceService.getMyServices.mockResolvedValue(page([]))
    await refresh()

    expect(pendingCount.value).toBe(1)
  })
})
