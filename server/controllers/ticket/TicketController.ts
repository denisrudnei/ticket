import express from 'express'
import { UploadedFile } from 'express-fileupload'
import TicketService from '../../services/ticket/TicketService'

export default {
  getTickets: (req: express.Request, res: express.Response) => {
    type Query = {
      descending: string
      sortBy: string
      page: string
      limit: string
    }
    const query = req.query as Query
    let sortBy: any = query.sortBy || 'created'
    const descending = parseInt(query.descending) || -1
    sortBy = {
      [sortBy]: descending
    }

    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 10

    TicketService.getTickets({}, sortBy, page, limit)
      .then(result => {
        return res.status(200).json(result)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  getByProfile: (req: express.Request, res: express.Response) => {
    type Query = { descending: string; page: string; limit: string }
    const query = req.query as Query
    const type = req.params.type
    let sortBy: any = req.query.sortBy || 'created'
    const descending = parseInt(query.descending) || -1
    sortBy = {
      [sortBy]: descending
    }

    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 10
    const actualUser = req.session!.authUser.id

    TicketService.getTickets(
      {
        [type]: actualUser
      },
      sortBy,
      page,
      limit
    )
      .then(result => {
        return res.status(200).json(result)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  create: (req: express.Request, res: express.Response) => {
    TicketService.create(req.body)
      .then(result => {
        return res.status(200).json(result)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  transfer: (req: express.Request, res: express.Response) => {
    TicketService.transferToGroup(parseInt(req.params.id), req.body.id)
      .then(result => {
        return res.status(200).json(result)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  updateStatus: async (req: express.Request, res: express.Response) => {
    await TicketService.changeStatus(parseInt(req.params.id), req.body.id)
      .then(result => {
        return res.status(200).json(result)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  comment: (req: express.Request, res: express.Response) => {
    const userId = req.session!.authUser.id
    TicketService.commentOnTicket(
      parseInt(req.params.id),
      userId,
      req.body.content
    )
      .then(result => {
        return res.status(201).json(result)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  getOne: (req: express.Request, res: express.Response) => {
    TicketService.getOne(parseInt(req.params.id))
      .then(result => {
        return res.status(200).json(result)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  edit: (req: express.Request, res: express.Response) => {
    TicketService.updateOne(parseInt(req.params.id), req.body)
      .then(result => {
        res.sendStatus(202)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  getFile: (req: express.Request, res: express.Response) => {
    TicketService.getFile(req.params!.id)
      .then(result => {
        return res.end(result)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  deleteFile: async (req: express.Request, res: express.Response) => {
    await TicketService.removeFile(
      parseInt(req.params.id),
      parseInt(req.params.file)
    )
      .then(() => {
        return res.sendStatus(201)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  sendFile: async (req: express.Request, res: express.Response) => {
    const files = Object.values(req.files!) as UploadedFile[]
    await TicketService.insertFile(parseInt(req.params.id), files)
      .then(result => {
        return res.status(200).json(result)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  }
}
