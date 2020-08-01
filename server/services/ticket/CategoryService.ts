import { UploadedFile } from 'express-fileupload';
import { GetObjectOutput } from 'aws-sdk/clients/s3';
import Category from '../../models/ticket/Category';
import S3 from '~/plugins/S3';

class CategoryService {
  static create(category: Category): Promise<Category> {
    return new Promise((resolve, reject) => {
      Category.create(category)
        .save()
        .then((categorySaved) => {
          resolve(categorySaved);
        });
    });
  }

  static getCategories() {
    return new Promise((resolve, reject) => {
      Category.find({ relations: ['subs'] }).then((categories) => resolve(categories));
    });
  }

  static getOne(name: string): Promise<Category> {
    return new Promise((resolve, reject) => {
      Category.findOne({
        where: {
          name,
        },
        relations: ['subs'],
      }).then((result) => {
        resolve(result);
      });
    });
  }

  static getOneById(categoryId: Category['id']): Promise<Category> {
    return new Promise((resolve, reject) => {
      Category.findOne(categoryId, { relations: ['subs'] }).then((result) => resolve(result));
    });
  }

  static edit(
    categoryId: Category['id'],
    categoryToEdit: Category,
  ): Promise<Category> {
    return new Promise((resolve, reject) => {
      Category.findOne(categoryId).then((category) => {
        Object.assign(category, categoryToEdit);
        category!.save().then(() => {
          resolve(CategoryService.getOneById(categoryId));
        });
      });
    });
  }

  static getImage(categoryId: Category['id']): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      S3.getObject(
        {
          Bucket: process.env.BUCKET!,
          Key: `category/${categoryId.toString()}`,
        },
        (err: Error, file: GetObjectOutput) => {
          if (err) return reject(err);
          if (file === null) return reject(new Error('No image found'));
          return resolve(file.Body as Buffer);
        },
      );
    });
  }

  static async setImage(categoryId: Category['id'], image: UploadedFile): Promise<string> {
    const params = {
      Bucket: process.env.BUCKET!,
      Key: `category/${categoryId}`,
      Body: image.data,
    };

    const { Location } = await S3.upload(params).promise();

    return Location;
  }

  static getSubsForCategory(id: Category['id']): Promise<Category[]> {
    return new Promise((resolve, reject) => {
      Category.findOne(id, { relations: ['subs'] }).then((result) => resolve(result!.subs));
    });
  }
}

export default CategoryService;
