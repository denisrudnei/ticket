import { Router } from 'express'
import AuthRoute from './AuthRoute'
import TicketRoute from './ticket/index'
import KnowledgeRoute from './KnowledgeRoute'

const router = Router()

router.use(AuthRoute)
router.use(TicketRoute)
router.use(KnowledgeRoute)

export default router
