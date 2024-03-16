import { Router } from 'express'

import ProductsController from '../controllers/ProductsController'
import uploadConfig from '@config/upload'

import './products.swagger'
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'
import multer from 'multer'

const productsRouter = Router()
const productsController = new ProductsController()

const upload = multer(uploadConfig.multer)

productsRouter.get('/', productsController.index)

productsRouter.get('/:slug/code/:product_id', productsController.show)
productsRouter.get('/variation-colors', productsController.indexVariationColors)
productsRouter.get('/variation-sizes', productsController.indexVariationSizes)

productsRouter.delete('/:productId', productsController.delete)
productsRouter.get('/emphasis', productsController.showEmphasis)

productsRouter.post(
  '/shipping-deadline',
  productsController.createShippingDeadline,
)
productsRouter.use(ensureAuthenticated)

productsRouter.post('/', productsController.create)

productsRouter.put('/:productId', productsController.update)
productsRouter.patch(
  '/:productId/time-discount-remove',
  productsController.updateRemoveTimeDiscount,
)
productsRouter.patch(
  '/:productId/image',
  upload.single('image'),
  productsController.updateImagePrimary,
)

export default productsRouter
