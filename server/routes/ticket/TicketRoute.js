const express = require('express')
const router = express.Router()
const { body, param, validationResult } = require('express-validator')

const TicketController = require('../../controllers/ticket/TicketController')
const NotifiyTicketUpdate = require('../../middlewares/NotifyTicketUpdate')
const CreateTicketLog = require('../../middlewares/CreateTicketLog')

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
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json(errors.mapped())
  },
  TicketController.create
)
router.post(
  '/ticket/transfer/:id',
  NotifiyTicketUpdate,
  CreateTicketLog,
  TicketController.transfer
)
router.post(
  '/ticket/updateStatus/:id',
  NotifiyTicketUpdate,
  CreateTicketLog,
  TicketController.updateStatus
)
router.post(
  '/ticket/comment/:id',
  [
    body('content', 'Preencha o comentário').exists(),
    param('id', 'Precisa de um id').exists()
  ],
  NotifiyTicketUpdate,
  TicketController.comment
)
router.get('/ticket/:id', TicketController.getOne)
router.put(
  '/ticket/:id',
  NotifiyTicketUpdate,
  CreateTicketLog,
  TicketController.edit
)
router.get('/ticket/:id/file', TicketController.getFile)
router.delete(
  '/ticket/:id/:file/file',
  NotifiyTicketUpdate,
  CreateTicketLog,
  TicketController.deleteFile
)
router.post(
  '/ticket/:id/file',
  NotifiyTicketUpdate,
  CreateTicketLog,
  TicketController.sendFile
)

module.exports = router
