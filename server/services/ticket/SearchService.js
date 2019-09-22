const Ticket = require('../../models/ticket/Ticket')

const SearchService = {
  getTickets: (query = {}, sortBy, page = 1, limit = 10) => {
    return new Promise((resolve, reject) => {
      const filterKeys = Object.keys(Ticket.schema.paths)
      Object.keys(query).forEach(inQuery => {
        if (!filterKeys.includes(inQuery)) delete query[inQuery]
      })
      Ticket.paginate(
        query,
        {
          page,
          limit,
          sort: sortBy,
          populate: ['status']
        },
        (err, result) => {
          if (err) return reject(err)
          return resolve(result)
        }
      )
    })
  }
}

module.exports = SearchService
