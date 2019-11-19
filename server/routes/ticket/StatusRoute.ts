import express from 'express'
const router = express.Router()
import StatusController from '../../controllers/ticket/StatusController'

router.get('/status', StatusController.getStatus)
router.get('/status/:id', StatusController.getOne)
router.post('/config/status', StatusController.create)
router.put('/config/status/:id', StatusController.edit)

export default router
