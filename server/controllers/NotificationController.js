const NotificationService = require('../../server/services/NotificationService')

module.exports = {
  getOne: (req, res) => {
    NotificationService.getOne(req.params.id).then(notifications => {
      return res.status(200).json(notifications)
    })
  },

  getAll: (req, res) => {
    const userId = req.session.authUser._id
    NotificationService.getAll(userId).then(notifications => {
      return res.status(200).json(notifications)
    })
  },

  read: async (req, res) => {
    const userId = req.session.authUser._id
    NotificationService.toggleRead(userId, req.params.id).then(
      notifification => {
        // io.emit('readNotification', notifification)
        return res.status(202).json(notifification)
      }
    )
  },

  readAll: (req, res) => {
    const userId = req.session.authUser._id
    NotificationService.readall(userId).then(notifications => {
      return res.status(200).json(notifications)
    })
  }
}
