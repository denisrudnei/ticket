const KnowledgeService = require('../../server/services/knowledge/KnowledgeService')
const Knowledge = require('../../server/models/knowledge/Knowledge')
const Category = require('../../server/models/ticket/Category')
const Group = require('../../server/models/ticket/Group')
const KnowledgeStatus = require('../../server/models/knowledge/KnowledgeStatus')

describe('Knowledge', function() {
  this.timeout(0)
  it('Get all knowledges', async () => {
    await KnowledgeService.getAll()
  })

  it('Get not categorized', async () => {
    await KnowledgeService.getUnCategorized()
  })

  it('Create new knowledge', async () => {
    const group = await Group.findOne().exec()
    const category = await Category.findOne().exec()
    const knowledge = {
      name: 'test',
      preview: 'test',
      group: group._id,
      category: category
    }
    await KnowledgeService.create(knowledge)
  })

  it('Update knowledge', async () => {
    const knowledge = await Knowledge.findOne().exec()
    const group = await Group.findOne().exec()
    const category = await Category.findOne().exec()
    knowledge.name = 'test_edit'
    knowledge.category = category._id
    knowledge.group = group._id
    await KnowledgeService.updateKnowledge(knowledge._id, knowledge)
  })

  it('Get by group', async () => {
    const group = await Group.findOne().exec()
    await KnowledgeService.getByKnowledgeGroup(group.name)
  })
  it('Get one knowledge', async () => {
    const knowledge = await Knowledge.findOne().exec()
    await KnowledgeService.getOne(knowledge._id)
  })

  it('Add file', async () => {
    const file = {
      data: 'test file',
      name: 'test name'
    }
    const knowledge = await Knowledge.findOne().exec()
    await KnowledgeService.addFile(knowledge._id, file)
  })

  it('Add temporary file', async () => {
    const file = {
      data: 'test file',
      name: 'test name'
    }
    await KnowledgeService.addTempFile(file)
  })

  it('Get file', async () => {
    const knowledge = await Knowledge.findOne().exec()
    knowledge.files.forEach(async f => {
      await KnowledgeService.getFile(f._id)
    })
  })

  it('Get all files', async () => {
    const knowledge = await Knowledge.findOne().exec()
    await KnowledgeService.getAllFiles(knowledge._id)
  })

  it('Remove knowledge', async () => {
    const knowledge = await Knowledge.findOne().exec()
    await KnowledgeService.remove(knowledge._id)
  })
})
