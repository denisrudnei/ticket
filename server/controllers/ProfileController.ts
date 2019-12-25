import express from 'express'
import PathService from '../services/PathService'
import Path from '../models/Path'

export default {
  getProfileInfo: (req: express.Request, res: express.Response) => {
    const userId = req.session!.authUser._id
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
    const path = new Path({
      name: req.body.name,
      objectName: req.body.objectName,
      property: req.body.property
    })
    const userId = req.session!.authUser._id
    PathService.create(path, userId)
      .then(() => {
        return res.sendStatus(201)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  getPaths: (req: express.Request, res: express.Response) => {
    const userId = req.session!.authUser._id
    PathService.getPathsTree(userId)
      .then(result => {
        return res.status(200).json(result)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  getAddress: (req: express.Request, res: express.Response) => {
    const userId = req.session!.authUser._id
    PathService.getAddress(userId)
      .then(result => {
        return res.status(200).json(result)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  remove: (req: express.Request, res: express.Response) => {
    PathService.remove(req.session!.authUser._id, req.params.id)
      .then(() => {
        // io.emit('paths/updatePath')
        return res.sendStatus(202)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  }
}
