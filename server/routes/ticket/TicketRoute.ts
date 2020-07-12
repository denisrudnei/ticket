import express from 'express'
import { body, param, validationResult } from 'express-validator'
import TicketController from '../../controllers/ticket/TicketController'
import NotifyTicketUpdate from '../../middlewares/NotifyTicketUpdate'
import CreateTicketLog from '../../middlewares/CreateTicketLog'
const router = express.Router()

router.get('/ticket/:id/file', TicketController.getFile)
router.delete(
  '/ticket/:id/:file/file',
  NotifyTicketUpdate,
  CreateTicketLog,
  TicketController.deleteFile
)
router.post(
  '/ticket/:id/file',
  NotifyTicketUpdate,
  CreateTicketLog,
  TicketController.sendFile
)

export default router
