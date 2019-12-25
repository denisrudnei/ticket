import express from 'express'
import ChatController from '../controllers/ChatController'
const router = express.Router()

router.post('/chat/message', ChatController.createMessage)
router.put('/chat/status', ChatController.changeStatus)
router.get('/chat/message/:user', ChatController.getMessage)

export default router
