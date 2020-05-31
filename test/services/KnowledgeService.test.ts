import faker from 'faker'
import KnowledgeService from '../../server/services/knowledge/KnowledgeService'
import Knowledge from '../../server/models/knowledge/Knowledge'
import Category from '../../server/models/ticket/Category'
import Group from '../../server/models/ticket/Group'
import KnowledgeFile from '../../server/models/knowledge/KnowledgeFile'
import '../../server/models/knowledge/KnowledgeStatus'

describe('Knowledge', function() {
  this.timeout(10_000)
  it('Get all knowledges', async () => {
    await KnowledgeService.getAll()
  })

  it('Get not categorized', async () => {
    await KnowledgeService.getUnCategorized()
  })

  it('Create new knowledge', async () => {
    const group = await Group.findOne()
    const category = await Category.findOne()
    const knowledge = {
      name: 'test',
      preview: `<span>${faker.lorem.paragraphs()}</span`,
      group: group,
      category: category,
      url: ''
    } as Knowledge
    await KnowledgeService.create(knowledge)
  })

  it('Get all files', async () => {
    this.timeout(5000)
    const knowledge = await Knowledge.findOne()
    await KnowledgeService.getAllFiles(knowledge!.id)
  })

  it('Generate PDF', async () => {
    const knowledge = await Knowledge.findOne()
    await KnowledgeService.generatePDF(knowledge!.id)
  })

  it('Upload generated PDF', async () => {
    const knowledge = await Knowledge.findOne()
    await KnowledgeService.uploadPDF(knowledge!.name, knowledge!.preview)
  })

  it('Generate and upload PDF', async function() {
    this.timeout(10000)
    const knowledge = await Knowledge.findOne()
    await KnowledgeService.setPreviewInPDF(knowledge!.id, 'test name')
  })

  it('Update knowledge', async () => {
    const knowledge = await Knowledge.findOne()
    const group = await Group.findOne()
    const category = await Category.findOne()
    knowledge!.name = 'test_edit'
    knowledge!.category = category!
    knowledge!.group = group!
    await KnowledgeService.updateKnowledge(knowledge!.id, knowledge!)
  })

  it('Get by group', async () => {
    const group = await Group.findOne()
    await KnowledgeService.getByKnowledgeGroup(group!.name)
  })
  it('Get one knowledge', async () => {
    const knowledge = await Knowledge.findOne()
    await KnowledgeService.getOne(knowledge!.id)
  })

  it('Add file', async () => {
    const file = {
      data: 'test file',
      name: 'test name'
    } as any
    const knowledge = await Knowledge.findOne()
    await KnowledgeService.addFile(knowledge!.id, file)
  })

  it('Add temporary file', async () => {
    this.timeout(5000)
    const file = {
      data: 'test file',
      name: 'test name'
    } as any
    await KnowledgeService.addTempFile(file)
  })

  it('Get file', async () => {
    const knowledge = await Knowledge.findOne({}, { relations: ['files'] })
    knowledge!.files.forEach(async (f: KnowledgeFile) => {
      await KnowledgeService.getFile(f.id)
    })
  })

  it('Remove knowledge', async function() {
    this.timeout(5000)
    const knowledge = await Knowledge.findOne()
    await KnowledgeService.remove(knowledge!.id)
  })
})
