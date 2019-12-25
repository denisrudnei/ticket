import Ticket from '../../models/ticket/Ticket'

const SearchService = {
  getTickets: (query: any = {}, sortBy: any, page = 1, limit = 10) => {
    return new Promise((resolve, reject) => {
      // TODO
      const filterKeys = Object.keys(Ticket.schema.path)
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
        (err: Error, result) => {
          if (err) return reject(err)
          return resolve(result)
        }
      )
    })
  }
}

export default SearchService
