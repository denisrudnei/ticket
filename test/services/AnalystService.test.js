const expect = require('expect')
const AnalystService = require('../../server/services/AnalystService')
const AnalystSeed = require('../seeds/AnalystSeed')
const analyst = AnalystSeed.seed(1)[0]
it('Get analysts', function(done) {
  AnalystService.getAnalysts((err, result) => {
    expect(err).toBeNull()
    expect(result).toBeTruthy()
    done()
  })
})

it('Create new analyst', done => {
  AnalystService.create(analyst, (err, result) => {
    expect(err).toBeNull()
    expect(result).toBeTruthy()
    done()
  })
})

it('Get analyst in admin view', done => {
  AnalystService.getConfigAnalysts((err, result) => {
    expect(err).toBeNull()
    expect(result).toBeTruthy()
    done()
  })
})
