import { UploadedFile } from 'express-fileupload'
import AWS from 'aws-sdk'
import Analyst from '../../server/models/Analyst'
import Group from '../models/ticket/Group'
import Sound from '../models/Sound'
import S3 from '~/plugins/S3'

class AnalystService {
  create(analyst: Analyst): Promise<Analyst> {
    return new Promise((resolve, reject) => {
      Analyst.findOne({
        where: {
          email: analyst.email
        }
      }).then(existing => {
        if (existing)
          return Promise.reject(new Error('User already registered'))

        Analyst.create({
          ...analyst
        })
          .save()
          .then((analyst: Analyst) => {
            resolve(analyst)
          })
      })
    })
  }

  getAnalysts(): Promise<Analyst[]> {
    return new Promise((resolve, reject) => {
      Analyst.find().then((analysts: Analyst[]) => {
        resolve(analysts)
      })
    })
  }

  getOne(analystId: Analyst['id']): Promise<Analyst> {
    return new Promise((resolve, reject) => {
      Analyst.findOneOrFail(analystId).then((analyst: Analyst) => {
        resolve(analyst)
      })
    })
  }

  getConfigAnalysts(): Promise<Analyst[]> {
    return new Promise((resolve, reject) => {
      Analyst.find().then((analysts: Analyst[]) => {
        resolve(analysts)
      })
    })
  }

  updateAnalyst(userId: Analyst['id'], analyst: Analyst): Promise<Analyst> {
    return new Promise((resolve, reject) => [
      Analyst.findOne(userId).then(fromDb => {
        fromDb!.name = analyst.name
        fromDb!.color = analyst.color
        fromDb!.mergePictureWithExternalAccount =
          analyst.mergePictureWithExternalAccount
        fromDb!.contactEmail = analyst.contactEmail
        fromDb!.save().then(() => {
          resolve(this.getOne(userId))
        })
      })
    ])
  }

  updateImage(userId: Analyst['id'], file: UploadedFile): Promise<void> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(userId).then(analyst => {
        const name = userId
        const params = {
          Bucket: process.env.BUCKET!,
          Key: `analyst/picture/${name}`,
          Body: file.data
        }
        S3.upload(
          params,
          (err: Error, data: AWS.S3.Types.CompleteMultipartUploadOutput) => {
            if (err) reject(err)
            analyst!.picture = data.Location!
            analyst!.save().then(() => {
              resolve()
            })
          }
        )
      })
    })
  }

  setSoundConfig(analystId: Analyst['id'], config: Sound[]): Promise<void> {
    return new Promise((resolve, reject) => {
      // TODO
      Analyst.findOne(analystId, { relations: ['sounds'] }).then(analyst => {
        analyst!.sounds.push(...config)
        analyst!.save().then(() => {
          resolve()
        })
      })
    })
  }

  getGroups(userId: Analyst['id']): Promise<Group[]> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(userId).then(analyst => {
        analyst!.getGroups().then((result: Group[]) => {
          resolve(result)
        })
      })
    })
  }

  removeImage(userId: Analyst['id']): Promise<void> {
    return new Promise((resolve, reject) => {
      S3.deleteObject(
        {
          Bucket: process.env.BUCKET!,
          Key: userId.toString()
        },
        () => {
          Analyst.findOne().then(analyst => {
            analyst!.picture = '/user.svg'
            analyst!.save().then(() => {
              resolve()
            })
          })
        }
      )
    })
  }

  remove(userId: Analyst['id']): Promise<void> {
    return new Promise((resolve, reject) => {
      Analyst.delete(userId).then(() => {
        resolve()
      })
    })
  }
}

export default new AnalystService()
