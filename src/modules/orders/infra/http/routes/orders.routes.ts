import { Router } from 'express'

import OrdersController from '../controller/OrdersController'
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'

const ordersRouter = Router()
const ordersController = new OrdersController()

ordersRouter.use(ensureAuthenticated)

ordersRouter.get('/last', ordersController.showLast)
ordersRouter.post('/', ordersController.create)
ordersRouter.patch('/code/:orderId', ordersController.updateTrackingCode)
ordersRouter.get('/', ordersController.index)
ordersRouter.get('/byuser', ordersController.indexByUser)
ordersRouter.get('/:id', ordersController.show)

export default ordersRouter
