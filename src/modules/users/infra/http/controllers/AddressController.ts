import { Request, Response } from 'express'
import { container } from 'tsyringe'

import CreateAddressService from '@modules/users/services/CreateAddressService'
import ShowAddressService from '@modules/users/services/ShowAddressService'
import UpdateAddressService from '@modules/users/services/UpdateAddressService'
import IndexAddressService from '@modules/users/services/IndexAddressService'
import UpdatePrimaryAddressService from '@modules/users/services/UpdatePrimaryAddressService'
import DeleteAddressService from '@modules/users/services/DeleteAddressService'
import ShowIsPrimaryAddressService from '@modules/users/services/ShowIsPrimaryAddressService'

export default class AddressController {
  public async create(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id

    const createAddress = container.resolve(CreateAddressService)

    const address = await createAddress.execute({
      ...req.body,
      user_id,
    })

    return res.json(address)
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const userId = req.user.id

    const showAddress = container.resolve(ShowAddressService)

    const address = await showAddress.execute(userId)

    return res.json(address)
  }

  public async showIsPrimary(req: Request, res: Response): Promise<Response> {
    const userId = req.user.id

    const showAddress = container.resolve(ShowIsPrimaryAddressService)

    const address = await showAddress.execute(userId)

    return res.json(address)
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { addressId } = req.params

    const deleted = container.resolve(DeleteAddressService)

    await deleted.execute(addressId)

    return res.status(204).send()
  }

  public async updatePrimary(req: Request, res: Response): Promise<Response> {
    const { addressId } = req.params

    const updateAddress = container.resolve(UpdatePrimaryAddressService)

    await updateAddress.execute(addressId)

    return res.status(200).json()
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { addressId } = req.params
    const userId = req.user.id

    const {
      zipcode,
      city,
      state,
      country,
      neighborhood,
      title,
      primary,
      street,
      street_number,
    } = req.body

    const updateAddress = container.resolve(UpdateAddressService)

    const address = await updateAddress.execute({
      addressId,
      zipcode,
      city,
      state,
      title,
      primary,
      country,
      neighborhood,
      street,
      streetNumber: street_number,
      userId,
    })

    return res.json(address)
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 999999 } = request.query

    const indexAddress = container.resolve(IndexAddressService)

    const address = await indexAddress.execute({
      page: Number(page),
      limit: Number(limit),
    })

    return response.json(address)
  }
}
