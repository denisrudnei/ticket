import StatusService from '../../server/services/ticket/StatusService'
import Status from '../../server/models/ticket/Status'

describe('Status', () => {
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

  it('Create new status', async () => {
    const status = await Status.findOne().exec()
    status.name = 'updated name'
    await StatusService.edit(status._id, status)
  })
})
