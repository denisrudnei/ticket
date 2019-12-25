import express from 'express'
import AddressController from '../controllers/AddressController'
const router = express.Router()

router.post('/address', AddressController.create)
router.get('/address', AddressController.getAll)
router.get('/address/:id', AddressController.getOne)
router.put('/address/:id', AddressController.edit)

export default router
