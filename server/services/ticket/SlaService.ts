import Sla from '@/server/models/ticket/Sla'

class SlaService {
  getAll(): Promise<Sla[]> {
    return new Promise((resolve, reject) => {
      Sla.find().then((results: Sla[]) => {
        resolve(results)
      })
    })
  }

  getOne(slaId: Sla['id']): Promise<Sla> {
    return new Promise((resolve, reject) => {
      Sla.findOne(slaId).then(result => {
        resolve(result)
      })
    })
  }

  create(sla: Sla): Promise<Sla> {
    return new Promise((resolve, reject) => {
      const newSla = new Sla()
      newSla!.name = sla.name
      newSla!.limit = sla.limit

      resolve(Sla.create(newSla).save())
    })
  }

  edit(slaId: Sla['id'], slaToEdit: Sla): Promise<Sla> {
    return new Promise((resolve, reject) => {
      Sla.findOne(slaId).then(sla => {
        sla!.name = slaToEdit.name
        sla!.limit = slaToEdit.limit
        sla!.save().then(() => {
          resolve(this.getOne(slaId))
        })
      })
    })
  }
}

export default new SlaService()
