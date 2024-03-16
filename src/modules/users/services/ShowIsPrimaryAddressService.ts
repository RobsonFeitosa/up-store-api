import { injectable, inject } from 'tsyringe'

import IAddressRepository from '../repositories/IAddressRepository'

@injectable()
class ShowIsPrimaryAddressService {
  constructor(
    @inject('AddressRepository')
    private addressRepository: IAddressRepository,
  ) {}

  public async execute(userId: string): Promise<boolean> {
    const address = await this.addressRepository.findByIdUser(userId)

    const isExistPrimary = !!address.find((address) => address.primary)

    return isExistPrimary
  }
}

export default ShowIsPrimaryAddressService
