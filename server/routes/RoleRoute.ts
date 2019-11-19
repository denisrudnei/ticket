import express from 'express'
const router = express.Router()
import RouterController from '../controllers/RoleController'

router.get('/role', RouterController.getAll)
router.put('/config/role/:id', RouterController.updateRole)
router.post('/config/role/:id', RouterController.setAnalystRole)

export default router
