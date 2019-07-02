const TicketService = require('../../server/services/TicketService')

test('Get All tickets', done => {
  const sort = {
    category: -1
  }
  TicketService.getTickets(sort, 1, 10, (err, result) => {
    expect(err).toBeNull()
    expect(result).toBeTruthy()
    done()
  })
})
