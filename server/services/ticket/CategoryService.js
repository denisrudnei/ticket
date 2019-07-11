const mongoose = require('mongoose')
const Category = require('../../models/ticket/Category')

const CategoryService = {
  async create({ name, father = {} }, callback) {
    const category = {
      _id: new mongoose.Types.ObjectId(),
      name: name
    }

    const fatherFromDB = await Category.findOne({ _id: father._id }).exec()

    if (fatherFromDB) {
      category.father = father._id
    }

    Category.create(category, (err, category) => {
      if (err) return callback(err, null)
      if (fatherFromDB !== null) {
        fatherFromDB.subs.push(category)
        fatherFromDB.save()
      }
      return callback(err, category)
    })
  },
  getCategories(callback) {
    Category.find({})
      .populate(['father', 'subs'])
      .exec((err, categories) => {
        return callback(err, categories)
      })
  },
  getOne(name, callback) {
    Category.findOne({ name: name }, (err, result) => {
      return callback(err, result)
    })
  },
  getSubsForCategory(id, callback) {
    Category.findOne({ _id: id }).exec((err, result) => {
      return callback(err, result.subs)
    })
  }
}

module.exports = CategoryService
