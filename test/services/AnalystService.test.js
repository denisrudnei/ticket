const AnalystService = require('../../server/services/AnalystService')
const AnalystSeed = require('../seeds/AnalystSeed')
const analyst = AnalystSeed.seed(1)[0]
it('Get analysts', async () => {
  await AnalystService.getAnalysts()
})

it('Create new analyst', async () => {
  await AnalystService.create(analyst)
})

it('Get analyst in admin view', async () => {
  await AnalystService.getConfigAnalysts()
})

it('Remove user image', async () => {
  await AnalystService.removeImage(analyst._id)
})
