import express from 'express'
import RouterController from '../controllers/RoleController'
const router = express.Router()

router.get('/role', RouterController.getAll)
router.put('/config/role/:id', RouterController.updateRole)
router.post('/config/role/:id', RouterController.setAnalystRole)

export default router
