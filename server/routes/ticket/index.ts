import { Router } from 'express'
import CategoryRoute from './CategoryRoute'
import TicketRoute from './TicketRoute'

const router = Router()

router.use(CategoryRoute)
router.use(TicketRoute)

export default router
