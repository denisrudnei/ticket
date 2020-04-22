import mongoose from 'mongoose'
import fileUpload from 'express-fileupload'
import AWS from 'aws-sdk'
import Analyst, { IAnalyst } from '../../server/models/Analyst'
import { IGroup } from '../models/ticket/Group'
const S3 = require('~/plugins/S3')

class AnalystService {
  async create(analyst: IAnalyst): Promise<IAnalyst> {
    const existing = await Analyst.findOne({
      email: {
        $regex: new RegExp(`^${analyst.email}$`, 'i')
      }
    }).exec()
    if (existing) return Promise.reject(new Error('User already registered'))
    return new Promise((resolve, reject) => {
      Analyst.create(
        {
          _id: new mongoose.Types.ObjectId(),
          ...analyst
        },
        (err: Error, analyst: IAnalyst) => {
          if (err) return reject(err)
          return resolve(analyst)
        }
      )
    })
  }

  getAnalysts(): Promise<[IAnalyst]> {
    return new Promise((resolve, reject) => {
      Analyst.find({}).exec((err: Error, analysts: [IAnalyst]) => {
        if (err) return reject(err)
        return resolve(analysts)
      })
    })
  }

  getOne(analystId: IAnalyst['_id']): Promise<IAnalyst> {
    return new Promise((resolve, reject) => {
      Analyst.findOne({
        _id: analystId
      }).exec((err: Error, analyst) => {
        if (err) return reject(err)
        return resolve(analyst)
      })
    })
  }

  getConfigAnalysts() {
    return new Promise((resolve, reject) => {
      Analyst.find({})
        .select({
          active: 1,
          emailVisible: 1,
          mergePictureWithExternalAccount: 1,
          role: 1,
          color: 1,
          name: 1
        })
        .exec((err: Error, analysts) => {
          if (err) reject(err)
          return resolve(analysts)
        })
    })
  }

  updateAnalyst(userId: IAnalyst['_id'], analyst: IAnalyst): Promise<IAnalyst> {
    return new Promise((resolve, reject) => [
      Analyst.updateOne(
        {
          _id: userId
        },
        {
          $set: {
            name: analyst.name,
            color: analyst.color,
            mergePictureWithExternalAccount:
              analyst.mergePictureWithExternalAccount,
            contactEmail: analyst.contactEmail
          }
        }
      ).exec((err: Error) => {
        if (err) return reject(err)
        return resolve(this.getOne(userId))
      })
    ])
  }

  updateImage(
    userId: IAnalyst['_id'],
    file: fileUpload.UploadedFile
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      S3.createBucket(async () => {
        const name = userId
        const params = {
          Bucket: process.env.BUCKET,
          Key: `analyst/picture/${name}`,
          Body: file.data
        }
        await S3.upload(
          params,
          (err: Error, data: AWS.S3.Types.CompleteMultipartUploadOutput) => {
            if (err) return reject(err)
            Analyst.updateOne(
              {
                _id: userId
              },
              {
                $set: {
                  picture: data.Location
                }
              }
            ).exec((err: Error) => {
              if (err) return reject(err)
              return resolve()
            })
          }
        )
      })
    })
  }

  setSoundConfig(analystId: IAnalyst['_id'], config: any): Promise<void> {
    return Analyst.updateOne(
      {
        _id: analystId
      },
      {
        $set: {
          sounds: {
            chat: {
              muted: config.chat.muted,
              volume: config.chat.volume
            },
            notification: {
              muted: config.notification.muted,
              volume: config.notification.volume
            }
          }
        }
      }
    ).exec()
  }

  getGroups(userId: IAnalyst['_id']): Promise<[IGroup]> {
    return new Promise((resolve, reject) => {
      Analyst.findOne({ _id: userId }).then(analyst => {
        analyst.getGroups((err: Error, result: [IGroup]) => {
          if (err) return reject(err)
          return resolve(result)
        })
      })
    })
  }

  removeImage(userId: IAnalyst['_id']): Promise<void> {
    return new Promise((resolve, reject) => {
      S3.deleteObject(
        {
          Bucket: process.env.BUCKET,
          Key: userId
        },
        () => {
          Analyst.updateOne(
            {
              _id: userId
            },
            {
              $set: {
                picture: '/user.svg'
              }
            }
          ).exec((err: Error) => {
            if (err) return reject(err)
            return resolve()
          })
        }
      )
    })
  }

  remove(userId: IAnalyst['_id']): Promise<void> {
    return new Promise((resolve, reject) => {
      Analyst.deleteOne(
        {
          _id: userId
        },
        (err: Error) => {
          if (err) reject(err)
          return resolve()
        }
      )
    })
  }
}

export default new AnalystService()
