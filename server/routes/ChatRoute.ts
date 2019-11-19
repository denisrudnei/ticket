import express from 'express'
const router = express.Router()
import ChatController from '../controllers/ChatController'

router.post('/chat/message', ChatController.createMessage)
router.put('/chat/status', ChatController.changeStatus)
router.get('/chat/message/:user', ChatController.getMessage)

export default router
