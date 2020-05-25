import express from 'express'
import NotificationService from '../../server/services/NotificationService'

export default {
  getOne: (req: express.Request, res: express.Response) => {
    NotificationService.getOne(parseInt(req.params.id)).then(notifications => {
      return res.status(200).json(notifications)
    })
  },

  getAll: (req: express.Request, res: express.Response) => {
    const userId = req.session!.authUser.id
    NotificationService.getAll(userId).then(notifications => {
      return res.status(200).json(notifications)
    })
  },

  read: (req: express.Request, res: express.Response) => {
    const userId = req.session!.authUser.id
    NotificationService.toggleRead(userId, parseInt(req.params.id)).then(
      notification => {
        return res.status(202).json(notification)
      }
    )
  },

  readAll: (req: express.Request, res: express.Response) => {
    const userId = req.session!.authUser.id
    NotificationService.readall(userId).then(notifications => {
      return res.status(200).json(notifications)
    })
  }
}
