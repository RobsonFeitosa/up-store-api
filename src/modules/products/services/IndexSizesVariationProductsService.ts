import { inject, injectable } from 'tsyringe'
import IProductAttributesRepository from '../repositories/IProductAttributesRepository'

interface VariationsColors {
  size: string
  total: number
}

@injectable()
class IndexSizesVariationProductsService {
  constructor(
    @inject('ProductAttributesRepository')
    private productAttributesRepository: IProductAttributesRepository,
  ) {}

  public async execute(): Promise<VariationsColors[]> {
    const variationsAttributes =
      await this.productAttributesRepository.findAllAttributesSizes()

    const variations = variationsAttributes
      .map((attribute) => attribute.variations)
      .flat()

    const result = variations.reduce((acc: VariationsColors[], curr) => {
      const existingColor = acc.find((item) => item.size === curr.name)
      if (existingColor) {
        existingColor.total += curr.quantity
      } else {
        acc.push({ size: curr.name, total: curr.quantity })
      }
      return acc
    }, [])

    return result
  }
}

export default IndexSizesVariationProductsService
