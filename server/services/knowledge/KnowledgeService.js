const mongoose = require('mongoose')
const Knowledge = require('../../models/knowledge/Knowledge')
const Group = require('../../models/ticket/Group')
const S3 = require('../../../plugins/S3')
const KnowledgeService = {
  getAll() {
    return new Promise((resolve, reject) => {
      Knowledge.find().exec((err, result) => {
        if (err) return reject(err)
        return resolve(result)
      })
    })
  },
  getOne(id) {
    return new Promise((resolve, reject) => {
      Knowledge.findOne({
        _id: id
      }).exec((err, result) => {
        if (err) return reject(err)
        return resolve(result)
      })
    })
  },
  getUncategorized() {
    return new Promise((resolve, reject) => {
      Knowledge.find({
        group: null
      }).exec((err, result) => {
        if (err) return reject(err)
        return resolve(result)
      })
    })
  },
  getByKnowledgeGroup(groupName) {
    return new Promise((resolve, reject) => {
      Group.findOne({
        name: groupName
      }).exec((err, result) => {
        if (err) return reject(err)
        Knowledge.find({
          group: result._id
        }).exec((err, result) => {
          if (err) return reject(err)
          return resolve(result)
        })
      })
    })
  },
  create(knowledge) {
    return new Promise((resolve, reject) => {
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
          if (err) return reject(err)
          return resolve(err, knowledge)
        }
      )
    })
  },
  updateKnowledge(knowledgeId, knowledge) {
    return new Promise((resolve, reject) => {
      Knowledge.updateOne(
        {
          _id: knowledgeId
        },
        {
          $set: {
            name: knowledge.name,
            category: knowledge.category,
            grou: knowledge.group,
            preview: knowledge.preview
          }
        }
      ).exec((err, result) => {
        if (err) return reject(err)
        return resolve(result)
      })
    })
  },
  addFile(id, file) {
    return new Promise((resolve, reject) => {
      Knowledge.findOne({
        _id: id
      }).exec((err, knowledge) => {
        if (err) return reject(err)
        S3.createBucket(() => {
          const params = {
            Bucket: process.env.BUCKET,
            Key: id,
            Body: file.data
          }
          S3.upload(params, (err, data) => {
            if (err) return reject(err)
            knowledge.url = data.Location
            knowledge.save()
            return resolve(data)
          })
        })
      })
    })
  },
  getFile(id) {
    return new Promise((resolve, reject) => {
      S3.getObject(
        {
          Bucket: process.env.BUCKET,
          Key: id
        },
        (err, file) => {
          if (err) return reject(err)
          return resolve(file.Body)
        }
      )
    })
  },
  remove(id) {
    return new Promise((resolve, reject) => {
      Knowledge.deleteOne({
        _id: id
      }).exec(err => {
        if (err) return reject(err)
        S3.deleteObject(
          {
            Bucket: process.env.BUCKET,
            Key: id
          },
          (err, obj) => {
            if (err) return reject(err)
            return resolve(obj)
          }
        )
      })
    })
  }
}

module.exports = KnowledgeService
