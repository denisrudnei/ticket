const mongoose = require('mongoose')
const Knowledge = require('../../models/knowledge/Knowledge')
const KnowledgeFile = require('../../models/knowledge/KnowledgeFile')
const Group = require('../../models/ticket/Group')
const S3 = require('../../../plugins/S3')
const pdf = require('html-pdf')
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
  getUnCategorized() {
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
      const id = new mongoose.Types.ObjectId()
      Knowledge.create(
        {
          _id: id,
          name: name,
          group: group,
          category: category,
          preview: preview
        },
        (err, knowledge) => {
          if (err) return reject(err)
          this.setPreviewInPDF(id, name)
          return resolve(knowledge)
        }
      )
    })
  },
  setPreviewInPDF(knowledgeId, name) {
    return new Promise((resolve, reject) => {
      this.generatePDF(knowledgeId).then(response => {
        this.uploadPDF(name, response).then(link => {
          Knowledge.updateOne(
            {
              _id: knowledgeId
            },
            {
              $set: {
                url: link
              }
            }
          ).exec(err => {
            if (err) return reject(err)
            return resolve()
          })
        })
      })
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
            group: knowledge.group,
            preview: knowledge.preview
          }
        }
      ).exec((err, result) => {
        if (err) return reject(err)
        this.setPreviewInPDF(knowledgeId, knowledge.name)
        return resolve(result)
      })
    })
  },
  addFile(knowledgeId, file) {
    return new Promise((resolve, reject) => {
      Knowledge.findOne({
        _id: knowledgeId
      }).exec((err, knowledge) => {
        if (err) return reject(err)
        KnowledgeFile.create(
          {
            name: file.name
          },
          (err, knowledgeFile) => {
            if (err) reject(err)
            S3.createBucket(() => {
              const params = {
                Bucket: process.env.BUCKET,
                Key: `knowledge/${knowledgeId}/${knowledgeFile._id.toString()}`,
                Body: file.data
              }
              S3.upload(params, (err, data) => {
                if (err) return reject(err)
                knowledgeFile.url = data.Location
                knowledge.files.push(knowledgeFile)
                knowledge.save()
                return resolve(data)
              })
            })
          }
        )
      })
    })
  },
  addTempFile(file) {
    return new Promise((resolve, reject) => {
      KnowledgeFile.create(
        {
          name: file.name
        },
        (err, knowledgeFile) => {
          if (err) return reject(err)
          S3.createBucket(() => {
            const params = {
              Bucket: process.env.BUCKET,
              Key: `knowledge/temp/${knowledgeFile._id.toString()}`,
              Body: file.data
            }
            S3.upload(params, (err, data) => {
              if (err) return reject(err)
              knowledgeFile.url = data.Location
              knowledgeFile.save()
              return resolve(`/api/knowledge/${knowledgeFile._id}/file`)
            })
          })
        }
      )
    })
  },
  getAllFiles(knowledgeId) {
    return new Promise((resolve, reject) => {
      Knowledge.findOne({
        _id: knowledgeId
      }).exec((err, knowledge) => {
        if (err) return reject(err)
        resolve(knowledge.files)
      })
    })
  },
  getFile(id) {
    return new Promise((resolve, reject) => {
      S3.getObject(
        {
          Bucket: process.env.BUCKET,
          Key: id.toString()
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
            Key: id.toString()
          },
          (err, obj) => {
            if (err) return reject(err)
            return resolve(obj)
          }
        )
      })
    })
  },
  uploadPDF(name, body) {
    return new Promise((resolve, reject) => {
      S3.createBucket(() => {
        const params = {
          Bucket: process.env.BUCKET,
          Key: `knowledge/pdf/${name}.pdf`,
          Body: body
        }
        S3.upload(params, (err, data) => {
          if (err) return reject(err)
          return resolve(data.Location)
        })
      })
    })
  },
  generatePDF(knowledgeId) {
    return new Promise((resolve, reject) => {
      this.getOne(knowledgeId).then(knowledge => {
        pdf
          .create(knowledge.preview, {
            format: 'A4'
          })
          .toBuffer((err, result) => {
            if (err) return reject(err)
            return resolve(result)
          })
      })
    })
  }
}

module.exports = KnowledgeService
