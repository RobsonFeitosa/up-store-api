import { injectable, inject } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import IAddressRepository from '../repositories/IAddressRepository'

@injectable()
class DeleteAddressService {
  constructor(
    @inject('AddressRepository')
    private addressRepository: IAddressRepository,
  ) {}

  public async execute(addressId: string): Promise<void> {
    const result = await this.addressRepository.findById(addressId)

    if (!result) throw new AppError('Address not found', 404)

    await this.addressRepository.delete(result.id)
  }
}

export default DeleteAddressService
