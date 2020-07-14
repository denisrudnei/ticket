import AWS from 'aws-sdk'
import fileUpload from 'express-fileupload'
import pdf from 'html-pdf'
import Group from '../../models/ticket/Group'
import Knowledge from '~/server/models/knowledge/Knowledge'
import KnowledgeFile from '~/server/models/knowledge/KnowledgeFile'
import S3 from '~/plugins/S3'
import '~/server/models/knowledge/KnowledgeStatus'

class KnowledgeService {
  getAll(): Promise<Knowledge[]> {
    return new Promise((resolve, reject) => {
      Knowledge.find({ relations: ['category', 'group'] }).then(result => {
        return resolve(result)
      })
    })
  }

  getOne(id: Knowledge['id']): Promise<Knowledge> {
    return new Promise((resolve, reject) => {
      Knowledge.findOne(id, { relations: ['files', 'category', 'group'] }).then(
        result => {
          return resolve(result)
        }
      )
    })
  }

  getUnCategorized(): Promise<Knowledge[]> {
    return new Promise((resolve, reject) => {
      Knowledge.find({
        group: undefined
      }).then((result: Knowledge[]) => {
        return resolve(result)
      })
    })
  }

  getByKnowledgeGroup(groupName: string): Promise<Knowledge[]> {
    return new Promise((resolve, reject) => {
      Group.findOne({
        name: groupName
      }).then(result => {
        Knowledge.find({
          where: {
            group: {
              id: result!.id
            }
          },
          relations: ['group']
        }).then((result: Knowledge[]) => {
          return resolve(result)
        })
      })
    })
  }

  create(knowledge: Knowledge): Promise<Knowledge> {
    return new Promise((resolve, reject) => {
      const { name, group, description, category, status } = knowledge
      Knowledge.create({
        name,
        status,
        group,
        category,
        description
      })
        .save()
        .then((knowledge: Knowledge) => {
          this.setPreviewInPDF(knowledge.id, name)
          return resolve(knowledge)
        })
    })
  }

  setPreviewInPDF(knowledgeId: Knowledge['id'], name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const key = `knowledge/pdf/${name}.pdf`
      this.generatePDF(knowledgeId).then(response => {
        this.uploadPDF(key, response).then(link => {
          Knowledge.findOne(knowledgeId).then(knowledge => {
            knowledge!.url = link
            knowledge!.key = key
            knowledge!.save().then(() => {
              resolve()
            })
          })
        })
      })
    })
  }

  updateKnowledge(
    knowledgeId: Knowledge['id'],
    knowledgeToEdit: Knowledge
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      Knowledge.findOne(knowledgeId).then(knowledge => {
        Object.assign(knowledge, knowledgeToEdit)
        knowledge!.save().then(() => {
          this.setPreviewInPDF(knowledgeId, knowledge!.name)
          return resolve()
        })
      })
    })
  }

  addFile(knowledgeId: Knowledge['id'], file: fileUpload.UploadedFile) {
    return new Promise((resolve, reject) => {
      Knowledge.findOne(knowledgeId).then(knowledge => {
        S3.createBucket(() => {
          const name = `knowledge/${knowledgeId}/${file.name}`
          const params = {
            Bucket: process.env.BUCKET!,
            Key: name,
            Body: file.data
          }
          S3.upload(
            params,
            (err: Error, data: AWS.S3.Types.CompleteMultipartUploadOutput) => {
              if (err) reject(err)
              KnowledgeFile.create({
                name,
                url: data.Location!
              })
                .save()
                .then(knowledgeFile => {
                  if (!knowledge!.files) knowledge!.files = []
                  knowledge!.files.push(knowledgeFile)
                  knowledgeFile.save()
                  knowledge!.save()
                  return resolve(data)
                })
            }
          )
        })
      })
    })
  }

  addTempFile(file: fileUpload.UploadedFile): Promise<string> {
    return new Promise((resolve, reject) => {
      S3.createBucket(() => {
        const name = `knowledge/temp/${file.name}`
        const params = {
          Bucket: process.env.BUCKET!,
          Key: name,
          Body: file.data
        }
        S3.upload(
          params,
          (err: Error, data: AWS.S3.Types.CompleteMultipartUploadOutput) => {
            if (err) reject(err)
            KnowledgeFile.create({
              name,
              url: data.Location!
            })
              .save()
              .then((knowledgeFile: KnowledgeFile) => {
                knowledgeFile.save()
                return resolve(`/api/knowledge/${knowledgeFile.id}/file`)
              })
          }
        )
      })
    })
  }

  getAllFiles(knowledgeId: Knowledge['id']): Promise<KnowledgeFile[]> {
    return new Promise((resolve, reject) => {
      Knowledge.findOne(knowledgeId, { relations: ['files'] }).then(
        knowledge => {
          resolve(knowledge!.files)
        }
      )
    })
  }

  getFile(id: KnowledgeFile['id']): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      KnowledgeFile.findOne(id).then(knowledgeFile => {
        S3.getObject(
          {
            Bucket: process.env.BUCKET!,
            Key: knowledgeFile!.name
          },
          (err: Error, file: AWS.S3.Types.GetObjectOutput) => {
            if (err) reject(err)
            return resolve(file.Body as Buffer)
          }
        )
      })
    })
  }

  remove(id: Knowledge['id']): Promise<boolean> {
    return new Promise((resolve, reject) => {
      Knowledge.findOne(id, { relations: ['files'] }).then(knowledge => {
        const deleteFilesFromKnowledge = knowledge!.files.map(file => {
          S3.deleteObject(
            {
              Bucket: process.env.BUCKET!,
              Key: file.name
            },
            (err: Error) => {
              if (err) reject(err)
            }
          )
          return KnowledgeFile.delete(file.id)
        })
        Promise.all(deleteFilesFromKnowledge).then(() => {
          Knowledge.delete(knowledge!.id).then(() => {
            if (!knowledge!.key) resolve()
            S3.deleteObject(
              {
                Bucket: process.env.BUCKET!,
                Key: knowledge!.key
              },
              (err: Error) => {
                if (err) reject(err)
                return resolve(true)
              }
            )
          })
        })
      })
    })
  }

  uploadPDF(name: string, body: any): Promise<string> {
    return new Promise((resolve, reject) => {
      S3.createBucket(() => {
        const params = {
          Bucket: process.env.BUCKET!,
          Key: name,
          Body: body
        }
        S3.upload(
          params,
          (err: Error, data: AWS.S3.Types.CompleteMultipartUploadOutput) => {
            if (err) reject(err)
            return resolve(data.Location)
          }
        )
      })
    })
  }

  generatePDF(knowledgeId: Knowledge['id']): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      this.getOne(knowledgeId).then(knowledge => {
        pdf
          .create(knowledge.preview, {
            format: 'A4'
          })
          .toBuffer((err: Error, result) => {
            if (err) reject(err)
            return resolve(result)
          })
      })
    })
  }
}

export default new KnowledgeService()
