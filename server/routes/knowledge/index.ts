import {Router} from 'express'
import KnowledgeRoute from './KnowledgeRoute'
import KnowledgeStatusRoute from './KnowledgeStatusRoute'

const router = Router()

router.use(KnowledgeRoute)
router.use(KnowledgeStatusRoute)

export default router