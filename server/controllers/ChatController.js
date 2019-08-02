const ChatService = require('../services/ChatService')

module.exports = (app, io) => {
  io.on(`updateLastActive`, info => {
    console.log(info)
  })
  app.post('/chat/message', (req, res) => {
    const toId = req.body.to._id
    const fromId = req.session.authUser._id
    const content = req.body.content
    ChatService.create(fromId, toId, content)
      .then(messageToSend => { 
        io.emit(`message/${req.body.to._id}`, req.body)
        return res.status(200).json(messageToSend)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.put('/chat/status', (req, res) => {
    const userId = req.session.authUser._id
    ChatService.changeStatus(userId, req.body.status)
      .then(() => {
        io.emit('chat/status/update', {
          id: userId,
          status: req.body.status
        })
        return res.sendStatus(201)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.get('/chat/message/:user', (req, res) => {
    const fromId = req.session.authUser._id
    const toId = req.params.user
    ChatService.get(fromId, toId)
      .then(messages => {
        return res.status(200).json(messages)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })
}
