import { Router } from 'express'
import KnowledgeStatusController from '../../controllers/knowledge/KnowledgeStatusController'
const router = Router()

router.get('/knowledge/status/', KnowledgeStatusController.getAll)

export default router
