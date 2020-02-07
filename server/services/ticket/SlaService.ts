import Sla, { ISla } from '@/server/models/ticket/Sla'
import { Types } from 'mongoose'

class SlaService {
  getAll(): Promise<[ISla]> {
    return new Promise((resolve, reject) => {
      Sla.find().exec((err: Error, results: [ISla]) => {
        console.log(results)
        if (err) return reject(err)
        resolve(results)
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
}

export default new SlaService()
