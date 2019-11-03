const SearchService = require('../services/ticket/SearchService')

const SearchResolver = {
  Query: {
    SearchTicket: (_, { page, limit, descending, sortBy, attributes }) => {
      const newAttributes = {}
      for (const property in attributes) {
        const attribute = attributes[property]
        if (Array.isArray(attribute)) {
          newAttributes[property] = {
            $in: attribute
          }
        } else {
          newAttributes[property] = attribute
        }
      }
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
