import KnowledgeService from '../../server/services/knowledge/KnowledgeService'
import Knowledge from '../../server/models/knowledge/Knowledge'
import Category from '../../server/models/ticket/Category'
import Group from '../../server/models/ticket/Group'
import { IKnowledgeFile } from '../../server/models/knowledge/KnowledgeFile'
import KnowledgeStatus from '../../server/models/knowledge/KnowledgeStatus'
import 'mocha'

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
    const knowledge = new Knowledge({
      name: 'test',
      preview: 'test',
      group: group._id,
      category: category
    })
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
    } as any
    const knowledge = await Knowledge.findOne().exec()
    await KnowledgeService.addFile(knowledge._id, file)
  })

  it('Add temporary file', async () => {
    const file = {
      data: 'test file',
      name: 'test name'
    } as any
    await KnowledgeService.addTempFile(file)
  })

  it('Get file', async () => {
    const knowledge = await Knowledge.findOne().exec()
    knowledge.files.forEach(async (f: IKnowledgeFile) => {
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
