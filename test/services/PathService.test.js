const expect = require('expect')
const PathService = require('../../server/services/PathService')
const Analyst = require('../../server/models/Analyst')
describe('PathService', function() {
  this.timeout(0)

  it('Create new path', async () => {
    const userId = await getUserId()
    const path = {
      path: 'group',
      group: 'name',
      name: 'Por grupo'
    }
    PathService.create(path, userId).then(paths => {
      expect(paths).toBeTruthy()
    })
  })

  it('Get all refs', () => {
    PathService.getRefs().then(result => {
      expect(result).toBeTruthy()
    })
  })

  it('Get profile information', async () => {
    const userId = await getUserId()

    PathService.getProfileInfo(userId).then(result => {
      expect(result).toBeTruthy()
    })
  })

  it('Get paths', async () => {
    const userId = await getUserId()
    PathService.getPaths(userId).then(result => {
      expect(result).toBeTruthy()
    })
  })
})

function getUserId() {
  return new Promise(async (resolve, reject) => {
    const result = await Analyst.findOne({}).exec()
    if (result === null) return reject(new Error('User not found'))
    return resolve(result._id)
  })
}
