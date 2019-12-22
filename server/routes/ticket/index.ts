import { Router } from 'express'
import CategoryRoute from './CategoryRoute'
import GroupRoute from './GroupRoute'
import SearchRoute from './SearchRoute'
import StatusRoute from './StatusRoute'
import TicketRoute from './TicketRoute'

const router = Router()

router.use(CategoryRoute)
router.use(GroupRoute)
router.use(SearchRoute)
router.use(StatusRoute)
router.use(TicketRoute)

export default router