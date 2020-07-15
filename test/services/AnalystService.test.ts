import faker from 'faker'
import AnalystService from '../../server/services/AnalystService'
import Analyst from '../../server/models/Analyst'
import Sound from '../../server/models/Sound'
import Role from '~/server/models/Role'
import SoundType from '~/server/enums/SoundTypeEnum'

describe('Analyst', function() {
  this.timeout(10_000)
  it('Get analysts', async () => {
    await AnalystService.getAnalysts()
  })

  it('Create new analyst', async () => {
    await AnalystService.create({
      email: faker.internet.email(),
      name: faker.internet.userName(),
      role: await Role.findOne(),
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

  it('Update sound config', async () => {
    const analyst = await Analyst.findOne()
    const notificationSound = new Sound(SoundType.NOTIFICATION, analyst!.id)
    notificationSound.muted = false
    notificationSound.volume = 50
    const chatSound = new Sound(SoundType.CHAT, analyst!.id)

    chatSound.type = SoundType.NOTIFICATION
    chatSound.muted = true
    chatSound.volume = 15

    await AnalystService.setSoundConfig(analyst!.id, [
      notificationSound,
      chatSound
    ])
  })

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
