import { injectable, inject } from 'tsyringe'

import Product from '../infra/typeorm/entities/Product'
import IProductsRepository from '../repositories/IProductsRepository'
import IPaginationOptionsDTO from '../../dtos/IPaginationOptionsDTO'
import IWishRepository from '../repositories/IWishRepository'
import ICategoriesRepository from '../repositories/ICategoriesRepository'
import Categories from '../infra/typeorm/entities/ProductCategory'
import {
  IFilterOrderProduct,
  IFilterProduct,
} from '../infra/typeorm/repositories/ProductsRepository'
import TimeDiscountRepository from '../infra/typeorm/repositories/TimeDiscountRepository'
import TimeDiscount from '../infra/typeorm/entities/TimeDiscount'
import dayjs from 'dayjs'
import ITimeDiscountRepository from '../repositories/ITimeDiscountRepository'

@injectable()
class IndexProductsService {
  constructor(
    @inject('ProductsRepository')
    private readonly productsRepository: IProductsRepository,

    @inject('WishRepository')
    private readonly wishRepository: IWishRepository,

    @inject('TimeDiscountRepository')
    private readonly timeDiscountRepository: ITimeDiscountRepository,

    @inject('CategoriesRepository')
    private readonly categoriesRepository: ICategoriesRepository,
  ) {}

  public async execute(
    options: IPaginationOptionsDTO,
    filter: IFilterProduct,
    order: IFilterOrderProduct,
  ): Promise<[Product[], number]> {
    const products = await this.productsRepository.findAndCount(
      options,
      filter,
      order,
    )

    for (const product of products[0]) {
      const wish = await this.wishRepository.findByProductAndUser(
        product.id,
        filter.userId,
      )

      if (product.categories) {
        const categories: Categories[] = []
        for (const categoryId of JSON.parse(product.categories)) {
          const category = await this.categoriesRepository.findById(categoryId)

          if (category) {
            categories.push(category)
          }
        }

        product.categories_items = categories
      }

      product.wish = wish ?? null

      if (product.time_discount && product.time_discount_id) {
        const start = dayjs(product.time_discount.startDate)
        const end = dayjs(product.time_discount.endDate)

        this.timeDiscountExpired(start.isBefore(end), product)
      }
    }

    return products
  }

  async timeDiscountExpired(
    isExpired: boolean,
    product: Product,
  ): Promise<void> {
    if (isExpired) {
      product.time_discount = null

      if (product.time_discount_id) {
        const timeDiscount = await this.timeDiscountRepository.findById(
          product.time_discount_id,
        )

        if (timeDiscount) {
          timeDiscount.status = 'expired'

          await this.timeDiscountRepository.save(timeDiscount)
        }
      }
    }
  }
}

export default IndexProductsService
