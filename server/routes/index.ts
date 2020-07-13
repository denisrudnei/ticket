import { Router } from 'express'
import AuthRoute from './AuthRoute'
import TicketRoute from './ticket/index'
import KnowledgeRoute from './KnowledgeRoute'
import AnalystRoute from './AnalystRoute'

const router = Router()

router.use(AuthRoute)
router.use(TicketRoute)
router.use(KnowledgeRoute)
router.use(AnalystRoute)

export default router
