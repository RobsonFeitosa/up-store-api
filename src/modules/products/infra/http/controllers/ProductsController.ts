import { Request, Response } from 'express'

import { classToClass } from 'class-transformer'

import { container } from 'tsyringe'

import CreateProductService from '@modules/products/services/CreateProductService'
import IndexProductsService from '@modules/products/services/IndexProductsService'
import ShowProductService from '@modules/products/services/ShowProductService'
import UpdateProductService from '@modules/products/services/UpdateProductService'
import DeleteProductService from '@modules/products/services/DeleteProductService'
import UpdateImagePrimary from '@modules/products/services/UpdateImagePrimary'
import UpdateRemoveTimeDiscountOfProductService from '@modules/products/services/UpdateRemoveTimeDiscountOfProductService'
import ShowEmphasisProductService from '@modules/products/services/ShowEmphasisProductService'
import IndexTimeDiscountAvailableProduct from '@modules/products/services/IndexTimeDiscountAvailableProduct'
import CreateShippingDeadlineCorreiosService from '@modules/products/services/CreateShippingDeadlineCorreiosService'
import { TypeProduct } from '../../typeorm/repositories/ProductsRepository'
import IndexVariationProductsService from '@modules/products/services/IndexVariationProductsService'
import IndexSizesVariationProductsService from '@modules/products/services/IndexSizesVariationProductsService'

export default class ProductsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const data = request.body

    const createProoduct = container.resolve(CreateProductService)

    const product = await createProoduct.execute(data)

    return response.json(classToClass(product))
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const data = request.body
    const { productId } = request.params

    const updateProduct = container.resolve(UpdateProductService)

    const product = await updateProduct.execute({
      productId,
      ...data,
    })

    return response.json(classToClass(product))
  }

  public async updateRemoveTimeDiscount(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { productId } = request.params

    const updatService = container.resolve(
      UpdateRemoveTimeDiscountOfProductService,
    )

    await updatService.execute(productId)

    return response.status(204).send()
  }

  public async updateImagePrimary(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { productId } = request.params
    const file = (request as any).file as File

    const updateImage = container.resolve(UpdateImagePrimary)

    const archive = await updateImage.execute(productId, file)

    return response.json(classToClass(archive))
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const {
      page = 1,
      limit = 999999,
      userId,
      onlyDiscount,
      type,
      timeDiscountPriory,
      name,
      quantity,
      weight,
      priceMin,
      priceMax,
      lowPrice,
      color,
      size,
      highPrice,
      old,
      alphabeticalASC,
      alphabeticalDESC,
      categoryId,
      productIds,
    } = request.query

    const indexProducts = container.resolve(IndexProductsService)

    const products = await indexProducts.execute(
      {
        page: Number(page),
        limit: Number(limit),
      },
      {
        ...(userId && { userId: String(userId) }),
        ...(onlyDiscount && { onlyDiscount: Boolean(onlyDiscount) }),
        ...(type && { type: type as TypeProduct }),
        ...(name && { name: String(name) }),
        ...(quantity && { quantity: Number(quantity) }),
        ...(weight && { weight: Number(weight) }),
        ...(priceMin && { priceMin: Number(priceMin) }),
        ...(priceMax && { priceMax: Number(priceMax) }),
        ...(productIds && { productIds: String(productIds) }),
        ...(size && { size: String(size) }),
        ...(color && { color: String(color) }),
        ...(categoryId && {
          categoryId: String(categoryId),
        }),
      },
      {
        ...(timeDiscountPriory && {
          timeDiscountPriory: Boolean(timeDiscountPriory),
        }),
        ...(lowPrice && {
          lowPrice: Boolean(lowPrice),
        }),
        ...(highPrice && {
          highPrice: Boolean(highPrice),
        }),
        ...(old && {
          old: Boolean(old),
        }),
        ...(alphabeticalDESC && {
          alphabeticalDESC: Boolean(alphabeticalDESC),
        }),
        ...(alphabeticalASC && {
          alphabeticalASC: Boolean(alphabeticalASC),
        }),
      },
    )

    return response.json(classToClass(products))
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { slug, product_id } = request.params

    const showProduct = container.resolve(ShowProductService)

    const products = await showProduct.execute(slug, product_id)

    return response.json(classToClass(products))
  }

  public async indexVariationColors(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const showProductVariations = container.resolve(
      IndexVariationProductsService,
    )

    const products = await showProductVariations.execute()

    return response.json(classToClass(products))
  }

  public async indexVariationSizes(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const showProductVariations = container.resolve(
      IndexSizesVariationProductsService,
    )

    const products = await showProductVariations.execute()

    return response.json(classToClass(products))
  }

  public async createShippingDeadline(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { slug, product_id } = request.params

    const showProduct = container.resolve(CreateShippingDeadlineCorreiosService)

    const products = await showProduct.execute(slug, product_id)

    return response.json(classToClass(products))
  }

  public async showEmphasis(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const showProduct = container.resolve(ShowEmphasisProductService)

    const product = await showProduct.execute()

    return response.json(classToClass(product))
  }

  public async indexTimeDiscountsOptions(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const showProduct = container.resolve(IndexTimeDiscountAvailableProduct)

    const product = await showProduct.execute()

    return response.json(classToClass(product))
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { productId } = request.params

    const delProduct = container.resolve(DeleteProductService)

    await delProduct.execute(productId)

    return response.status(204).send()
  }
}
