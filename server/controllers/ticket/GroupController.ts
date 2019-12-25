import express from 'express'
import GroupService from '../../services/ticket/GroupService'

export default {
  getAll: (req: express.Request, res: express.Response) => {
    GroupService.getAll()
      .then(groups => {
        return res.status(200).json(groups)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  getOne: (req: express.Request, res: express.Response) => {
    GroupService.getOne(req.params.id)
      .then(group => {
        return res.status(200).json(group)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  create: (req: express.Request, res: express.Response) => {
    GroupService.create(req.body)
      .then(() => {
        res.sendStatus(201)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  insertAnalyst: (req: express.Request, res: express.Response) => {
    GroupService.insertAnalyst(req.params.groupId, req.body._id)
      .then(() => {
        return res.sendStatus(201)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  edit: (req: express.Request, res: express.Response) => {
    GroupService.edit(req.params.id, req.body)
      .then(group => {
        return res.status(200).json(group)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  remove: (req: express.Request, res: express.Response) => {
    GroupService.removeAnalyst(req.params.groupId, req.params.analystId)
      .then(() => {
        return res.sendStatus(201)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  }
}
