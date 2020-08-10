import { UploadedFile } from 'express-fileupload';
import Category from '../../models/ticket/Category';
import S3 from '~/plugins/S3';

class CategoryService {
  static async create(category: Category): Promise<Category> {
    return Category.create(category).save();
  }

  static async getCategories() {
    return Category.find({ relations: ['subs'] });
  }

  static async getOne(name: string): Promise<Category> {
    const category = await Category.findOne({
      where: {
        name,
      },
      relations: ['subs'],
    });
    if (!category) throw new Error('Category not found');
    return category;
  }

  static async getOneById(categoryId: Category['id']): Promise<Category> {
    const category = await Category.findOne(categoryId, { relations: ['subs'] });
    if (!category) throw new Error('Category not found');
    return category;
  }

  static async edit(
    categoryId: Category['id'],
    categoryToEdit: Category,
  ): Promise<Category> {
    const category = await Category.findOne(categoryId);
    if (!category) throw new Error('Category not found');
    Object.assign(category, categoryToEdit);
    await category.save();
    return CategoryService.getOneById(categoryId);
  }

  static async getImage(categoryId: Category['id']): Promise<AWS.S3.Types.Body> {
    const { Body } = await S3.getObject(
      {
        Bucket: process.env.BUCKET!,
        Key: `category/${categoryId.toString()}`,
      },
    ).promise();
    if (!Body) throw new Error('Image not found');

    return Body;
  }

  static async setImage(categoryId: Category['id'], image: UploadedFile): Promise<string> {
    const params = {
      Bucket: process.env.BUCKET!,
      Key: `category/${categoryId}`,
      Body: image.data,
      ContentType: image.mimetype,
      ACL: 'public-read',
    };

    const { Location } = await S3.upload(params).promise();

    return Location;
  }

  static async getSubsForCategory(id: Category['id']): Promise<Category[]> {
    const { subs } = (await Category.findOne(id, { relations: ['subs'] }) as Category);
    return subs;
  }
}

export default CategoryService;
