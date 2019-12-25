import express from 'express'
import { Types } from 'mongoose'
import { UploadedFile } from 'express-fileupload'
import TicketService from '../../services/ticket/TicketService'

export default {
  getTickets: (req: express.Request, res: express.Response) => {
    let sortBy = req.query.sortBy || 'created'
    const descending = parseInt(req.query.descending) || -1
    sortBy = {
      [sortBy]: descending
    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    TicketService.getTickets({}, sortBy, page, limit)
      .then(result => {
        return res.status(200).json(result)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  getByProfile: (req: express.Request, res: express.Response) => {
    const type = req.params.type
    let sortBy = req.query.sortBy || 'created'
    const descending = parseInt(req.query.descending) || -1
    sortBy = {
      [sortBy]: descending
    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const actualUser = req.session!.authUser._id

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
        // io.emit(`notification/${req.body.group._id}`, result.notification)
        // io.emit('addTicket', result.newTicket)
        return res.status(200).json(result)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  transfer: (req: express.Request, res: express.Response) => {
    TicketService.transferToGroup(req.params.id, req.body._id)
      .then(result => {
        // io.emit('updateTicket', result.newTicket)
        // io.emit(`notification/${req.body._id}`, result.notification)
        return res.status(200).json(result)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  updateStatus: async (req: express.Request, res: express.Response) => {
    await TicketService.changeStatus(req.params.id, req.body._id)
      .then(result => {
        // io.emit('updateTicket', result)
        return res.status(200).json(result)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  comment: (req: express.Request, res: express.Response) => {
    const userId = req.session!.authUser._id
    TicketService.commentOnTicket(req.params.id, userId, req.body.content)
      .then(result => {
        return res.status(201).json(result)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  getOne: (req: express.Request, res: express.Response) => {
    TicketService.getOne(req.params.id)
      .then(result => {
        return res.status(200).json(result)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  edit: (req: express.Request, res: express.Response) => {
    TicketService.updateOne(req.params.id, req.body)
      .then(result => {
        // io.emit('updateTicket', result)
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
    await TicketService.removeFile(req.params.id, req.params.file)
      .then(() => {
        return res.sendStatus(201)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  sendFile: async (req: express.Request, res: express.Response) => {
    const files = Object.values(req.files!) as UploadedFile[]
    await TicketService.insertFile(req.params.id, files)
      .then(result => {
        return res.status(200).json(result)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  }
}
