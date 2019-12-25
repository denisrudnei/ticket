import express from 'express'
import StatusService from '../../services/ticket/StatusService'

export default {
  getStatus: (req: express.Request, res: express.Response) => {
    StatusService.getStatus()
      .then(status => {
        return res.status(200).json(status)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  getOne: (req: express.Request, res: express.Response) => {
    StatusService.getOne(req.params.id)
      .then(status => {
        return res.status(200).json(status)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  create: (req: express.Request, res: express.Response) => {
    StatusService.create(req.body)
      .then(() => {
        return res.sendStatus(200)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  edit: (req: express.Request, res: express.Response) => {
    StatusService.edit(req.params.id, req.body)
      .then(() => {
        return res.sendStatus(202)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  }
}
