const express = require('express')
const router = express.Router()
const AnalystController = require('../controllers/AnalystController')

router.get('/analyst', AnalystController.getAll)
router.get('/analyst/:id', AnalystController.getOne)
router.get('/config/analyst', AnalystController.getConfigAnalysts)
router.post('/config/analyst', AnalystController.create)
router.post('/analyst/:id/groups', AnalystController.getGroups)
router.put('/analyst/sound/', AnalystController.editSound)
router.put('/analyst', AnalystController.edit)
router.put('/analyst/image', AnalystController.updateImge)
router.delete('/analyst/image', AnalystController.removeImage)
router.delete('/analyst/:id', AnalystController.remove)

module.exports = router
