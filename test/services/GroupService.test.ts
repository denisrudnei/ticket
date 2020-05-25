import GroupService from '../../server/services/ticket/GroupService'
import Analyst from '../../server/models/Analyst'
import Group from '../../server/models/ticket/Group'

describe('Groups', function() {
  it('Get all groups', async () => {
    await GroupService.getAll()
  })

  it('Create new Group', async () => {
    const group = Group.create()
    group.name = 'Test group'
    group.description = 'test'

    await GroupService.create(group)
  })

  it('Insert analyst', async () => {
    const analyst = await Analyst.findOne()
    const group = await Group.findOne()
    await GroupService.insertAnalyst(group!.id, analyst!.id)
  })

  it('Get one group', async () => {
    const group = await Group.findOne()
    await GroupService.getOne(group!.id)
  })

  it('Edit group info', async () => {
    const group = await Group.findOne()
    group!.name = 'test'
    await GroupService.edit(group!.id, group!)
  })

  it('Remove analyst', async () => {
    const analyst = await Analyst.findOne()
    const group = await Group.findOne()
    await GroupService.removeAnalyst(group!.id, analyst!.id)
  })
})
