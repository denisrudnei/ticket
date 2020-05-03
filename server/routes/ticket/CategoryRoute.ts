import express from 'express'
import CategoryController from '../../controllers/ticket/CategoryController'
const router = express.Router()

router.get('/category', CategoryController.getCategories)
router.get('/category/:name', CategoryController.getOne)
router.get('/category/:id/subs', CategoryController.getSubs)
router.get('/category/:id/image', CategoryController.getImage)
router.put('/category/:id/', CategoryController.edit)
router.post('/config/category', CategoryController.create)
router.post('/config/category/image/:id', CategoryController.setImage)

export default router
