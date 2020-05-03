import mongoose, { Types } from 'mongoose'
import { UploadedFile } from 'express-fileupload'
import { GetObjectOutput } from 'aws-sdk/clients/s3'
import Category, { ICategory } from '../../models/ticket/Category'
import Field from '../../models/ticket/Field'
import S3 from '~/plugins/S3'

const categoryPopulate = [
  {
    path: 'defaultGroup',
    select: {
      name: 1,
      fullName: 1,
      description: 1,
      analysts: 0
    }
  },
  {
    path: 'defaultStatus',
    select: {
      name: 1
    }
  },
  {
    path: 'defaultPriority',
    select: {
      name: 1,
      weight: 1
    }
  }
]

class CategoryService {
  async create(category: ICategory): Promise<ICategory> {
    const newCategory = {
      _id: new mongoose.Types.ObjectId(),
      name: category.name,
      father: category.father,
      fields: category.fields || []
    }
    let fatherFromDB: ICategory | null = null

    if (newCategory.father) {
      fatherFromDB = await Category.findOne({
        _id: newCategory.father._id
      }).exec()
    }

    if (fatherFromDB) {
      category.father = newCategory.father._id
    }

    for (let i = 0; i < newCategory.fields.length; i++) {
      newCategory.fields[i] = {
        _id: new mongoose.Types.ObjectId(),
        ...newCategory.fields[i]
      }
      newCategory.fields[i] = await Field.create(newCategory.fields[i])
    }

    const categorySaved = Category.create(newCategory)
    if (fatherFromDB !== null) {
      fatherFromDB.subs.push(categorySaved)
      fatherFromDB.save()
    }
    return categorySaved
  }

  getCategories() {
    return new Promise((resolve, reject) => {
      Category.find({})
        .populate(categoryPopulate)
        .exec((err: Error, categories) => {
          if (err) return reject(err)
          return resolve(categories)
        })
    })
  }

  getOne(name: string): Promise<ICategory> {
    return new Promise((resolve, reject) => {
      Category.findOne({ name: name })
        .populate([
          {
            path: 'defaultGroup',
            select: {
              name: 1,
              fullName: 1,
              description: 1,
              analysts: 0
            }
          },
          {
            path: 'defaultStatus',
            select: {
              name: 1
            }
          },
          {
            path: 'defaultPriority',
            select: {
              name: 1,
              weight: 1
            }
          }
        ])
        .exec((err: Error, result) => {
          if (err) return reject(err)
          return resolve(result)
        })
    })
  }

  getOneById(categoryId: ICategory['_id']): Promise<ICategory> {
    return new Promise((resolve, reject) => {
      Category.findOne({ _id: categoryId })
        .populate(categoryPopulate)
        .exec((err: Error, result: ICategory) => {
          if (err) return reject(err)
          return resolve(result)
        })
    })
  }

  edit(categoryId: ICategory['_id'], category: ICategory): Promise<ICategory> {
    return new Promise((resolve, reject) => {
      Category.updateOne(
        { _id: categoryId },
        {
          $set: {
            name: category.name,
            father: category.father,
            description: category.description,
            defaultGroup: category.defaultGroup,
            defaultStatus: category.defaultStatus,
            defaultPriority: category.defaultPriority,
            sla: category.sla
          }
        }
      ).exec((err: Error) => {
        if (err) return reject(err)
        resolve(this.getOneById(categoryId))
      })
    })
  }

  getImage(categoryId: ICategory['_id']): Promise<GetObjectOutput> {
    return new Promise((resolve, reject) => {
      S3.getObject(
        {
          Bucket: process.env.BUCKET,
          Key: `category/${categoryId.toString()}`
        },
        (err: Error, file: GetObjectOutput) => {
          if (err) return reject(err)
          return resolve(file)
        }
      )
    })
  }

  async setImage(
    categoryId: ICategory['_id'],
    image: UploadedFile
  ): Promise<void> {
    const params = {
      Bucket: process.env.BUCKET,
      Key: `category/${categoryId}`,
      Body: image.data
    }
    await S3.upload(params).promise()
  }

  getSubsForCategory(id: Types.ObjectId): Promise<[ICategory]> {
    return new Promise((resolve, reject) => {
      Category.findOne({ _id: id }).exec((err: Error, result) => {
        if (err) return reject(err)
        return resolve(result.subs)
      })
    })
  }
}

export default new CategoryService()
