import { injectable, inject } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import Product from '../infra/typeorm/entities/Product'
import IProductsRepository from '../repositories/IProductsRepository'
import ITimeDiscountRepository from '../repositories/ITimeDiscountRepository'
import dayjs from 'dayjs'

@injectable()
class ShowEmphasisProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('TimeDiscountRepository')
    private readonly timeDiscountRepository: ITimeDiscountRepository,
  ) {}

  public async execute(): Promise<Product> {
    const product = await this.productsRepository.findEmphasis()

    if (!product) {
      throw new AppError('Product does not found')
    }

    if (product.time_discount && product.time_discount_id) {
      const start = dayjs(product.time_discount.startDate)
      const end = dayjs(product.time_discount.endDate)

      await this.timeDiscountExpired(end.isBefore(start), product)
    }

    return product
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

export default ShowEmphasisProductService
