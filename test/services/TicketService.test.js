const faker = require('faker')
const Ticket = require('../../server/models/ticket/Ticket')
const TicketService = require('../../server/services/ticket/TicketService')
const Group = require('../../server/models/ticket/Group')
const Status = require('../../server/models/ticket/Status')
const Analyst = require('../../server/models/Analyst')

describe('Ticket', function() {
  this.timeout(0)
  it('Get All tickets', async () => {
    const sort = {
      category: -1
    }
    await TicketService.getTickets(sort, 1, 10)
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
    await TicketService.transferToGroup(ticket._id, group._id)
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
})
