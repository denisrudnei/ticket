const express = require('express')
const router = express.Router()
const CategoryController = require('../../controllers/ticket/CategoryController')

router.get('/category', CategoryController.getCategories)
router.get('/category/:name', CategoryController.getOne)
router.get('/category/:id/subs', CategoryController.getSubs)
router.put('/category/:id/', CategoryController.edit)
router.post('/config/category', CategoryController.create)

module.exports = router
