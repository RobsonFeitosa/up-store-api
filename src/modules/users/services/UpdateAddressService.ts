import { injectable, inject } from 'tsyringe'

import AppError from '@shared/errors/AppError'

import IAddressRepository from '../repositories/IAddressRepository'

import Address from '../infra/typeorm/entities/Address'

interface IRequest {
  addressId: string
  zipcode: string
  city: string
  state: string
  userId: string
  title: string
  country: string
  neighborhood: string
  primary: boolean
  street: string
  streetNumber: string
}

@injectable()
class UpdateAddressService {
  constructor(
    @inject('AddressRepository')
    private addressRepository: IAddressRepository,
  ) {}

  public async execute({
    addressId,
    zipcode,
    city,
    state,
    country,
    title,
    userId,
    primary,
    neighborhood,
    street,
    streetNumber,
  }: IRequest): Promise<Address> {
    const address = await this.addressRepository.findById(addressId)

    if (userId && primary) {
      const addressByUser = await this.addressRepository.findByIdUser(userId)

      for (const address of addressByUser) {
        address.primary = false

        await this.addressRepository.save(address)
      }
    }

    if (!address) throw new AppError('Address not found')

    address.zipcode = zipcode
    address.title = title
    address.city = city
    address.state = state
    address.country = country
    address.neighborhood = neighborhood
    address.street = street
    address.street_number = streetNumber
    address.primary = primary

    return this.addressRepository.save(address)
  }
}

export default UpdateAddressService
