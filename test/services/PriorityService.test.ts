import PriorityService from '../../server/services/PriorityService'
import Priority from '../../server/models/ticket/Priority'

describe('Priority', function() {
  it('Create new priority', async () => {
    await PriorityService.create(
      Priority.create({
        name: 'test',
        weight: 0
      })
    )
  })

  it('Get all priorities', async () => {
    await PriorityService.getAll()
  })

  it('Get one priority', async () => {
    const priority = await Priority.findOne()
    await PriorityService.getOne(priority!.id)
  })

  it('Edit priority', async () => {
    const priority = await Priority.findOne()
    const newPriority = Priority.create({
      ...priority,
      name: 'new name'
    })
    await PriorityService.edit(newPriority)
  })

  it('Edit many priorities', async () => {
    const priorities: Priority[] = await Priority.find()
    const newPriorities = priorities.map(p => {
      return Priority.create({
        ...p,
        name: 'newName'
      })
    })
    await PriorityService.editMany(newPriorities)
  })

  it('Remove a priority', async () => {
    const priority = await Priority.findOne()
    await PriorityService.remove(priority!.id)
  })
})
