const CategoryService = require('../services/ticket/CategoryService')

const CategoryResolver = {
  Query: {
    Category: () => {
      return CategoryService.getCategories()
    }
  }
}

module.exports = CategoryResolver
