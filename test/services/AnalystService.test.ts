import fileUpload from 'express-fileupload'
import AnalystService from '../../server/services/AnalystService'
import Analyst from '../../server/models/Analyst'
import AnalystSeed from '../seeds/AnalystSeed'
import 'mocha'
const analyst = AnalystSeed(1)[0]

describe('Analyst', function() {
  this.timeout(0)

  it('Get analysts', async () => {
    await AnalystService.getAnalysts()
  })

  it('Create new analyst', async () => {
    await AnalystService.create(analyst)
  })

  it('Get analyst in admin view', async () => {
    await AnalystService.getConfigAnalysts()
  })

  it('Get one analyst', async () => {
    const toFind = await Analyst.findOne().exec()
    await AnalystService.getOne(toFind._id)
  })

  it('Remove user image', async () => {
    await AnalystService.removeImage(analyst._id)
  })

  it('Update one analyst', async () => {
    const a = await Analyst.findOne().exec()
    a.name = 'test'
    AnalystService.updateAnalyst(a._id, a)
  })

  it('Get analyst groups', async () => {
    await AnalystService.getGroups(analyst._id)
  })

  it('Update analyst image', async () => {
    const file = {
      name: 'test.txt',
      lastModifiedDate: Date.now(),
      data: ''
    } as any
    await AnalystService.updateImage(analyst._id.toString(), file)
  })

  it('Update sound config', async () => {
    await AnalystService.setSoundConfig(analyst, {
      chat: {
        muted: false,
        volume: 50
      },
      notification: {
        muted: true,
        volume: 15
      }
    })
  })

  it('Remove analyst image', async () => {
    await AnalystService.removeImage(analyst._id.toString())
  })

  it('Remove analyst', async () => {
    await AnalystService.remove(analyst._id)
  })
})
