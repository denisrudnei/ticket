import express from 'express'
const router = express.Router()
import NotificationController from '../controllers/NotificationController'

router.get('/notification/:id', NotificationController.getOne)
router.post('/notification/', NotificationController.getAll)
router.post('/notification/:id/read', NotificationController.read)
router.post('/notification/readall', NotificationController.readAll)

export default router
