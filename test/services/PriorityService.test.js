const PriorityService = require('../../server/services/PriorityService')
const Priority = require('../../server/models/ticket/Priority')
describe('Priority', () => {
  it('Create new priority', async () => {
    await PriorityService.create({
      name: 'test',
      weight: 0
    })
  })
  it('Get all priorities', async () => {
    await PriorityService.getAll()
  })
  it('Edit priority', async () => {
    const priority = await Priority.findOne().exec()
    const newPriority = {
      ...priority,
      name: 'new name'
    }
    await PriorityService.edit(priority._id, newPriority)
  })

  it('Edit many priorities', async () => {
    const priorities = await Priority.find().exec()
    const newPriorities = priorities.map(p => {
      return {
        ...p,
        name: 'newName'
      }
    })
    await PriorityService.editMany(newPriorities)
  })

  it('Remove a priority', async () => {
    const priority = await Priority.findOne().exec()
    await PriorityService.remove(priority._id)
  })
})
