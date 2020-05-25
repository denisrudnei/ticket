import fileUpload from 'express-fileupload'
import faker from 'faker'
import AnalystService from '../../server/services/AnalystService'
import Analyst from '../../server/models/Analyst'

describe('Analyst', function() {
  it('Get analysts', async () => {
    await AnalystService.getAnalysts()
  })

  it('Create new analyst', async () => {
    await AnalystService.create({
      email: faker.internet.email(),
      name: faker.internet.userName(),
      password: 'test'
    } as Analyst)
  })

  it('Get analyst in admin view', async () => {
    await AnalystService.getConfigAnalysts()
  })

  it('Get one analyst', async () => {
    const toFind = await Analyst.findOne()
    await AnalystService.getOne(toFind!.id)
  })

  it('Remove user image', async () => {
    const analyst = await Analyst.findOne()
    await AnalystService.removeImage(analyst!.id)
  })

  it('Update one analyst', async () => {
    const a = await Analyst.findOne()
    a!.name = 'test'
    AnalystService.updateAnalyst(a!.id, a!)
  })

  it('Get analyst groups', async () => {
    const analyst = await Analyst.findOne()
    await AnalystService.getGroups(analyst!.id)
  })

  it('Update analyst image', async function() {
    this.timeout(10000)
    const analyst = await Analyst.findOne()
    const file = {
      name: 'test.txt',
      lastModifiedDate: Date.now(),
      data: ''
    } as any
    await AnalystService.updateImage(analyst!.id, file)
  })

  // it('Update sound config', async () => {
  //   const analyst = await Analyst.findOne()
  //   await AnalystService.setSoundConfig(analyst, {
  //     chat: {
  //       muted: false,
  //       volume: 50
  //     },
  //     notification: {
  //       muted: true,
  //       volume: 15
  //     }
  //   })
  // })

  it('Remove analyst image', async function() {
    this.timeout(5000)
    const analyst = await Analyst.findOne()
    await AnalystService.removeImage(analyst!.id)
  })

  it('Remove analyst', async () => {
    const analyst = await Analyst.findOne()
    await AnalystService.remove(analyst!.id)
  })
})
