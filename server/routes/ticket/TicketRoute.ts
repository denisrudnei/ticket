import express from 'express'
import { body, param, validationResult } from 'express-validator'
import TicketController from '../../controllers/ticket/TicketController'
import NotifyTicketUpdate from '../../middlewares/NotifyTicketUpdate'
import CreateTicketLog from '../../middlewares/CreateTicketLog'
const router = express.Router()

router.get('/ticket', TicketController.getTickets)
router.get('/ticket/profile/:type', TicketController.getByProfile)
router.post(
  '/ticket',
  [
    body('openedBy', 'Preencha o analista').exists(),
    body('actualUser', 'Preencha o usuário atual').exists(),
    body('group', 'Preencha um grupo').exists(),
    body('status', 'Preencha um status').exists(),
    body('resume').exists(),
    body('content').exists()
  ],
  (req: express.Request, res: express.Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json(errors.mapped())
  },
  TicketController.create
)
router.post(
  '/ticket/transfer/:id',
  NotifyTicketUpdate,
  CreateTicketLog,
  TicketController.transfer
)
router.post(
  '/ticket/updateStatus/:id',
  NotifyTicketUpdate,
  CreateTicketLog,
  TicketController.updateStatus
)
router.post(
  '/ticket/comment/:id',
  [
    body('content', 'Preencha o comentário').exists(),
    param('id', 'Precisa de um id').exists()
  ],
  NotifyTicketUpdate,
  TicketController.comment
)
router.get('/ticket/:id', TicketController.getOne)
router.put(
  '/ticket/:id',
  NotifyTicketUpdate,
  CreateTicketLog,
  TicketController.edit
)
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
