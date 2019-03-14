const Ticket = require('../models/Ticket')

module.exports = app => {
  app.post('/search', (req, res) => {
    Ticket.find(req.body, (err, result) => {
      console.log(req.body)
      console.log(req.params)
      if (err) return res.status(500).json(err)
      return res.status(200).json(result)
    })
  })
}
