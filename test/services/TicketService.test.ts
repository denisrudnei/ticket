import faker from 'faker'
import mongoose from 'mongoose'
import Ticket from '../../server/models/ticket/Ticket'
import TicketService from '../../server/services/ticket/TicketService'
import Group from '../../server/models/ticket/Group'
import Status from '../../server/models/ticket/Status'
import Analyst from '../../server/models/Analyst'
import Category from '../../server/models/ticket/Category'
import fileUpload, {UploadedFile} from 'express-fileupload'

describe('Ticket', function() {
  this.timeout(0)

  it('Create new ticket', async () => {
    const status = await Status.findOne().exec()
    const group = await Group.findOne().exec()
    const category = await Category.findOne().exec()
    const openedBy = await Analyst.findOne().exec()
    const actualUser = await Analyst.findOne().exec()
    const newTicket = new Ticket({
      _id: new mongoose.Types.ObjectId(),
      status: status._id,
      group: group._id,
      category: category._id,
      openedBy: openedBy._id,
      actualUser: actualUser._id,
      content: 'Content',
      resume: 'Resume'
    })
    TicketService.create(newTicket)
  })

  it('Copy a ticket', async () => {
    const user = await Analyst.findOne().exec()
    const ticket = await Ticket.findOne().exec()
    await TicketService.copyTicket(ticket!._id, user._id)
  })

  it('Get All tickets', async () => {
    const sort = {
      category: -1
    }
    await TicketService.getTickets({}, sort, 1, 10)
  })

  it('Get one ticket by id', async () => {
    const ticket = await Ticket.findOne().exec()
    await TicketService.getOne(ticket!._id)
  })

  it('Edit one ticket', async () => {
    const ticket = await Ticket.findOne().exec()
    ticket!.content = faker.lorem.paragraphs()
    return TicketService.updateOne(ticket!._id, ticket!)
  })

  it('Transfer to group', async () => {
    const group = await Group.findOne().exec()
    const ticket = await Ticket.findOne().exec()
    await TicketService.transferToGroup(ticket!._id, group._id)
  })

  it('Change status', async () => {
    const status = await Status.findOne().exec()
    const ticket = await Ticket.findOne().exec()
    await TicketService.changeStatus(ticket!._id, status._id)
  })

  it('Add comment in ticket', async () => {
    const analyst = await Analyst.findOne().exec()
    const ticket = await Ticket.findOne().exec()
    const content = faker.lorem.paragraphs()
    await TicketService.commentOnTicket(ticket!._id, analyst._id, content)
  })

  //it('Add file', async () => {
    //const ticket = await Ticket.findOne().exec()
    // const files: [UploadedFile] = [{
    //   name: 'testFile.txt',
    //   data: Buffer.from(''),
    //   mimetype: 'text/*',
    // }]

    //await TicketService.insertFile(ticket!._id, files)
  //})

  it('Get file', async () => {
    const ticket = await Ticket.findOne().exec()
    await TicketService.getFile(ticket!.files[0].name)
  })

  it('Delete file', async () => {
    const ticket = await Ticket.findOne().exec()
    await TicketService.removeFile(ticket!._id, ticket!.files[0].name)
  })
})
