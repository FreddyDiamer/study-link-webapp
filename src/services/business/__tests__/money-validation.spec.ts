import { beforeEach, describe, expect, it, vi } from 'vitest'

// суммы везде в копейках, а раньше пороги сверялись с рублёвыми числами —
// заявка дороже 500 ₽ не проходила валидацию до отправки
const telegramStore = {
  hapticFeedback: vi.fn(),
  showAlert: vi.fn(),
}

vi.mock('@/stores', () => ({ useTelegramStore: () => telegramStore }))

const ordersApi = {
  createRequest: vi.fn().mockResolvedValue({ id: 'request-1', budget: 200000 }),
  createServiceResponse: vi.fn().mockResolvedValue({ id: 'response-1' }),
  createRequestResponse: vi.fn().mockResolvedValue({ id: 'response-1' }),
}
const tutorsApi = {
  createService: vi.fn().mockResolvedValue({ id: 'service-1', price: 150000 }),
}

vi.mock('@/services/api', () => ({ ordersApi, tutorsApi }))

const { orderService } = await import('../order')
const { serviceService } = await import('../service')

const RUB = 100

describe('бюджет заявки', () => {
  beforeEach(() => vi.clearAllMocks())

  const create = (budget?: number) =>
    orderService.createRequest({
      studentId: 'student-1',
      subjectId: 'subject-1',
      teacherId: 'teacher-1',
      budget,
    })

  it('пропускает обычный студенческий бюджет', async () => {
    await expect(create(2000 * RUB)).resolves.toBeDefined()
    expect(ordersApi.createRequest).toHaveBeenCalled()
  })

  it('пропускает дорогую работу вроде диплома', async () => {
    await expect(create(20000 * RUB)).resolves.toBeDefined()
  })

  it('не пропускает слишком маленькую сумму', async () => {
    await expect(create(50 * RUB)).rejects.toThrow()
    expect(ordersApi.createRequest).not.toHaveBeenCalled()
  })

  it('не пропускает сумму выше потолка', async () => {
    await expect(create(60000 * RUB)).rejects.toThrow()
  })

  it('бюджет необязателен', async () => {
    await expect(create(undefined)).resolves.toBeDefined()
  })

  it('требует предмет и преподавателя', async () => {
    await expect(
      orderService.createRequest({
        studentId: 'student-1',
        subjectId: '',
        teacherId: 'teacher-1',
      }),
    ).rejects.toThrow()
  })
})

describe('цена услуги', () => {
  beforeEach(() => vi.clearAllMocks())

  const create = (price: number) =>
    serviceService.createService({
      subjectId: 'subject-1',
      teacherId: 'teacher-1',
      price,
    })

  it('пропускает обычную цену занятия', async () => {
    await expect(create(1500 * RUB)).resolves.toBeDefined()
  })

  it('не пропускает цену ниже минимума', async () => {
    await expect(create(50 * RUB)).rejects.toThrow()
    expect(tutorsApi.createService).not.toHaveBeenCalled()
  })
})
