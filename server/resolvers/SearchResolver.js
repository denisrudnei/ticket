const SearchService = require('../services/ticket/SearchService')

const SearchResolver = {
  Query: {
    SearchTicket: (_, { page, limit, descending, sortBy, attributes }) => {
      return SearchService.getTickets(
        attributes,
        {
          [sortBy]: descending
        },
        page,
        limit
      )
    }
  },
  Mutation: {}
}

module.exports = SearchResolver
