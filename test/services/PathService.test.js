const expect = require('expect')
const PathService = require('../../server/services/PathService')
const Analyst = require('../../server/models/Analyst')
describe('PathaSerivce', function() {
  this.timeout(0)

  it('Create new path', done => {
    getUserId((_, userId) => {
      const path = {
        path: 'group',
        group: 'name',
        name: 'Por grupo'
      }
      PathService.create(path, userId, (err, paths) => {
        expect(err).toBeNull()
        expect(paths).toBeTruthy()
        done()
      })
    })
  })

  it('Get all refs', done => {
    PathService.getRefs((err, result) => {
      expect(err).toBeNull()
      expect(result).toBeTruthy()
      done()
    })
  })

  it('Get profile information', done => {
    getUserId((_, userId) => {
      PathService.getProfileInfo(userId, (err, result) => {
        expect(err).toBeNull()
        expect(result).toBeTruthy()
        done()
      })
    })
  })

  it('Get paths', done => {
    getUserId((_, userId) => {
      PathService.getPaths(userId, (_, result) => {
        expect(result).toBeTruthy()
        done()
      })
    })
  })
})

function getUserId(callback) {
  Analyst.find().exec((err, result) => {
    if (err) return callback(err, null)
    return callback(err, result[0]._id)
  })
}
