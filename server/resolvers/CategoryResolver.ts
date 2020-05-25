import {
  Mutation,
  Query,
  Resolver,
  Arg,
  ID,
  FieldResolver,
  Root,
  Authorized
} from 'type-graphql'
import CategoryService from '../services/ticket/CategoryService'
import Category from '../models/ticket/Category'
import CategoryInput from '../inputs/CategoryInput'
import CategoryField from '../models/ticket/CategoryField'

@Resolver(of => Category)
class CategoryResolver {
  @Query(() => [Category])
  @Authorized('user')
  Category() {
    return CategoryService.getCategories()
  }

  @Query(() => Category)
  @Authorized('user')
  CategoryByName(@Arg('name', () => String) name: Category['name']) {
    return CategoryService.getOne(name)
  }

  @Query(() => [Category])
  @Authorized('user')
  GetSubs(@Arg('categoryId', Category => ID) categoryId: Category['id']) {
    return CategoryService.getSubsForCategory(categoryId)
  }

  @FieldResolver()
  fields(@Root() category: Category): Promise<CategoryField[]> {
    return new Promise((resolve, reject) => {
      Category.findOne(category.id, { relations: ['fields'] }).then(
        category => {
          resolve(category!.fields)
        }
      )
    })
  }

  @Mutation(() => Category)
  CreateCategory(
    @Arg('category', () => CategoryInput)
    @Arg('category', () => CategoryInput)
    category: Category
  ) {
    return CategoryService.create(category)
  }

  @Mutation(() => Category)
  EditCategory(
    @Arg('categoryId', () => ID) categoryId: Category['id'],
    @Arg('category', () => CategoryInput) category: Category
  ) {
    return CategoryService.edit(categoryId, category)
  }
}

export default CategoryResolver
