const Ticket = require('../models/Ticket')

module.exports = app => {
  app.post('/search', (req, res) => {
    Ticket.find(req.body)
      .populate([
        'group',
        'status',
        'openedBy',
        'actualUser',
        'category',
        'logs'
      ])
      .exec((err, result) => {
        if (err) return res.status(500).json(err)
        return res.status(200).json(result)
      })
  })
}
