const faker = require('faker')
const mongoose = require('mongoose')
const Ticket = require('../../server/models/ticket/Ticket')
const TicketService = require('../../server/services/ticket/TicketService')
const Group = require('../../server/models/ticket/Group')
const Status = require('../../server/models/ticket/Status')
const Analyst = require('../../server/models/Analyst')
const Category = require('../../server/models/ticket/Category')

describe('Ticket', function() {
  this.timeout(0)

  it('Create new ticket', async () => {
    const status = await Status.findOne().exec()
    const group = await Group.findOne().exec()
    const category = await Category.findOne().exec()
    const openedBy = await Analyst.findOne().exec()
    const actualUser = await Analyst.findOne().exec()
    const newTicket = {
      _id: new mongoose.Types.ObjectId(),
      status: status._id,
      group: group._id,
      category: category._id,
      openedBy: openedBy._id,
      actualUser: actualUser._id,
      content: 'Content',
      resume: 'Resume'
    }
    TicketService.create(newTicket)
  })
  it('Get All tickets', async () => {
    const sort = {
      category: -1
    }
    await TicketService.getAll(sort, 1, 10)
  })

  it('Get one tickt by id', async () => {
    const ticket = await Ticket.findOne().exec()
    await TicketService.getOne(ticket._id)
  })

  it('Edit one ticket', async () => {
    const ticket = await Ticket.findOne().exec()
    ticket.content = faker.lorem.paragraphs()
    return TicketService.updateOne(ticket._id, ticket)
  })

  it('Transfer to group', async () => {
    const group = await Group.findOne().exec()
    const ticket = await Ticket.findOne().exec()
    await TicketService.transferToGroup(ticket._id, group._id, ticket.openedBy)
  })

  it('Change status', async () => {
    const status = await Status.findOne().exec()
    const ticket = await Ticket.findOne().exec()
    await TicketService.changeStatus(ticket._id, status._id)
  })

  it('Add comment in ticket', async () => {
    const analyst = await Analyst.findOne().exec()
    const ticket = await Ticket.findOne().exec()
    const content = faker.lorem.paragraphs()
    await TicketService.commentOnTicket(ticket._id, analyst._id, content)
  })

  it('Add file', async () => {
    const ticket = await Ticket.findOne().exec()
    const files = []
    files.push({
      name: 'testFile.txt',
      data: '',
      mimetype: 'text/*'
    })

    await TicketService.insertFile(ticket._id, files)
  })

  it('Get file', async () => {
    const ticket = await Ticket.findOne().exec()
    await TicketService.getFile(ticket.files[0].name)
  })

  it('Delete file', async () => {
    const ticket = await Ticket.findOne().exec()
    await TicketService.removeFile(ticket._id, ticket.files[0].name)
  })
})
