import mongoose, {Types} from 'mongoose'
import Knowledge, {IKnowledge} from '../../models/knowledge/Knowledge'
import KnowledgeFile, { IKnowledgeFile } from '../../models/knowledge/KnowledgeFile'
import Group from '../../models/ticket/Group'
import S3 from '../../../plugins/S3'
import AWS from 'aws-sdk'
import fileUpload from 'express-fileupload'

class KnowledgeService {
  getAll() {
    return new Promise((resolve, reject) => {
      Knowledge.find().exec((err: Error, result) => {
        if (err) return reject(err)
        return resolve(result)
      })
    })
  }
  getOne(id: Types.ObjectId): Promise<IKnowledge> {
    return new Promise((resolve, reject) => {
      Knowledge.findOne({
        _id: id
      }).exec((err: Error, result) => {
        if (err) return reject(err)
        return resolve(result)
      })
    })
  }
  getUnCategorized(): Promise<[IKnowledge]> {
    return new Promise((resolve, reject) => {
      Knowledge.find({
        group: null
      }).exec((err: Error, result: [IKnowledge]) => {
        if (err) return reject(err)
        return resolve(result)
      })
    })
  }
  getByKnowledgeGroup(groupName: string) {
    return new Promise((resolve, reject) => {
      Group.findOne({
        name: groupName
      }).exec((err: Error, result) => {
        if (err) return reject(err)
        Knowledge.find({
          group: result._id
        }).exec((err: Error, result) => {
          if (err) return reject(err)
          return resolve(result)
        })
      })
    })
  }
  create(knowledge: IKnowledge) {
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
        (err: Error, knowledge: IKnowledge) => {
          if (err) return reject(err)
          return resolve(knowledge)
        }
      )
    })
  }
  updateKnowledge(knowledgeId: IKnowledge['_id'], knowledge: IKnowledge): Promise<IKnowledge> {
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
      ).exec((err: Error, result) => {
        if (err) return reject(err)
        return resolve(result)
      })
    })
  }
  addFile(knowledgeId: IKnowledge['_id'], file: fileUpload.UploadedFile) {
    return new Promise((resolve, reject) => {
      Knowledge.findOne({
        _id: knowledgeId
      }).exec((err: Error, knowledge) => {
        if (err) return reject(err)
        KnowledgeFile.create(
          {
            name: file.name
          },
          (err: Error, knowledgeFile: IKnowledgeFile) => {
            if (err) reject(err)
            S3.createBucket(() => {
              const params = {
                Bucket: process.env.BUCKET,
                Key: knowledgeFile._id.toString(),
                Body: file.data
              }
              S3.upload(params, (err: Error, data: AWS.S3.Types.CompleteMultipartUploadOutput) => {
                if (err) return reject(err)
                knowledgeFile.url = data.Location!
                knowledge.files.push(knowledgeFile)
                knowledge.save()
                return resolve(data)
              })
            })
          }
        )
      })
    })
  }
  addTempFile(file: fileUpload.UploadedFile): Promise<string> {
    return new Promise((resolve, reject) => {
      KnowledgeFile.create(
        {
          name: file.name
        },
        (err: Error, knowledgeFile: IKnowledgeFile) => {
          if (err) return reject(err)
          S3.createBucket(() => {
            const params = {
              Bucket: process.env.BUCKET,
              Key: knowledgeFile._id.toString(),
              Body: file.data
            }
            S3.upload(params, (err: Error, data: AWS.S3.Types.CompleteMultipartUploadOutput) => {
              if (err) return reject(err)
              knowledgeFile.url = data.Location!
              knowledgeFile.save()
              return resolve(data.Location)
            })
          })
        }
      )
    })
  }
  getAllFiles(knowledgeId: IKnowledge['_id']): Promise<[IKnowledgeFile]> {
    return new Promise((resolve, reject) => {
      Knowledge.findOne({
        _id: knowledgeId
      }).exec((err: Error, knowledge) => {
        if (err) return reject(err)
        resolve(knowledge.files)
      })
    })
  }
  getFile(id: IKnowledge['_id']) {
    return new Promise((resolve, reject) => {
      S3.getObject(
        {
          Bucket: process.env.BUCKET,
          Key: id.toString()
        },
        (err: Error, file: AWS.S3.Types.GetObjectOutput) => {
          if (err) return reject(err)
          return resolve(file.Body)
        }
      )
    })
  }
  remove(id: IKnowledge['_id']) {
    return new Promise((resolve, reject) => {
      Knowledge.deleteOne({
        _id: id
      }).exec((err: Error) => {
        if (err) return reject(err)
        S3.deleteObject(
          {
            Bucket: process.env.BUCKET,
            Key: id.toString()
          },
          (err: Error, obj: AWS.S3.Types.DeleteObjectOutput) => {
            if (err) return reject(err)
            return resolve(obj)
          }
        )
      })
    })
  }
}

export default new KnowledgeService()
