import express from 'express'
import PathService from '../services/PathService'
import Path from '../models/Path'

export default {
  getProfileInfo: (req: express.Request, res: express.Response) => {
    const userId = req.session!.authUser.id
    PathService.getProfileInfo(userId)
      .then(result => {
        return res.status(200).json(result)
      })
      .catch((e: Error) => {
        res.status(500).json(e)
      })
  },

  getRefs: (_: express.Request, res: express.Response) => {
    PathService.getRefs().then(result => {
      return res.status(200).json(result)
    })
  },

  createPath: (req: express.Request, res: express.Response) => {
    const path = new Path()
    path.name = req.body.name
    path.objectName = req.body.objectName
    path.property = req.body.property

    const userId = req.session!.authUser.id
    PathService.create(path, userId)
      .then(() => {
        return res.sendStatus(201)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  getPaths: (req: express.Request, res: express.Response) => {
    const userId = req.session!.authUser.id
    PathService.getPathsTree(userId)
      .then(result => {
        return res.status(200).json(result)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  getAddress: (req: express.Request, res: express.Response) => {
    const userId = req.session!.authUser.id
    PathService.getAddress(userId)
      .then(result => {
        return res.status(200).json(result)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  remove: (req: express.Request, res: express.Response) => {
    PathService.remove(req.session!.authUser.id, parseInt(req.params.id))
      .then(() => {
        return res.sendStatus(202)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  }
}
