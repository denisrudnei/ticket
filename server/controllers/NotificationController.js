const NotificationService = require('../../server/services/NotificationService')

module.exports = (app, io) => {
  app.get('/notification/:id', (req, res) => {
    NotificationService.getOne(req.params.id).then(notifications => {
      return res.status(200).json(notifications)
    })
  })

  app.post('/notification/', (req, res) => {
    const userId = req.session.authUser._id
    NotificationService.getAll(userId).then(notifications => {
      return res.status(200).json(notifications)
    })
  })

  app.post('/notification/:id/read', async (req, res) => {
    const userId = req.session.authUser._id
    NotificationService.toggleRead(userId, req.params.id).then(
      notifification => {
        io.emit('readNotification', notifification)
        return res.status(202).json(notifification)
      }
    )
  })

  app.post('/notification/readall', (req, res) => {
    const userId = req.session.authUser._id
    NotificationService.readall(userId).then(notifications => {
      return res.status(200).json(notifications)
    })
  })
}
