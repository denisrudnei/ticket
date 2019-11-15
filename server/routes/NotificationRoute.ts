const express = require('express')
const router = express.Router()
const NotificationController = require('../controllers/NotificationController')

router.get('/notification/:id', NotificationController.getOne)
router.post('/notification/', NotificationController.getAll)
router.post('/notification/:id/read', NotificationController.read)
router.post('/notification/readall', NotificationController.readAll)

module.exports = router
