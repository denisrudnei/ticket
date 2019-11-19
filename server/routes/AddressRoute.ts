import express from 'express'
const router = express.Router()
import AddressController  from '../controllers/AddressController'

router.post('/address', AddressController.create)
router.get('/address', AddressController.getAll)
router.get('/address/:id', AddressController.getOne)
router.put('/address/:id', AddressController.edit)

export default router
