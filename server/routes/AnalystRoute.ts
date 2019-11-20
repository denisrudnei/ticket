import express from 'express'
const router = express.Router()
import AnalystController from '../controllers/AnalystController'

router.get('/analyst', AnalystController.getAll)
router.get('/analyst/:id', AnalystController.getOne)
router.get('/config/analyst', AnalystController.getConfigAnalysts)
router.post('/config/analyst', AnalystController.create)
router.post('/analyst/:id/groups', AnalystController.getGroups)
router.put('/analyst/sound/', AnalystController.editSound)
router.put('/analyst', AnalystController.edit)
router.put('/analyst/image', AnalystController.updateImage)
router.delete('/analyst/image', AnalystController.removeImage)
router.delete('/analyst/:id', AnalystController.remove)

export default router
