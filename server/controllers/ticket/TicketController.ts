import express from 'express'
import { UploadedFile } from 'express-fileupload'
import TicketService from '../../services/ticket/TicketService'

export default {
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
