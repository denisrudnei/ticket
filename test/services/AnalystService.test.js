const expect = require('expect')
const AnalystService = require('../../server/services/AnalystService')
const AnalystSeed = require('../seeds/AnalystSeed')
const analyst = AnalystSeed.seed(1)[0]
it('Get analysts', function() {
  AnalystService.getAnalysts().then(result => {
    expect(result).toBeTruthy()
  })
})

it('Create new analyst', () => {
  AnalystService.create(analyst).then(result => {
    expect(result).toBeTruthy()
  })
})

it('Get analyst in admin view', () => {
  AnalystService.getConfigAnalysts().then(result => {
    expect(result).toBeTruthy()
  })
})
