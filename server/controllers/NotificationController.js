const Notification = require('../models/Notification')

module.exports = (app, io) => {
  app.get('/notification/:id', (req, res) => {
    Notification.findOne(
      {
        _id: req.params.id
      },
      (err, notification) => {
        if (err) return res.status(500).json(err)
        return res.status(200).json(notification)
      }
    )
  })

  app.post('/notification/:userId', (req, res) => {
    Notification.find(
      {
        to: {
          $in: [req.params.userId]
        }
      },
      (err, notifications) => {
        if (err) return res.status(500).json(err)
        return res.status(200).json(notifications)
      }
    )
  })

  app.post('/notification/:id/read', async (req, res) => {
    const notification = await Notification.findOne({
      _id: req.params.id
    })

    notification.read = true
    io.emit('readNotification', notification)
    notification.save()
    return res.status(200).json(notification)
  })
}
