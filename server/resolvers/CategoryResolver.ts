import {
  Arg,
  Authorized,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root
} from 'type-graphql'
import { ManagedUpload } from 'aws-sdk/clients/s3'
import { GraphQLUpload } from 'graphql-upload'
import { UploadedFile } from 'express-fileupload'
import CategoryInput from '../inputs/CategoryInput'
import Category from '../models/ticket/Category'
import CategoryField from '../models/ticket/CategoryField'
import CategoryService from '../services/ticket/CategoryService'

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

  @Query(() => String)
  @Authorized('user')
  GetCategoryImage(@Arg('id', () => ID) id: Category['id']): Promise<Buffer> {
    return CategoryService.getImage(id)
  }

  @Mutation(() => String)
  @Authorized('user')
  SetCategoryImage(
    @Arg('id', () => ID) id: Category['id'],
    @Arg('file', () => GraphQLUpload) file: UploadedFile
  ): Promise<string> {
    return CategoryService.setImage(id, file)
  }

  @Mutation(() => String)
  @Query(() => [Category])
  @Authorized('user')
  GetSubs(@Arg('categoryId', () => ID) categoryId: Category['id']) {
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
  CreateCategory(@Arg('category', () => CategoryInput) category: Category) {
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
