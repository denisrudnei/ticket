import express from 'express'
import SearchService from '../../services/ticket/SearchService'

export default {
  searchTicket: (req: express.Request, res: express.Response) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    SearchService.getTickets(req.query, page, limit)
      .then(tickets => {
        return res.status(200).json(tickets)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  }
}
