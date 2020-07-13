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
import { GraphQLUpload } from 'graphql-upload'
import { UploadedFile } from 'express-fileupload'
import CategoryInput from '../inputs/CategoryInput'
import CategoryCreateInput from '../inputs/CategoryCreateInput'
import Category from '../models/ticket/Category'
import CategoryField from '../models/ticket/CategoryField'
import CategoryService from '../services/ticket/CategoryService'
import Group from '../models/ticket/Group'
import Priority from '../models/ticket/Priority'
import Sla from '../models/ticket/Sla'
import Status from '../models/ticket/Status'

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

  @FieldResolver()
  defaultGroup(@Root() category: Category): Promise<Group> {
    return new Promise((resolve, reject) => {
      Category.findOne(category.id, { relations: ['defaultGroup'] }).then(
        category => {
          resolve(category!.defaultGroup)
        }
      )
    })
  }

  @FieldResolver()
  defaultStatus(@Root() category: Category): Promise<Status> {
    return new Promise((resolve, reject) => {
      Category.findOne(category.id, { relations: ['defaultStatus'] }).then(
        category => {
          resolve(category!.defaultStatus)
        }
      )
    })
  }

  @FieldResolver()
  defaultPriority(@Root() category: Category): Promise<Priority> {
    return new Promise((resolve, reject) => {
      Category.findOne(category.id, { relations: ['defaultPriority'] }).then(
        category => {
          resolve(category!.defaultPriority)
        }
      )
    })
  }

  @FieldResolver()
  sla(@Root() category: Category): Promise<Sla> {
    return new Promise((resolve, reject) => {
      Category.findOne(category.id, { relations: ['sla'] }).then(category => {
        resolve(category!.sla)
      })
    })
  }

  @FieldResolver()
  subs(@Root() category: Category): Promise<Category[]> {
    return new Promise((resolve, reject) => {
      Category.findOne(category.id, { relations: ['subs'] }).then(category => {
        resolve(category!.subs)
      })
    })
  }

  @Mutation(() => Category)
  CreateCategory(
    @Arg('category', () => CategoryCreateInput) category: Category
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
