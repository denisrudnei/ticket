const faker = require('faker')
const Ticket = require('../../server/models/ticket/Ticket')
const TicketService = require('../../server/services/ticket/TicketService')

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
})
