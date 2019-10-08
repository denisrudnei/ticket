const CategoryService = require('../services/ticket/CategoryService')

const CategoryResolver = {
  Query: {
    Category: () => {
      return CategoryService.getCategories()
    },
    CategoryByName: (_, { name }) => {
      return CategoryService.getOne(name)
    },
    GetSubs: (_, { categoryId }) => {
      return CategoryService.getSubsForCategory(categoryId)
    }
  }
}

module.exports = CategoryResolver
