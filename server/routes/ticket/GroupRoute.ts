import express from 'express'
const router = express.Router()
import GroupController from '../../controllers/ticket/GroupController'

router.get('/group', GroupController.getAll)
router.get('/group/:id', GroupController.getOne)
router.post('/config/group', GroupController.create)
router.post('/config/group/analyst/:groupId', GroupController.insertAnalyst)
router.put('/config/group/:id', GroupController.edit)
router.delete(
  '/config/group/analyst/:groupId/:analystId',
  GroupController.remove
)
export default router
