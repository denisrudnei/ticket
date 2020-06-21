import { UploadedFile } from 'express-fileupload'
import { GetObjectOutput, ManagedUpload } from 'aws-sdk/clients/s3'
import Category from '../../models/ticket/Category'
import S3 from '~/plugins/S3'

class CategoryService {
  create(category: Category): Promise<Category> {
    return new Promise((resolve, reject) => {
      Category.create(category)
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

  getImage(categoryId: Category['id']): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      S3.getObject(
        {
          Bucket: process.env.BUCKET!,
          Key: `category/${categoryId.toString()}`
        },
        (err: Error, file: GetObjectOutput) => {
          if (err) return reject(err)
          if (file === null) return reject(new Error('No image found'))
          return resolve(file.Body as Buffer)
        }
      )
    })
  }

  setImage(categoryId: Category['id'], image: UploadedFile): Promise<string> {
    const params = {
      Bucket: process.env.BUCKET!,
      Key: `category/${categoryId}`,
      Body: image.data
    }
    return new Promise((resolve, reject) => {
      S3.upload(params, (err: Error, data: ManagedUpload.SendData) => {
        if (err) return reject(err)
        resolve(data.Location)
      })
    })
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
