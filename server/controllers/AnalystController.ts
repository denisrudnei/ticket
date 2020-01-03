import express from 'express'
import { UploadedFile } from 'express-fileupload'
import AnalystService from '~/server/services/AnalystService'
import Analyst from '~/server/models/Analyst'

export default {
  getAll: (req: express.Request, res: express.Response) => {
    AnalystService.getAnalysts()
      .then(analysts => {
        return res.status(200).json(analysts)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  getOne: (req: express.Request, res: express.Response) => {
    AnalystService.getOne(req.params.id)
      .then(analyst => {
        return res.status(200).json(analyst)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  getConfigAnalysts: (_: express.Request, res: express.Response) => {
    AnalystService.getConfigAnalysts()
      .then(analysts => {
        return res.status(200).json(analysts)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  create: (req: express.Request, res: express.Response) => {
    AnalystService.create(req.body)
      .then(() => {
        return res.sendStatus(201)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  getGroups: (req: express.Request, res: express.Response) => {
    const userId = req.params.id
    AnalystService.getGroups(userId)
      .then(groups => {
        return res.status(200).json(groups)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  editSound: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const userId = req.session!.authUser._id
    const soundConfig = {
      chat: {
        muted: req.body.chat.muted,
        volume: req.body.chat.volume
      },
      notification: {
        muted: req.body.notification.muted,
        volume: req.body.notification.volume
      }
    }
    AnalystService.setSoundConfig(userId, soundConfig)
      .then(() => {
        res.sendStatus(201)
      })
      .catch(next)
  },

  edit: (req: express.Request, res: express.Response) => {
    const userId = req.session!.authUser._id
    const analyst = new Analyst({
      name: req.body.name,
      contactEmail: req.body.contactEmail,
      color: req.body.color,
      address: req.body.address,
      mergePictureWithExternalAccount: req.body.mergePictureWithExternalAccount
    })
    AnalystService.updateAnalyst(userId, analyst)
      .then(() => {
        return res.sendStatus(202)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  updateImage: (req: express.Request, res: express.Response) => {
    const userId = req.session!.authUser._id
    const file = req.files!.image as UploadedFile
    AnalystService.updateImage(userId, file)
      .then(() => {
        return res.sendStatus(202)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  removeImage: (req: express.Request, res: express.Response) => {
    const userId = req.session!.authUser._id
    AnalystService.removeImage(userId)
      .then(() => {
        return res.sendStatus(202)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  remove: (req: express.Request, res: express.Response) => {
    const userId = req.params.id
    AnalystService.remove(userId)
      .then(() => {
        return res.sendStatus(200)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  }
}
