import { Router } from 'express'
import AddressRoute from './AddressRoute'
import AnalystRoute from './AnalystRoute'
import AuthRoute from './AuthRoute'
import ChatRoute from './ChatRoute'
import NotificationRoute from './NotificationRoute'
import ProfileRoute from './ProfileRoute'
import RoleRoute from './RoleRoute'
import Knowledge from './knowledge'
import Ticket from './ticket'

const router = Router()

router.use(AnalystRoute)
router.use(AddressRoute)
router.use(AuthRoute)
router.use(ChatRoute)
router.use(NotificationRoute)
router.use(ProfileRoute)
router.use(RoleRoute)
router.use(Knowledge)
router.use(Ticket)

export default router
