import {Router} from 'express'
const router = Router()
import KnowledgeStatusController  from '../../controllers/knowledge/KnowledgeStatusController'

router.get('/knowledge/status/', KnowledgeStatusController.getAll)

export default router
