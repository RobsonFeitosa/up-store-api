import { In, Repository } from 'typeorm'
import ProductAttributes from '../entities/ProductAttributes'
import dataSource from '@shared/infra/typeorm'
import IPaginationOptionsDTO from '@modules/dtos/IPaginationOptionsDTO'
import IProductAttributesRepository from '@modules/products/repositories/IProductAttributesRepository'
import ICreateProductAttributesDTO from '@modules/products/dtos/ICreateProductAttributesDTO'

class ProductAttributesRepository implements IProductAttributesRepository {
  private ormRepository: Repository<ProductAttributes>

  constructor() {
    this.ormRepository = dataSource.getRepository(ProductAttributes)
  }

  public async create(
    data: ICreateProductAttributesDTO,
  ): Promise<ProductAttributes> {
    const created = this.ormRepository.create({
      ...data,
      options: JSON.stringify(data.options),
    })

    const productAttr = await this.ormRepository.save(created)

    return productAttr
  }

  public async findAndCount(
    options: IPaginationOptionsDTO,
    productId: string,
  ): Promise<[ProductAttributes[], number]> {
    const productAttr = await this.ormRepository.findAndCount({
      take: options.limit,
      skip: (options.page - 1) * options.limit,
      where: {
        product_id: productId,
      },
      order: {
        created_at: 'DESC',
      },
    })

    return productAttr
  }

  public async findAllAttributesColors(): Promise<ProductAttributes[]> {
    const productAttr = await this.ormRepository.find({
      where: {
        name: In(['Cores', 'Cor', 'cor', 'cores']),
      },
      order: {
        created_at: 'DESC',
      },
      relations: ['variations'],
    })

    return productAttr
  }

  public async findAllAttributesSizes(): Promise<ProductAttributes[]> {
    const productAttr = await this.ormRepository.find({
      where: {
        name: In(['Tamanhos', 'tamanho', 'Tamanho', 'tamanhos']),
      },
      order: {
        created_at: 'DESC',
      },
      relations: ['variations'],
    })

    return productAttr
  }

  public async findById(id: string): Promise<ProductAttributes | null> {
    const productAttr = await this.ormRepository.findOne({
      where: {
        id,
      },
    })

    return productAttr
  }

  public async findByName(
    productId: string,
    name: string,
  ): Promise<ProductAttributes | null> {
    const productAttr = await this.ormRepository.findOne({
      where: {
        product_id: productId,
        name,
      },
    })

    return productAttr
  }

  public async delete(id: string): Promise<void> {
    const productAttr = await this.ormRepository.findOne({
      where: {
        id,
      },
    })

    if (productAttr) {
      this.ormRepository.remove(productAttr)
    }
  }

  public async All(): Promise<ProductAttributes[]> {
    const productAttr = await this.ormRepository.find()

    return productAttr
  }

  public async save(
    productAttr: ProductAttributes,
  ): Promise<ProductAttributes> {
    return this.ormRepository.save(productAttr)
  }
}

export default ProductAttributesRepository
