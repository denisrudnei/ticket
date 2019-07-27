const StatusService = require('../../server/services/ticket/StatusService')

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
})
