import SearchService from '../services/ticket/SearchService'

const SearchResolver = {
  Query: {
    SearchTicket: (_: any, { page, limit, descending, sortBy, attributes }: any) => {
      const newAttributes: any = {}
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

export default SearchResolver
