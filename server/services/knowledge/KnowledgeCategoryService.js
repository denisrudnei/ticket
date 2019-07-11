const mongoose = require('mongoose')
const KnowledgeCategory = require('../../models/knowledge/KnowledgeCategory')

const KnowledgeCategoryService = {
  getCategories(callback) {
    KnowledgeCategory.find().exec((err, categories) => {
      return callback(err, categories)
    })
  },
  getCategory(id, callback) {
    KnowledgeCategory.findOne({
      _id: id
    }).exec((err, result) => {
      return callback(err, result)
    })
  },
  create(category, callback) {
    const { name, description } = category
    KnowledgeCategory.create(
      {
        _id: new mongoose.Types.ObjectId(),
        name: name,
        description: description
      },
      (err, result) => {
        return callback(err, result)
      }
    )
  }
}

module.exports = KnowledgeCategoryService
