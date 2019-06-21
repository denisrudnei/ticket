const Ticket = require('../models/Ticket')

module.exports = app => {
  app.get('/search', (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const filterKeys = Object.keys(Ticket.schema.paths)
    Object.keys(req.query).forEach(inquery => {
      if (!filterKeys.includes(inquery)) delete req.query[inquery]
    })
    Ticket.paginate(
      req.query,
      {
        page: page,
        limit: limit,
        populate: 'logs comments'
      },
      (err, result) => {
        if (err) return res.status(500).json(err)
        return res.status(200).json(result)
      }
    )
  })
}
