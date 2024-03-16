import { Repository } from 'typeorm'

import IAddressRepository from '@modules/users/repositories/IAddressRepository'
import dataSource from '@shared/infra/typeorm'

import Address from '../entities/Address'
import IPaginationOptionsDTO from '@modules/dtos/IPaginationOptionsDTO'
import ICreateAddressDTO from '@modules/users/dtos/ICreateAddressDTO'

class AddressRepository implements IAddressRepository {
  private ormRepository: Repository<Address>

  constructor() {
    this.ormRepository = dataSource.getRepository(Address)
  }

  public async create(addressData: ICreateAddressDTO): Promise<Address> {
    const address = this.ormRepository.create(addressData)

    await this.ormRepository.save(address)

    return address
  }

  public async findAll(): Promise<Address[]> {
    const addreses = await this.ormRepository.find()

    return addreses
  }

  public async findById(id: string): Promise<Address | null> {
    const address = await this.ormRepository.findOne({
      where: {
        id,
      },
    })

    return address
  }

  public async findByIdUser(userId: string): Promise<Address[]> {
    const address = await this.ormRepository.find({
      where: {
        user_id: userId,
      },
    })

    return address
  }

  public async findAndCount(
    options: IPaginationOptionsDTO,
  ): Promise<[Address[], number]> {
    const products = await this.ormRepository.findAndCount({
      take: options.limit,
      skip: (options.page - 1) * options.limit,
      order: {
        primary: 'DESC',
        updated_at: 'DESC',
        created_at: 'DESC',
      },
    })

    return products
  }

  public async save(address: Address): Promise<Address> {
    return this.ormRepository.save(address)
  }

  public async delete(id: string): Promise<void> {
    const result = await this.ormRepository.findOne({
      where: {
        id,
      },
    })

    if (result) {
      this.ormRepository.remove(result)
    }
  }
}

export default AddressRepository
