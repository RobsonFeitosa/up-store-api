import { Router } from 'express'

import AddressController from '../controllers/AddressController'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'

const addressRouter = Router()
const addressController = new AddressController()

addressRouter.use(ensureAuthenticated)

addressRouter.post('/', addressController.create)
addressRouter.get('/profile', addressController.show)
addressRouter.get('/', addressController.index)
addressRouter.get('/is-primary', addressController.showIsPrimary)
addressRouter.put('/:addressId', addressController.update)
addressRouter.delete('/:addressId', addressController.delete)
addressRouter.patch('/primary/:addressId', addressController.updatePrimary)

export default addressRouter
