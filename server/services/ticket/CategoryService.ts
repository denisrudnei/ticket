import mongoose, { Types } from 'mongoose'
import Category, { ICategory } from '../../models/ticket/Category'
import Field from '../../models/ticket/Field'

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
  create(category: ICategory): Promise<ICategory> {
    return new Promise(async (resolve, reject) => {
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

      Category.create(newCategory, (err: Error, categorySaved: ICategory) => {
        if (err) reject(err)
        if (fatherFromDB !== null) {
          fatherFromDB.subs.push(categorySaved)
          fatherFromDB.save()
        }
        resolve(categorySaved)
      })
    })
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
            defaultPriority: category.defaultPriority
          }
        }
      ).exec((err: Error) => {
        if (err) return reject(err)
        resolve(this.getOneById(categoryId))
      })
    })
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
