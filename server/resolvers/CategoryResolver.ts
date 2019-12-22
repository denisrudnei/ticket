import CategoryService from '../services/ticket/CategoryService'
import {IResolvers} from 'graphql-tools'

const CategoryResolver: IResolvers = {
  Query: {
    Category: () => {
      return CategoryService.getCategories()
    },
    CategoryByName: (_: any, { name }: any) => {
      return CategoryService.getOne(name)
    },
    GetSubs: (_: any, { categoryId }: any) => {
      return CategoryService.getSubsForCategory(categoryId)
    }
  },
  Mutation: {
    CreateCategory: (_: any, { category }: any) => {
      return CategoryService.create(category)
    },
    EditCategory: (_: any, { categoryId, category }: any) => {
      return CategoryService.edit(categoryId, category)
    }
  }
}


export default CategoryResolver
