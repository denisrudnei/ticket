import { Router } from 'express'
import KnowledgeController from '../../controllers/knowledge/KnowledgeController'
const router = Router()

router.get('/knowledge', KnowledgeController.getUnCategorized)
router.get('/knowledge/all', KnowledgeController.getAll)
router.get('/knowledge/view/:id', KnowledgeController.getOne)
router.get('/knowledge/:id/file', KnowledgeController.getFile)
router.get('/knowledge/:id/files', KnowledgeController.getAllFiles)
router.get(
  '/knowledge/group/:groupName',
  KnowledgeController.getByKnowledgeGroup
)
router.post('/knowledge/', KnowledgeController.create)
router.put('/knowledge/:id', KnowledgeController.edit)
router.post('/knowledge/tempFile', KnowledgeController.addTempFile)
router.post('/knowledge/:id/file', KnowledgeController.addFile)
router.delete('/knowledge/:id', KnowledgeController.remove)

export default router
