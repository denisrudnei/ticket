const CategoryService = require('../services/ticket/CategoryService')

const CategoryResolver = {
  Query: {
    Category: () => {
      return CategoryService.getCategories()
    },
    GetSubs: (_, { categoryId }) => {
      return CategoryService.getSubsForCategory(categoryId)
    }
  }
}

module.exports = CategoryResolver
