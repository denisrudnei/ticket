import Status from '../../models/ticket/Status'

class StatusService {
  getStatus(): Promise<Status[]> {
    return new Promise((resolve, reject) => {
      Status.find().then((status: Status[]) => {
        return resolve(status)
      })
    })
  }

  getOne(statusId: Status['id']): Promise<Status> {
    return new Promise((resolve, reject) => {
      Status.findOne(statusId).then(status => {
        return resolve(status)
      })
    })
  }

  create(status: Status): Promise<Status> {
    return new Promise((resolve, reject) => {
      const newStatus = new Status()
      Object.assign(newStatus, status)
      newStatus.save().then(() => {
        resolve(newStatus)
      })
    })
  }

  getAllowedStatus(id: Status['id']): Promise<Status[]> {
    return new Promise((resolve, reject) => {
      Status.findOne(id).then(result => {
        return resolve(result!.allowedStatus)
      })
    })
  }

  edit(statusId: Status['id'], statusToEdit: Status): Promise<Status> {
    return new Promise((resolve, reject) => {
      Status.findOne(statusId).then(status => {
        status!.name = statusToEdit.name
        status!.allowedStatus = statusToEdit.allowedStatus
        status!.slaRun = statusToEdit.slaRun
        status!.save().then(updated => {
          resolve(updated)
        })
      })
    })
  }
}

export default new StatusService()
