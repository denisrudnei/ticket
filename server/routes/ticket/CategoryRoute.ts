import express from 'express';
import CategoryController from '../../controllers/ticket/CategoryController';

const router = express.Router();

router.get('/category/:id/image', CategoryController.getImage);
router.post('/config/category/image/:id', CategoryController.setImage);

export default router;
