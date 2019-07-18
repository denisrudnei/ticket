const expect = require('expect')
const mongoose = require('mongoose')
const TicketService = require('../../server/services/ticket/TicketService')

it('Get All tickets', () => {
  const sort = {
    category: -1
  }
  TicketService.getTickets(sort, 1, 10).then(result => {
    expect(result).toBeTruthy()
  })
})

it('Get one tickt by id', () => {
  // TODO
  TicketService.getOne('')
    .then(ticket => {
      expect(ticket).toBeTruthy()
    })
    .catch(e => {
      throw e
    })
})
