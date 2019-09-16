const express = require('express')
const router = express.Router()
const AddressController = require('../controllers/AddressController')

router.post('/address', AddressController.create)
router.get('/address', AddressController.getAll)
router.get('/address/:id', AddressController.getOne)
router.put('/address/:id', AddressController.edit)

module.exports = router
