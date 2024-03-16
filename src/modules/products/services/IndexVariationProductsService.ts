import { inject, injectable } from 'tsyringe'
import IProductAttributesRepository from '../repositories/IProductAttributesRepository'

interface VariationsColors {
  color: string
  total: number
}

@injectable()
class IndexVariationProductsService {
  constructor(
    @inject('ProductAttributesRepository')
    private productAttributesRepository: IProductAttributesRepository,
  ) {}

  public async execute(): Promise<VariationsColors[]> {
    const variationsAttributes =
      await this.productAttributesRepository.findAllAttributesColors()

    const variations = variationsAttributes
      .map((attribute) => attribute.variations)
      .flat()

    const result = variations.reduce((acc: VariationsColors[], curr) => {
      const existingColor = acc.find((item) => item.color === curr.name)
      if (existingColor) {
        existingColor.total += curr.quantity
      } else {
        acc.push({ color: curr.name, total: curr.quantity })
      }
      return acc
    }, [])

    return result
  }
}

export default IndexVariationProductsService
