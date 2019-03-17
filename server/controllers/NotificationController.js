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

  app.post('/notification/:id/read', (req, res) => {
    Notification.findOneAndUpdate(
      {
        _id: req.params.id
      },
      {
        $set: {
          read: true
        }
      },
      (err) => {
        if (err) return res.status(500).json(err)
        io.emit('readNotification', {
          _id: req.params.id,
          read: true
        })
        return res.sendStatus(200)
      }
    )
  })
}
