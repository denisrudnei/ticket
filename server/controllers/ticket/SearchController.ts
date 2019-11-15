const SearchService = require('../../services/ticket/SearchService')

module.exports = {
  searchTicket: (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    SearchService.getTickets(req.query, page, limit)
      .then(tickets => {
        return res.status(200).json(tickets)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  }
}
