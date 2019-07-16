const expect = require('expect')
const TicketService = require('../../server/services/ticket/TicketService')

it('Get All tickets', () => {
  const sort = {
    category: -1
  }
  TicketService.getTickets(sort, 1, 10).then(result => {
    expect(result).toBeTruthy()
  })
})
