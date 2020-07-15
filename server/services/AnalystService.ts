import { UploadedFile } from 'express-fileupload'
import AWS from 'aws-sdk'
import Analyst from '../../server/models/Analyst'
import Group from '../models/ticket/Group'
import Sound from '../models/Sound'
import Role from '../models/Role'
import Path from '../models/Path'
import S3 from '~/plugins/S3'

class AnalystService {
  create(analyst: Analyst): Promise<Analyst> {
    return new Promise((resolve, reject) => {
      Analyst.findOne({
        where: {
          email: analyst.email
        }
      }).then(async existing => {
        const role = await Role.findOne({
          name: 'user'
        })
        if (existing)
          return Promise.reject(new Error('User already registered'))

        Analyst.create({
          ...analyst,
          ...role
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
      Analyst.find().then(analysts => {
        resolve(analysts)
      })
    })
  }

  getOne(analystId: Analyst['id']): Promise<Analyst> {
    return new Promise((resolve, reject) => {
      Analyst.findOneOrFail(analystId).then(analyst => {
        resolve(analyst)
      })
    })
  }

  getConfigAnalysts(): Promise<Analyst[]> {
    return new Promise((resolve, reject) => {
      Analyst.find().then(analysts => {
        resolve(analysts)
      })
    })
  }

  updateAnalyst(userId: Analyst['id'], analyst: Analyst): Promise<Analyst> {
    return new Promise((resolve, reject) => [
      Analyst.findOne(userId).then(fromDb => {
        analyst.role = fromDb!.role
        Object.assign(fromDb, analyst)
        fromDb!.save().then(saved => {
          resolve(saved)
        })
      })
    ])
  }

  updateImage(userId: Analyst['id'], file: UploadedFile): Promise<Analyst> {
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
            analyst!.save().then(analyst => {
              resolve(analyst)
            })
          }
        )
      })
    })
  }

  setSoundConfig(analystId: Analyst['id'], config: Sound[]): Promise<Analyst> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(analystId, { relations: ['sounds'] }).then(analyst => {
        Sound.save(config)
        analyst!.sounds.push(...config)
        analyst!.save().then(analyst => {
          resolve(analyst)
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

  removeImage(userId: Analyst['id']): Promise<Analyst> {
    return new Promise((resolve, reject) => {
      S3.deleteObject(
        {
          Bucket: process.env.BUCKET!,
          Key: userId.toString()
        },
        err => {
          if (err) reject(err)
          Analyst.findOne().then(analyst => {
            analyst!.picture = '/user.svg'
            analyst!.save().then(analyst => {
              resolve(analyst)
            })
          })
        }
      )
    })
  }

  remove(userId: Analyst['id']): Promise<void> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(userId, {
        relations: ['groups', 'sounds', 'paths']
      }).then(analyst => {
        analyst!.active = false
        analyst!.contactEmail = ''
        analyst!.groups = []
        this.removeImage(userId)
        analyst!.paths.forEach(path => Path.delete(path.id))
        analyst!.sounds.forEach(sound => Sound.delete(sound.id))
        resolve()
      })
    })
  }
}

export default new AnalystService()
