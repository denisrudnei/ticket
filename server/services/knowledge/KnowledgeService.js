const mongoose = require('mongoose')
const Knowledge = require('../../models/knowledge/Knowledge')
const Group = require('../../models/ticket/Group')
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
      group: null
    }).exec((err, result) => {
      return callback(err, result)
    })
  },
  getByKnowledgeGroup(groupName, callback) {
    Group.findOne({
      name: groupName
    }).exec((err, result) => {
      if (err) return callback(err, null)
      Knowledge.find({
        group: result._id
      }).exec((err, result) => {
        return callback(err, result)
      })
    })
  },
  create(knowledge, callback) {
    const { name, group, preview, category } = knowledge
    Knowledge.create(
      {
        _id: new mongoose.Types.ObjectId(),
        name: name,
        group: group,
        category: category,
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
  remove(id, callback) {
    Knowledge.deleteOne({
      _id: id
    }).exec(err => {
      if (err) return callback(err, null)
      S3.deleteObject(
        {
          Bucket: process.env.BUCKET,
          Key: id
        },
        (err, obj) => {
          if (err) return callback(err, null)
          return callback(err, obj)
        }
      )
    })
  }
}

module.exports = KnowledgeService
