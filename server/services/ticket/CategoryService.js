const mongoose = require('mongoose')
const Category = require('../../models/ticket/Category')

const CategoryService = {
  create(name, father) {
    return new Promise(async (resolve, reject) => {
      const category = {
        _id: new mongoose.Types.ObjectId(),
        name: name
      }
      let fatherFromDB = null

      if (father) {
        fatherFromDB = await Category.findOne({ _id: father._id }).exec()
      }
      if (fatherFromDB) {
        category.father = father._id
      }

      Category.create(category, (err, category) => {
        if (err) reject(err)
        if (fatherFromDB !== null) {
          fatherFromDB.subs.push(category)
          fatherFromDB.save()
        }
        resolve(category)
      })
    })
  },
  getCategories() {
    return new Promise((resolve, reject) => {
      Category.find({})
        .populate(['father', 'subs'])
        .exec((err, categories) => {
          if (err) return reject(err)
          return resolve(categories)
        })
    })
  },
  getOne(name) {
    return new Promise((resolve, reject) => {
      Category.findOne({ name: name }, (err, result) => {
        if (err) return reject(err)
        return resolve(result)
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
