import { Request, Response } from 'express'

import { container } from 'tsyringe'

import CreateOrderService from '@modules/orders/services/CreateOrderService'
import FindOrderService from '@modules/orders/services/FindOrderService'
import { classToClass } from 'class-transformer'
import IndexOrderByUserService from '@modules/orders/services/IndexOrderByUserService'
import IndexOrderService from '@modules/orders/services/IndexOrderService'
import UpdateTrakingCodeService from '@modules/orders/services/UpdateTrakingCodeService'
import ShowLastOrderService from '@modules/orders/services/ShowLastOrderService'

export default class OrdersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const id = request.user.id

    const createOrder = container.resolve(CreateOrderService)

    const order = await createOrder.execute({
      user_id: id,
      payload: {
        ...request.body,
      },
    })

    return response.json(classToClass(order))
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const findOrder = container.resolve(FindOrderService)

    const order = await findOrder.execute({
      id,
    })

    return response.json(classToClass(order))
  }

  public async showLast(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const id = request.user.id

    const findOrder = container.resolve(ShowLastOrderService)

    const order = await findOrder.execute({
      id,
    })

    return response.json(classToClass(order))
  }

  public async indexByUser(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const id = request.user.id
    const { page = 1, limit = 99999 } = request.query

    const findOrder = container.resolve(IndexOrderByUserService)

    const order = await findOrder.execute(id, {
      page: Number(page),
      limit: Number(limit),
    })

    return response.json(classToClass(order))
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 99999 } = request.query

    const findOrder = container.resolve(IndexOrderService)

    const order = await findOrder.execute({
      page: Number(page),
      limit: Number(limit),
    })

    return response.json(classToClass(order))
  }

  public async updateTrackingCode(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { orderId } = request.params
    const { tracking_code } = request.body

    const updateOrder = container.resolve(UpdateTrakingCodeService)

    const order = await updateOrder.execute(orderId, tracking_code)

    return response.json(classToClass(order))
  }
}
