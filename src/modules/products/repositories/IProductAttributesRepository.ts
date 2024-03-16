import IPaginationOptionsDTO from '../../dtos/IPaginationOptionsDTO'
import ICreateProductAttributesDTO from '../dtos/ICreateProductAttributesDTO'
import ProductAttributes from '../infra/typeorm/entities/ProductAttributes'

export default interface IProductAttributesRepository {
  create(data: ICreateProductAttributesDTO): Promise<ProductAttributes>
  findById(id: string): Promise<ProductAttributes | null>
  findAndCount(
    options: IPaginationOptionsDTO,
    productId: string,
  ): Promise<[ProductAttributes[], number]>
  findAllAttributesColors(): Promise<ProductAttributes[]>
  findAllAttributesSizes(): Promise<ProductAttributes[]>
  findByName(productId: string, name: string): Promise<ProductAttributes | null>
  delete(id: string): Promise<void>
  save(ProductAttributes: ProductAttributes): Promise<ProductAttributes>
  All(): Promise<ProductAttributes[]>
}
