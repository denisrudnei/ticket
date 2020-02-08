import Sla, { ISla } from '@/server/models/ticket/Sla'
import { Types } from 'mongoose'

class SlaService {
  getAll(): Promise<[ISla]> {
    return new Promise((resolve, reject) => {
      Sla.find().exec((err: Error, results: [ISla]) => {
        if (err) return reject(err)
        resolve(results)
      })
    })
  }

  getOne(slaId: ISla['_id']): Promise<ISla> {
    return new Promise((resolve, reject) => {
      Sla.findOne({
        _id: slaId
      }).exec((err: Error, result: ISla) => {
        if (err) reject(err)
        resolve(result)
      })
    })
  }

  create(sla: ISla): Promise<ISla> {
    return new Promise((resolve, reject) => {
      const newSla = new Sla({
        _id: new Types.ObjectId(),
        name: sla.name,
        limit: sla.limit
      })
      Sla.create(newSla, (err: Error) => {
        if (err) return reject(err)
        return resolve(newSla)
      })
    })
  }

  edit(slaId: ISla['_id'], sla: ISla): Promise<ISla> {
    return new Promise((resolve, reject) => {
      Sla.updateOne(
        {
          _id: slaId
        },
        {
          $set: {
            name: sla.name,
            limit: sla.limit
          }
        }
      ).exec((err: Error) => {
        if (err) reject(err)
        resolve(this.getOne(slaId))
      })
    })
  }
}

export default new SlaService()
