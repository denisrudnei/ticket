import PriorityService from '../../server/services/PriorityService'
import Priority, { IPriority } from '../../server/models/ticket/Priority'
import 'mocha'

describe('Priority', function() {
  this.timeout(0)

  it('Create new priority', async () => {
    await PriorityService.create(
      new Priority({
        name: 'test',
        weight: 0
      })
    )
  })

  it('Get all priorities', async () => {
    await PriorityService.getAll()
  })

  it('Get one priority', async () => {
    const priority = await Priority.findOne().exec()
    await PriorityService.getOne(priority._id)
  })

  it('Edit priority', async () => {
    const priority = await Priority.findOne().exec()
    const newPriority = new Priority({
      ...priority,
      name: 'new name'
    })
    await PriorityService.edit(newPriority)
  })

  it('Edit many priorities', async () => {
    const priorities = await Priority.find().exec()
    const newPriorities = priorities.map(p => {
      return new Priority({
        ...p,
        name: 'newName'
      })
    })
    await PriorityService.editMany(newPriorities as [IPriority])
  })

  it('Remove a priority', async () => {
    const priority = await Priority.findOne().exec()
    await PriorityService.remove(priority._id)
  })
})
