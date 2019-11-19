import PathService from '../../server/services/PathService'
import Analyst from '../../server/models/Analyst'
import Path from '../../server/models/Path'
describe('PathService', function() {
  this.timeout(0)

  it('Create new path', async () => {
    const userId = await getUserId()
    const path = new Path({
      path: 'group',
      group: 'name',
      name: 'Por grupo'
    })
    await PathService.create(path, userId)
  })

  it('Get one path', async () => {
    const path = await Path.findOne()
    await PathService.getOnePathTree(path._id)
  })

  it('Get paths from user', async () => {
    const user = await Analyst.findOne()
    await PathService.getPathsTree(user._id)
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
    await PathService.remove(user._id, path._id)
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
