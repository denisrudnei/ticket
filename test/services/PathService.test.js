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
    await PathService.create(path, userId)
  })

  it('Get all refs', async () => {
    await PathService.getRefs()
  })

  it('Get profile information', async () => {
    const userId = await getUserId()

    await PathService.getProfileInfo(userId)
  })

  it('Get paths', async () => {
    const userId = await getUserId()
    return PathService.getPaths(userId)
  })

  it('Delete path', async () => {
    const user = await Analyst.findOne({}).exec()
    const path = user.paths[0]
    await PathService.remove(path)
  })

  it('Get address', async () => {
    const userId = await getUserId()
    await PathService.getAddress(userId)
  })
})

function getUserId() {
  return new Promise(async (resolve, reject) => {
    const result = await Analyst.findOne({}).exec()
    if (result === null) return reject(new Error('User not found'))
    return resolve(result._id)
  })
}
