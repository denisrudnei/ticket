import GroupService from '../../server/services/ticket/GroupService'
import Analyst from '../../server/models/Analyst'
import Group from '../../server/models/ticket/Group'
import 'mocha'

describe('Groups', function() {
  this.timeout(0)

  it('Get all groups', async () => {
    await GroupService.getAll()
  })

  it('Create new Group', async () => {
    const group = new Group({
      name: 'Test group'
    })
    await GroupService.create(group)
  })

  it('Insert analyst', async () => {
    const analyst = await Analyst.findOne().exec()
    const group = await Group.findOne().exec()
    await GroupService.insertAnalyst(group._id, analyst._id)
  })

  it('Get one group', async () => {
    const group = await Group.findOne().exec()
    await GroupService.getOne(group._id)
  })

  it('Edit group info', async () => {
    const group = await Group.findOne().exec()
    group.name = 'test'
    await GroupService.edit(group._id, group)
  })

  it('Remove analyst', async () => {
    const analyst = await Analyst.findOne().exec()
    const group = await Group.findOne().exec()
    await GroupService.removeAnalyst(group._id, analyst._id)
  })
})
