const StatusService = require('../../server/services/ticket/StatusService')
const Status = require('../../server/models/ticket/Status')

describe('Status', () => {
  it('Get status', async () => {
    await StatusService.getStatus()
  })

  it('Create new status', async () => {
    const status = {
      name: 'test'
    }
    await StatusService.create(status)
  })
  it('Get one status', async () => {
    const status = await Status.findOne().exec()
    await StatusService.getOne(status._id)
  })

  it('Create new status', async () => {
    const status = await Status.findOne().exec()
    status.name = 'updated name'
    await StatusService.edit(status._id, status)
  })
})
