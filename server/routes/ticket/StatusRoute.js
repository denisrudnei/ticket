const express = require('express')
const router = express.Router()
const StatusController = require('../../controllers/ticket/StatusController')

router.get('/status', StatusController.getStatus)
router.get('/status/:id', StatusController.getOne)
router.post('/config/status', StatusController.create)
router.put('/config/status/:id', StatusController.edit)

module.exports = router
