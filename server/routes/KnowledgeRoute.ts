import { Router } from 'express';
import KnowledgeController from '../controllers/KnowledgeController';

const router = Router();

router.get('/knowledge/:id/file', KnowledgeController.getFile);
router.get('/knowledge/:id/files', KnowledgeController.getAllFiles);

router.post('/knowledge/tempFile', KnowledgeController.addTempFile);
router.post('/knowledge/:id/file', KnowledgeController.addFile);

export default router;
