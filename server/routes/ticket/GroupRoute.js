const express = require('express')
const router = express.Router()
const GroupController = require('../../controllers/ticket/GroupController')

router.get('/group', GroupController.getAll)
router.get('/group/:id', GroupController.getOne)
router.post('/config/group', GroupController.create)
router.post('/config/group/analyst/:groupId', GroupController.insertAnalyst)
router.put('/config/group/:id', GroupController.edit)
router.delete(
  '/config/group/analyst/:groupId/:analystId',
  GroupController.remove
)
module.exports = router
