import { inject, injectable } from 'tsyringe'

import Order from '../infra/typeorm/entities/Order'
import IOrdersRepository from '../repositories/IOrdersRepository'

interface IRequest {
  id: string
}

@injectable()
class ShowLastOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<Order | undefined> {
    const ordersData = await this.ordersRepository.findAndCountByUser(id, {
      limit: 9999,
      page: 1,
    })

    const [orders] = ordersData

    const lastOrder = orders[orders.length - 1]
    return lastOrder
  }
}

export default ShowLastOrderService
