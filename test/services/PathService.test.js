const PathService = require('../../server/services/PathService')
const Analyst = require('../../server/models/Analyst')

async function getUserId() {
  const analyst = await Analyst.find()
  return analyst[0]._id
}

test('Create new path', async done => {
  const userId = await getUserId()
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

test('Get all refs', () => {
  PathService.getRefs((err, result) => {
    expect(err).toBeNull()
    expect(result).toBeTruthy()
  })
})

test('Get profile information', async done => {
  const userId = await getUserId()
  PathService.getProfileInfo(userId, (err, result) => {
    expect(err).toBeNull()
    expect(result).toBeTruthy()
    done()
  })
})

test('Get paths', async () => {
  const userId = await getUserId()
  PathService.getPaths(userId, (_, result) => {
    expect(result).toBeTruthy()
  })
})
