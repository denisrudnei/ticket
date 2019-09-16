const express = require('express')
const router = express.Router()
const ChatControler = require('../controllers/ChatController')

router.post('/chat/message', ChatControler.createMessage)
router.put('/chat/status', ChatControler.changeStatus)
router.get('/chat/message/:user', ChatControler.getMessage)

module.exports = router
