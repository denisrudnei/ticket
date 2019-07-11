const mongoose = require('mongoose')
const Knowledge = require('../../models/knowledge/Knowledge')
const knowledgeCategory = require('../../models/knowledge/KnowledgeCategory')
const S3 = require('../../../plugins/S3')
const KnowledgeService = {
  getAll(callback) {
    Knowledge.find().exec((err, result) => {
      return callback(err, result)
    })
  },
  getOne(id, callback) {
    Knowledge.findOne({
      _id: id
    }).exec((err, result) => {
      return callback(err, result)
    })
  },
  getUncategorized(callback) {
    Knowledge.find({
      category: null
    }).exec((err, result) => {
      return callback(err, result)
    })
  },
  getByKnowledgeCategory(categoryName, callback) {
    knowledgeCategory
      .findOne({
        name: categoryName
      })
      .exec((err, result) => {
        if (err) return callback(err, null)
        Knowledge.find({
          knowledgeCategory: result._id
        }).exec((err, result) => {
          return callback(err, result)
        })
      })
  },
  create(knowledge, callback) {
    const { name, category, preview, knowledgeCategory } = knowledge
    Knowledge.create(
      {
        _id: new mongoose.Types.ObjectId(),
        name: name,
        category: category,
        knowledgeCategory: knowledgeCategory,
        preview: preview
      },
      (err, knowledge) => {
        return callback(err, knowledge)
      }
    )
  },
  addFile(id, file, callback) {
    Knowledge.findOne({
      _id: id
    }).exec((err, knowledge) => {
      if (err) return callback(err, null)
      S3.createBucket(() => {
        const params = {
          Bucket: process.env.BUCKET,
          Key: id,
          Body: file.data
        }
        S3.upload(params, (err, data) => {
          if (err) return callback(err, data)
          knowledge.url = data.Location
          knowledge.save()
          return callback(err, data)
        })
      })
    })
  },
  getFile(id, callback) {
    S3.getObject(
      {
        Bucket: process.env.BUCKET,
        Key: id
      },
      (err, file) => {
        if (err) return callback(err, null)
        return callback(err, file.Body)
      }
    )
  },
  delete(id, callback) {
    // TODO
  }
}

module.exports = KnowledgeService
