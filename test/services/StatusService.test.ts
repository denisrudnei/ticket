import mongoose from 'mongoose'
import StatusService from '../../server/services/ticket/StatusService'
import Status from '../../server/models/ticket/Status'
import 'mocha'

describe('Status', function() {
  this.timeout(0)
  it('Get status', async () => {
    await StatusService.getStatus()
  })

  it('Create new status', async () => {
    const status = new Status({
      name: 'test'
    })
    await StatusService.create(status)
  })

  it('Get one status', async () => {
    const status = await Status.findOne().exec()
    await StatusService.getOne(status._id)
  })

  it('Should return allowed status', async () => {
    const status1 = new Status({
      _id: new mongoose.Types.ObjectId(),
      name: 'status 1',
      slaRun: false
    })

    const status2 = new Status({
      _id: new mongoose.Types.ObjectId(),
      name: 'status 2',
      slaRun: false,
      allowedStatus: [status1._id]
    })

    await Status.create(status1, status2)
    await StatusService.getAllowedStatus(status2._id)
  })

  it('Edit status', async () => {
    const status = await Status.findOne().exec()
    const status2 = (await Status.find().exec())[1]
    status.allowedStatus = [status2._id]
    status.name = 'updated name'
    await StatusService.edit(status._id, status)
  })
})
