import { UploadedFile } from 'express-fileupload'
import { GetObjectOutput } from 'aws-sdk/clients/s3'
import Category from '../../models/ticket/Category'
import S3 from '~/plugins/S3'

class CategoryService {
  create(category: Category): Promise<Category> {
    return new Promise((resolve, reject) => {
      const newCategory = Category.create(category)

      Category.create(newCategory)
        .save()
        .then(categorySaved => {
          resolve(categorySaved)
        })
    })
  }

  getCategories() {
    return new Promise((resolve, reject) => {
      Category.find({ relations: ['subs'] }).then(categories => {
        return resolve(categories)
      })
    })
  }

  getOne(name: string): Promise<Category> {
    return new Promise((resolve, reject) => {
      Category.findOne({
        where: {
          name
        },
        relations: ['subs']
      }).then(result => {
        resolve(result)
      })
    })
  }

  getOneById(categoryId: Category['id']): Promise<Category> {
    return new Promise((resolve, reject) => {
      Category.findOne(categoryId, { relations: ['subs'] }).then(result => {
        return resolve(result)
      })
    })
  }

  edit(
    categoryId: Category['id'],
    categoryToEdit: Category
  ): Promise<Category> {
    return new Promise((resolve, reject) => {
      Category.findOne(categoryId).then(category => {
        Object.assign(category, categoryToEdit)
        category!.save().then(() => {
          resolve(this.getOneById(categoryId))
        })
      })
    })
  }

  getImage(categoryId: Category['id']): Promise<GetObjectOutput> {
    return new Promise((resolve, reject) => {
      S3.getObject(
        {
          Bucket: process.env.BUCKET!,
          Key: `category/${categoryId.toString()}`
        },
        (err: Error, file: GetObjectOutput) => {
          if (err) reject(err)
          return resolve(file)
        }
      )
    })
  }

  async setImage(
    categoryId: Category['id'],
    image: UploadedFile
  ): Promise<void> {
    const params = {
      Bucket: process.env.BUCKET!,
      Key: `category/${categoryId}`,
      Body: image.data
    }
    await S3.upload(params).promise()
  }

  getSubsForCategory(id: Category['id']): Promise<Category[]> {
    return new Promise((resolve, reject) => {
      Category.findOne(id, { relations: ['subs'] }).then(result => {
        return resolve(result!.subs)
      })
    })
  }
}

export default new CategoryService()
