import PathService from '../../server/services/PathService'
import Analyst from '../../server/models/Analyst'
import Path from '../../server/models/Path'

describe('PathService', function() {
  it('Create new path', async () => {
    const user = await Analyst.findOne()
    const path = new Path()

    path.objectName = 'group'
    path.property = 'name'
    path.name = 'Per group'

    await PathService.create(path!, user!.id)
  })

  it('Get one path', async () => {
    const path = await Path.findOne()
    await PathService.getOnePathTree(path!.id)
  })

  it('Get paths from user', async () => {
    const user = await Analyst.findOne()
    await PathService.getPathsTree(user!.id)
  })

  it('Get all refs', async () => {
    await PathService.getRefs()
  })

  it('Get profile information', async () => {
    const user = await Analyst.findOne()
    await PathService.getProfileInfo(user!.id)
  })

  it('Get paths', async () => {
    const user = await Analyst.findOne()
    return PathService.getPaths(user!.id)
  })

  it('Delete path', async () => {
    const users = await Analyst.find({ relations: ['paths'] })
    const user = users.find(user => {
      return user.paths.length > 0
    })
    const path = user!.paths[0]
    await PathService.remove(user!.id, path.id)
  })

  it('Get address', async () => {
    const user = await Analyst.findOne()
    await PathService.getAddress(user!.id)
  })
})
