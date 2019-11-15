const express = require('express')
const router = express.Router()
const RouterController = require('../controllers/RoleController')

router.get('/role', RouterController.getAll)
router.put('/config/role/:id', RouterController.updateRole)
router.post('/config/role/:id', RouterController.setAnalystRole)

module.exports = router
