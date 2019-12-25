import express from 'express'
import NotificationController from '../controllers/NotificationController'
const router = express.Router()

router.get('/notification/:id', NotificationController.getOne)
router.post('/notification/', NotificationController.getAll)
router.post('/notification/:id/read', NotificationController.read)
router.post('/notification/readall', NotificationController.readAll)

export default router
