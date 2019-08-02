const KnowledgeService = require('../../server/services/knowledge/KnowledgeService')
const Knowledge = require('../../server/models/knowledge/Knowledge')
const Category = require('../../server/models/ticket/Category')
const Group = require('../../server/models/ticket/Group')
const KnowledgeStatus = require('../../server/models/knowledge/KnowledgeStatus')

describe('Knowledge', () => {
  it('Get all knowledges', async () => {
    await KnowledgeService.getAll()
  })

  it('Create new knowledge', async () => {
    const group = await Group.findOne().exec()
    const category = await Category.findOne().exec()
    const knowledge = {
      name: 'test',
      preview: 'test',
      group: group._id,
      category: category._id
    }
    await KnowledgeService.create(knowledge)
  })

  it('Get one knowledge', async () => {
    const knowledge = await Knowledge.findOne().exec()
    await KnowledgeService.getOne(knowledge._id)
  })
})
