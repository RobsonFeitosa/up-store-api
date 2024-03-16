import { injectable, inject } from 'tsyringe'

import IAddressRepository from '../repositories/IAddressRepository'
import Address from '../infra/typeorm/entities/Address'

import ICreateAddressDTO from '../dtos/ICreateAddressDTO'

@injectable()
class CreateAddressService {
  constructor(
    @inject('AddressRepository')
    private addressRepository: IAddressRepository,
  ) {}

  public async execute(data: ICreateAddressDTO): Promise<Address> {
    if (data.user_id && data.primary) {
      const addressByUser = await this.addressRepository.findByIdUser(
        data.user_id,
      )

      for (const address of addressByUser) {
        address.primary = false

        await this.addressRepository.save(address)
      }
    }

    const address = await this.addressRepository.create(data)

    return address
  }
}

export default CreateAddressService
