/* eslint-disable class-methods-use-this */
import { UploadedFile } from 'express-fileupload';
import { GraphQLUpload } from 'graphql-upload';
import {
  Arg, Authorized, FieldResolver, ID, Mutation, Query, Resolver, Root,
} from 'type-graphql';

import CategoryCreateInput from '../inputs/CategoryCreateInput';
import CategoryInput from '../inputs/CategoryInput';
import Category from '../models/ticket/Category';
import CategoryField from '../models/ticket/CategoryField';
import Group from '../models/ticket/Group';
import Priority from '../models/ticket/Priority';
import Sla from '../models/ticket/Sla';
import Status from '../models/ticket/Status';
import CategoryService from '../services/ticket/CategoryService';

@Resolver((of) => Category)
class CategoryResolver {
  @Query(() => [Category])
  @Authorized('user')
  Category() {
    return CategoryService.getCategories();
  }

  @Query(() => Category)
  @Authorized('user')
  CategoryByName(@Arg('name', () => String) name: Category['name']) {
    return CategoryService.getOne(name);
  }

  @Query(() => String)
  @Authorized('user')
  GetCategoryImage(@Arg('id', () => ID) id: Category['id']): Promise<AWS.S3.Types.Body> {
    return CategoryService.getImage(id);
  }

  @Mutation(() => String)
  @Authorized('user')
  SetCategoryImage(
    @Arg('id', () => ID) id: Category['id'],
    @Arg('file', () => GraphQLUpload) file: UploadedFile,
  ): Promise<string> {
    return CategoryService.setImage(id, file);
  }

  @Query(() => [Category])
  @Authorized('user')
  GetSubs(@Arg('categoryId', () => ID) categoryId: Category['id']) {
    return CategoryService.getSubsForCategory(categoryId);
  }

  @FieldResolver()
  async fields(@Root() category: Category): Promise<CategoryField[]> {
    const { fields } = (await Category.findOne(category.id, { relations: ['fields'] }) as Category);
    return fields;
  }

  @FieldResolver()
  async defaultGroup(@Root() category: Category): Promise<Group> {
    const { defaultGroup } = (await Category.findOne(category.id, { relations: ['defaultGroup'] }) as Category);
    return defaultGroup;
  }

  @FieldResolver()
  async defaultStatus(@Root() category: Category): Promise<Status> {
    const { defaultStatus } = (await Category.findOne(category.id, { relations: ['defaultStatus'] }) as Category);
    return defaultStatus;
  }

  @FieldResolver()
  async defaultPriority(@Root() category: Category): Promise<Priority> {
    const { defaultPriority } = (await Category.findOne(category.id, { relations: ['defaultPriority'] }) as Category);
    return defaultPriority;
  }

  @FieldResolver()
  async sla(@Root() category: Category): Promise<Sla> {
    const { sla } = (await Category.findOne(category.id, { relations: ['sla'] }) as Category);
    return sla;
  }

  @FieldResolver()
  async subs(@Root() category: Category): Promise<Category[]> {
    const { subs } = (await Category.findOne(category.id, { relations: ['subs'] }) as Category);
    return subs;
  }

  @FieldResolver()
  async file(@Root() category: Category): Promise<Category['file']> {
    const { file } = (await Category.findOne(category.id, { relations: ['file'] }) as Category);
    return file;
  }

  @Mutation(() => Category)
  CreateCategory(
    @Arg('category', () => CategoryCreateInput) category: Category,
  ) {
    return CategoryService.create(category);
  }

  @Mutation(() => Category)
  EditCategory(
    @Arg('categoryId', () => ID) categoryId: Category['id'],
    @Arg('category', () => CategoryInput) category: Category,
  ) {
    return CategoryService.edit(categoryId, category);
  }
}

export default CategoryResolver;
