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
  },
  Mutation: {
    CreateCategory: (_, { category }) => {
      return CategoryService.create(category)
    },
    EditCategory: (_, { categoryId, category }) => {
      return CategoryService.edit(categoryId, category)
    }
  }
}

module.exports = CategoryResolver
