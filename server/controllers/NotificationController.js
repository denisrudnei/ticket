const Notification = require('../models/Notification')

const fields = ['to', 'from']

module.exports = (app, io) => {
  app.get('/notification/:id', (req, res) => {
    Notification.findOne({ _id: req.params.id })
      .populate(fields)
      .exec((err, notification) => {
        if (err) return res.status(500).json(err)
        return res.status(200).json(notification)
      })
  })

  app.post('/notification/:userId', (req, res) => {
    Notification.find({
      to: {
        $in: [req.params.userId]
      }
    })
      .populate(fields)
      .exec((err, notifications) => {
        if (err) return res.status(500).json(err)
        return res.status(200).json(notifications)
      })
  })

  app.post('/notification/:id/read', async (req, res) => {
    const notification = await Notification.findOne({
      _id: req.params.id
    }).populate(fields)

    notification.read = req.body.read
    io.emit('readNotification', notification)
    notification.save()
    return res.status(200).json(notification)
  })
}
