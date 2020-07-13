import express from 'express'
import AnalystController from '../controllers/AnalystController'
const router = express.Router()

router.put('/analyst/image', AnalystController.updateImage)

export default router
