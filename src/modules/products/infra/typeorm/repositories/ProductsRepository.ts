import {
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
  IsNull,
  Between,
  Not,
  Repository,
  FindOperator,
  In,
} from 'typeorm'

import dataSource from '@shared/infra/typeorm'
import IProductsRepository from '@modules/products/repositories/IProductsRepository'
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO'
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO'
import IPaginationOptionsDTO from '@modules/dtos/IPaginationOptionsDTO'

import Product from '../entities/Product'

function isEmpty(variable: number | undefined) {
  return variable === null || variable === undefined
}

export type TypeProduct = 'product' | 'service'

export interface IFilterProduct {
  userId?: string
  onlyDiscount?: boolean
  type?: TypeProduct
  name?: string
  quantity?: number
  weight?: number
  priceMin?: number
  priceMax?: number
  categoryId?: string
  productIds?: string
  color?: string
  size?: string
}

export interface IFilterOrderProduct {
  timeDiscountPriory?: boolean
  releases?: boolean
  alphabeticalASC?: boolean
  alphabeticalDESC?: boolean
  highPrice?: boolean
  lowPrice?: boolean
  current?: boolean
  old?: boolean
}

const relations = [
  'images',
  'wish',
  'product_data',
  'attributes',
  'time_discount',
  'team',
]

interface IFindForId {
  id: string
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>

  constructor() {
    this.ormRepository = dataSource.getRepository(Product)
  }

  public async create(data: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create(data)

    await this.ormRepository.save(product)

    return product
  }

  public async findByName(name: string): Promise<Product | null> {
    const findProduct = await this.ormRepository.findOne({
      where: {
        name,
      },
    })

    return findProduct
  }

  public async findByTimeDiscountId(id: string): Promise<Product | null> {
    const findProduct = await this.ormRepository.findOne({
      where: {
        time_discount_id: id,
      },
    })

    return findProduct
  }

  public async findEmphasis(): Promise<Product | null> {
    const findProduct = await this.ormRepository.findOne({
      where: {
        emphasis: true,
      },
      relations,
    })

    return findProduct
  }

  public async findProductsAndServicesAll(
    options: IPaginationOptionsDTO,
  ): Promise<[Product[], number]> {
    const dates = await this.ormRepository.query(
      `select * from pd100_products, se100_service ORDER BY RANDOM()`,
    )

    return [[], 0]
  }

  public async findByTimeDiscountNull(): Promise<Product[]> {
    const products = await this.ormRepository.find({
      where: {
        time_discount_id: IsNull(),
      },
    })

    return products
  }

  public async findAndCount(
    options: IPaginationOptionsDTO,
    filter: IFilterProduct,
    order: IFilterOrderProduct,
  ): Promise<[Product[], number]> {
    const hasFilter = Object.keys(filter).length > 0
    console.log({ filter })
    const where:
      | FindOptionsWhere<Product>
      | FindOptionsWhere<Product>[]
      | undefined = [{}]

    if (filter.type) {
      where[0].type = filter.type
    }

    if (filter.name) {
      where[0].name = ILike(`%${filter.name}%`)
    }

    if (filter.quantity) {
      where[0].product_data = {
        quantity: filter.quantity,
      }
    }

    if (filter.weight) {
      where[0].product_data = {
        weight: filter.weight,
      }
    }

    if (filter.color) {
      where[0].attributes = {
        variations: {
          name: filter.color,
        },
      }
    }

    if (filter.size) {
      where[0].attributes = {
        variations: {
          name: filter.size,
        },
      }
    }

    if (filter.userId) {
      where[0].wish = {
        user_id: filter.userId,
      }
    }

    if (filter.categoryId) {
      where[0].categories = ILike(`%${filter.categoryId}%`)
    }

    if (filter.productIds) {
      const ids = JSON.parse(filter.productIds)
      where[0].id = In(ids)
    }

    if (filter.onlyDiscount) {
      where[0].time_discount_id = Not(IsNull())
    }

    if (filter.onlyDiscount) {
      where[0].time_discount_id = Not(IsNull())
    }

    if (!isEmpty(filter.priceMax) || !isEmpty(filter.priceMin)) {
      const price = Between(filter.priceMin, filter.priceMax)
      where[0].price = price as FindOperator<number>
    }

    const orders = {} as FindOptionsOrder<Product> | undefined
    if (orders) {
      orders.updated_at = 'DESC'
      orders.created_at = 'DESC'

      if (order.timeDiscountPriory) {
        orders.time_discount_id = 'ASC'
      }

      if (order.alphabeticalASC) {
        orders.name = 'ASC'
      }

      if (order.alphabeticalDESC) {
        orders.name = 'DESC'
      }

      if (order.highPrice) {
        orders.price = 'DESC'
      }

      if (order.lowPrice) {
        orders.price = 'ASC'
      }

      if (order.old) {
        orders.price = 'ASC'
      }
    }

    console.log({ where })

    const products = await this.ormRepository.findAndCount({
      take: options.limit,
      skip: (options.page - 1) * options.limit,
      relations,
      order: orders,
      ...(hasFilter && {
        where,
      }),
    })

    return products
  }

  // const relations = [
  //   'images',
  //   'wish',
  //   'product_data',
  //   'attributes',
  //   'time_discount',
  //   'team',
  // ]

  public async findById(id: string): Promise<Product | null> {
    const product = await this.ormRepository.findOne({
      where: {
        id,
      },
      relations,
      order: {
        updated_at: 'DESC',
        created_at: 'DESC',
      },
      withDeleted: true,
    })
    return product
  }

  public async findBySlugAndId(
    slug: string,
    id: string,
  ): Promise<Product | null> {
    const product = await this.ormRepository.findOne({
      where: {
        slug,
        id,
      },
      relations,
      order: {
        attributes: {
          variations: {
            created_at: 'ASC',
          },
        },
      },
      withDeleted: true,
    })

    return product
  }

  public async findAllById(products: IFindForId[]): Promise<Product[]> {
    const findProduct = await this.ormRepository.findByIds(products)

    return findProduct
  }

  public async All(): Promise<Product[]> {
    const products = await this.ormRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.images', 'images')
      .getMany()

    return products
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const updatedProducts = await this.ormRepository.save(products)

    return updatedProducts
  }

  public async delete(id: string): Promise<void> {
    const product = await this.ormRepository.findOne({
      where: {
        id,
      },
    })

    if (product) {
      this.ormRepository.remove(product)
    }
  }

  public async save(product: Product): Promise<Product> {
    return this.ormRepository.save(product)
  }
}

export default ProductsRepository
