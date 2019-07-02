const AnalystService = require('../../server/services/AnalystService')
const AnalystSeed = require('../seeds/AnalystSeed')
const analyst = AnalystSeed.seed(1)[0]

test('Get analysts', () => {
  AnalystService.getAnalysts((err, result) => {
    expect(err).toBeNull()
    expect(result).toBeTruthy()
  })
})

test('Create new analyst', () => {
  AnalystService.create(analyst, (err, result) => {
    expect(err).toBeNull()
    expect(result).toBeTruthy()
  })
})

test('Get analyst in admin view', () => {
  AnalystService.getConfigAnalysts((err, result) => {
    expect(err).toBeNull()
    expect(result).toBeTruthy()
  })
})
