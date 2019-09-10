const mongoose = require('mongoose')
const Category = require('../../models/ticket/Category')
const Field = require('../../models/ticket/Field')

const CategoryService = {
  create(category) {
    return new Promise(async (resolve, reject) => {
      const newCategory = {
        _id: new mongoose.Types.ObjectId(),
        name: category.name,
        father: category.father,
        fields: category.fields || []
      }
      let fatherFromDB = null

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

      Category.create(newCategory, (err, categorySaved) => {
        if (err) reject(err)
        if (fatherFromDB !== null) {
          fatherFromDB.subs.push(categorySaved)
          fatherFromDB.save()
        }
        resolve(categorySaved)
      })
    })
  },
  getCategories() {
    return new Promise((resolve, reject) => {
      Category.find({})
        .populate([
          {
            path: 'father',
            select: {
              fullName: 1,
              name: 1,
              description: 1,
              subs: 0
            }
          },
          {
            path: 'subs',
            select: {
              name: 1,
              fullName: 1,
              father: 0
            }
          },
          {
            path: 'defaultGroup',
            select: {
              name: 1,
              analysts: 0
            }
          }
        ])
        .exec((err, categories) => {
          if (err) return reject(err)
          return resolve(categories)
        })
    })
  },
  getOne(name) {
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
          }
        ])
        .exec((err, result) => {
          if (err) return reject(err)
          return resolve(result)
        })
    })
  },
  edit(categoryId, category) {
    return new Promise((resolve, reject) => {
      Category.updateOne(
        { _id: categoryId },
        {
          $set: {
            name: category.name,
            father: category.father,
            description: category.description,
            defaultGroup: category.defaultGroup
          }
        }
      ).exec(err => {
        if (err) return reject(err)
        return resolve()
      })
    })
  },
  getSubsForCategory(id) {
    return new Promise((resolve, reject) => {
      Category.findOne({ _id: id }).exec((err, result) => {
        if (err) return reject(err)
        return resolve(result.subs)
      })
    })
  }
}

module.exports = CategoryService
